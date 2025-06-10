import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Comment from './Comment';
import { commentApi } from '@/services/api';

interface CommentListProps {
  postId: string;
}

interface CommentData {
  id: string;
  content: string;
  author: {
    wallet_address: string;
    username: string;
  };
  likes: number;
  dislikes: number;
  createdAt: string;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState('');
  const { address } = useAccount();

  const fetchComments = async () => {
    try {
      const data = await commentApi.getComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !address) return;

    try {
      const response = await commentApi.createComment(postId, {
        content: newComment,
        wallet_address: address
      });
      setComments([response, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!address) return;
    
    try {
      await commentApi.deleteComment(commentId, address);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!address) return;
    
    try {
      const response = await commentApi.likeComment(commentId, address);
      setComments(comments.map(comment =>
        comment.id === commentId ? response : comment
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDislike = async (commentId: string) => {
    if (!address) return;
    
    try {
      const response = await commentApi.dislikeComment(commentId, address);
      setComments(comments.map(comment =>
        comment.id === commentId ? response : comment
      ));
    } catch (error) {
      console.error('Error disliking comment:', error);
    }
  };

  return (
    <div className="mt-6">
      {address && (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="btn btn-primary px-6 py-2 rounded-lg shadow-sm"
              disabled={!newComment.trim()}
            >
              Post Comment
            </button>
          </div>
        </form>
      )}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            {...comment}
            onDelete={handleDelete}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentList; 