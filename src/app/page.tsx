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
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="text-center">
          <div className="text-white text-3xl font-bold animate-pulse mb-4">Arena Social</div>
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </main>
    );
  }

  if (!isConnected) {
    return (
      <main style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #4f46e5 0%, #a21caf 50%, #ec4899 100%)' }}>
        <div style={{ width: '100%', maxWidth: 400, padding: 32, background: 'rgba(255,255,255,0.08)', borderRadius: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: 'white', marginBottom: 8, textAlign: 'center', letterSpacing: '-0.03em' }}>
            Arena
            <span style={{ background: 'linear-gradient(90deg, #facc15, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Social
            </span>
          </h1>
          <p style={{ fontSize: 18, color: '#c7d2fe', fontWeight: 500, marginTop: 8, marginBottom: 32, textAlign: 'center' }}>
            Connect, share, and engage with your Ethereum wallet
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <ConnectButton 
              chainStatus="icon" 
              showBalance={false} 
              accountStatus="address" 
            />
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
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Header Section */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Arena
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Social
              </span>
            </h1>
            <div className="transform hover:scale-105 transition-transform duration-200">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-lg font-medium">Loading your feed...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Profile Section */}
            {profile && address && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                <ProfileCard
                  walletAddress={address as string}
                  initialProfile={profile}
                  onProfileUpdate={fetchProfile}
                />
              </div>
            )}

            {/* Post Composer Section */}
            {address && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                <PostComposer
                  walletAddress={address as string}
                  onPostCreated={fetchPosts}
                />
              </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300"
                  >
                    <PostCard
                      post={post}
                      currentUserWallet={address as string}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No posts yet</h3>
                  <p className="text-indigo-200 text-lg">Be the first to share something amazing!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}