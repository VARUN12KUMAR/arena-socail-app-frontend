import { useState } from 'react';
import { Heart, HeartFill, Chat } from 'react-bootstrap-icons';
import { interactionApi } from '@/services/api';
import CommentList from './CommentList';

interface PostCardProps {
  post: {
    id: number;
    content: string;
    timestamp: string;
    user: {
      username: string;
      wallet_address: string;
      profile_pic_url?: string;
    };
    likes?: Array<{ wallet_address: string }>;
  };
  currentUserWallet: string;
}

export default function PostCard({ post, currentUserWallet }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.likes?.some(like => like.wallet_address === currentUserWallet) ?? false);
  const [likeCount, setLikeCount] = useState(post.likes?.length ?? 0);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    setLikeError(null);
    try {
      await interactionApi.likePost(post.id, currentUserWallet);
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      setLikeError('Failed to like post. Please try again.');
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="card shadow-sm mb-4 mx-auto" style={{maxWidth: 600}}>
      <div className="card-body">
        <div className="d-flex align-items-center mb-2">
          <img
            src={post.user.profile_pic_url || '/default-avatar.png'}
            alt={post.user.username}
            className="rounded-circle border border-2 border-light bg-light me-3"
            style={{width: 48, height: 48, objectFit: 'cover'}}
          />
          <div className="flex-grow-1">
            <span className="fw-bold">{post.user.username}</span>
            <span className="text-muted small ms-2">{new Date(post.timestamp).toLocaleDateString()}</span>
          </div>
        </div>
        <p className="mb-3" style={{whiteSpace: 'pre-line'}}>{post.content}</p>
        <div className="d-flex align-items-center gap-3 mb-2">
          <button
            onClick={handleLike}
            className={`btn btn-sm ${isLiked ? 'btn-danger' : 'btn-outline-secondary'}`}
            style={{display: 'flex', alignItems: 'center'}}
          >
            {isLiked ? <HeartFill className="me-1" /> : <Heart className="me-1" />}
            {likeCount}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="btn btn-sm btn-outline-primary"
            style={{display: 'flex', alignItems: 'center'}}
          >
            <Chat className="me-1" />
            Comments
          </button>
        </div>
        {likeError && <div className="text-danger small mb-2">{likeError}</div>}
        {showComments && (
          <div className="mt-3">
            <CommentList postId={post.id.toString()} />
          </div>
        )}
      </div>
    </div>
  );
} 