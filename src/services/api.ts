import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message: string }>) => {
    if (error.code === 'ERR_NETWORK') {
      const errorMessage = 'Network error - Please check if the backend server is running';
      console.error(errorMessage);
      throw new Error(errorMessage);
    } else if (error.response) {
      const errorMessage = error.response.data?.message || 'An error occurred';
      const errorDetails = {
        status: error.response.status,
        message: errorMessage,
        url: error.response.config?.url || 'unknown',
      };
      console.error('API Error:', errorDetails);
      
      // For 404 errors, let the calling code handle it
      if (error.response.status === 404) {
        return Promise.reject(new Error(errorMessage));
      }
      
      throw new Error(errorMessage);
    } else {
      const errorMessage = 'An unexpected error occurred';
      console.error(errorMessage, error);
      throw new Error(errorMessage);
    }
  }
);

// User related API calls
export const userApi = {
  getProfile: async (walletAddress: string) => {
    try {
      const response = await api.get(`/users/${walletAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  updateProfile: async (data: { wallet_address: string; username?: string; bio?: string; profile_pic_url?: string }) => {
    try {
      const response = await api.post('/users', data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};

// Post related API calls
export const postApi = {
  getFeed: async () => {
    try {
      const response = await api.get('/posts');
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching feed:', error.message);
        throw error;
      }
      throw new Error('Failed to fetch feed');
    }
  },

  createPost: async (data: { wallet_address: string; content: string }) => {
    try {
      if (!data.wallet_address) {
        throw new Error('Wallet address is required');
      }
      if (!data.content) {
        throw new Error('Post content is required');
      }

      // First ensure user exists
      try {
        await api.get(`/users/${data.wallet_address}`);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          // User doesn't exist, create a default profile
          const defaultUsername = `user_${data.wallet_address.slice(0, 6)}`;
          console.log('Creating new user with username:', defaultUsername);
          await api.post('/users', {
            wallet_address: data.wallet_address,
            username: defaultUsername,
          });
        } else {
          throw error;
        }
      }

      // Now create the post
      console.log('Creating post with data:', data);
      const response = await api.post('/posts', data);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating post:', error.message);
        throw error;
      }
      throw new Error('Failed to create post');
    }
  },

  getPost: async (id: number) => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching post:', error.message);
        throw error;
      }
      throw new Error('Failed to fetch post');
    }
  },
};

// Interaction related API calls
export const interactionApi = {
  likePost: async (postId: number, walletAddress: string) => {
    try {
      const response = await api.post(`/posts/${postId}/like`, { wallet_address: walletAddress });
      return response.data;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  commentPost: async (postId: number, data: { wallet_address: string; content: string }) => {
    try {
      const response = await api.post(`/posts/${postId}/comment`, data);
      return response.data;
    } catch (error) {
      console.error('Error commenting on post:', error);
      throw error;
    }
  },
};

// Comment related API calls
export const commentApi = {
  getComments: async (postId: string) => {
    try {
      const response = await api.get(`/comments/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  createComment: async (postId: string, data: { content: string; wallet_address: string }) => {
    try {
      const response = await api.post(`/comments/${postId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  deleteComment: async (commentId: string, walletAddress: string) => {
    try {
      const response = await api.delete(`/comments/${commentId}`, {
        data: { wallet_address: walletAddress }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  likeComment: async (commentId: string, walletAddress: string) => {
    try {
      const response = await api.post(`/comments/${commentId}/like`, {
        wallet_address: walletAddress
      });
      return response.data;
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  },

  dislikeComment: async (commentId: string, walletAddress: string) => {
    try {
      const response = await api.post(`/comments/${commentId}/dislike`, {
        wallet_address: walletAddress
      });
      return response.data;
    } catch (error) {
      console.error('Error disliking comment:', error);
      throw error;
    }
  }
};

export { api }; 