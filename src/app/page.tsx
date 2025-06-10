'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import PostComposer from '@/components/PostComposer';
import PostCard from '@/components/PostCard';
import ProfileCard from '@/components/ProfileCard';
import { postApi, userApi } from '@/services/api';

interface Post {
  id: number;
  content: string;
  timestamp: string;
  user: {
    username: string;
    wallet_address: string;
    profile_pic_url?: string;
  };
  likes?: Array<{ wallet_address: string }>;
  comments?: Array<{
    id: number;
    content: string;
    timestamp: string;
    user: {
      username: string;
      wallet_address: string;
    };
  }>;
}

interface Profile {
  username: string;
  bio?: string;
  profile_pic_url?: string;
}

export default function Home() {
  const { address, isConnected } = useAccount();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postApi.getFeed();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchProfile = async () => {
    if (!address) return;
    try {
      const data = await userApi.getProfile(address);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    if (isConnected && mounted) {
      fetchPosts();
      fetchProfile();
    }
    setIsLoading(false);
  }, [isConnected, address, mounted]);

  // Show loading state during hydration
  if (!mounted) {
    return (
      <main className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p>Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isConnected) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Arina Social</h1>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </main>
    );
  }

  const handleComment = (postId: number) => {
    // TODO: Implement comment modal/form
    console.log('Comment on post:', postId);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-0">
      <div className="max-w-3xl mx-auto py-10 px-2 sm:px-0">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-2 drop-shadow">Arina Social</h1>
          <ConnectButton />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {profile && address && (
              <div className="mb-8">
                <ProfileCard
                  walletAddress={address as string}
                  initialProfile={profile}
                  onProfileUpdate={fetchProfile}
                />
              </div>
            )}

            {address && (
              <div className="mb-8">
                <PostComposer
                  walletAddress={address as string}
                  onPostCreated={fetchPosts}
                />
              </div>
            )}

            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserWallet={address as string}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
