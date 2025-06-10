import { useState } from 'react';
import { postApi } from '@/services/api';
import { AxiosError } from 'axios';

interface PostComposerProps {
  walletAddress: string;
  onPostCreated: () => void;
}

export default function PostComposer({ walletAddress, onPostCreated }: PostComposerProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      await postApi.createPost({
        wallet_address: walletAddress,
        content: content.trim(),
      });
      setContent('');
      onPostCreated();
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create post';
        setError(errorMessage);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card shadow-sm mb-4 mx-auto" style={{maxWidth: 600}}>
      <div className="card-body">
        <div className="mb-3">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError(null);
            }}
            placeholder="What's on your mind?"
            maxLength={280}
            className={`form-control ${error ? 'is-invalid' : ''}`}
            rows={4}
          />
          <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="text-muted small">{content.length}/280</span>
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting || !walletAddress}
              className="btn btn-primary px-4"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
          {error && (
            <div className="invalid-feedback d-block mt-2">
              {error}
            </div>
          )}
        </div>
      </div>
    </form>
  );
} 