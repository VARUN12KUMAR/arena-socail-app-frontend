import { useState } from 'react';
import { userApi } from '@/services/api';

interface ProfileCardProps {
  walletAddress: string;
  initialProfile?: {
    username: string;
    bio?: string;
    profile_pic_url?: string;
  };
  onProfileUpdate: () => void;
}

export default function ProfileCard({ walletAddress, initialProfile, onProfileUpdate }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile || {
    username: `user_${walletAddress.slice(0, 6)}`,
    bio: '',
    profile_pic_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await userApi.updateProfile({
        wallet_address: walletAddress,
        ...profile,
      });
      setIsEditing(false);
      onProfileUpdate();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="card shadow-sm mb-4 mx-auto" style={{maxWidth: 480}}>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="bio" className="form-label">Bio</label>
            <textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={3}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="profilePic" className="form-label">Profile Picture URL</label>
            <input
              type="text"
              id="profilePic"
              value={profile.profile_pic_url}
              onChange={(e) => setProfile({ ...profile, profile_pic_url: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-outline-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="card shadow-sm mb-4 mx-auto text-center" style={{maxWidth: 480}}>
      <div className="card-body">
        <div className="mb-3">
          <img
            src={profile.profile_pic_url || '/default-avatar.png'}
            alt={profile.username}
            className="rounded-circle border border-3 border-light shadow-sm bg-light"
            style={{width: 96, height: 96, objectFit: 'cover', marginTop: -48}}
          />
        </div>
        <h2 className="h4 fw-bold mb-1">{profile.username}</h2>
        <p className="text-muted small mb-2" style={{wordBreak: 'break-all'}}>{walletAddress}</p>
        {profile.bio && (
          <p className="mb-2">{profile.bio}</p>
        )}
        <button
          onClick={() => setIsEditing(true)}
          className="btn btn-outline-primary btn-sm mt-2"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
} 