import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';

interface CommentProps {
  id: string;
  content: string;
  author: {
    wallet_address: string;
    username: string;
  };
  likes: number;
  dislikes: number;
  createdAt: string;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
}

const Comment: React.FC<CommentProps> = ({
  id,
  content,
  author,
  likes,
  dislikes,
  createdAt,
  onDelete,
  onLike,
  onDislike,
}) => {
  const { address } = useAccount();
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleLike = () => {
    if (!isLiked) {
      onLike(id);
      setIsLiked(true);
      setIsDisliked(false);
    }
  };

  const handleDislike = () => {
    if (!isDisliked) {
      onDislike(id);
      setIsDisliked(true);
      setIsLiked(false);
    }
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="font-semibold text-gray-800">{author.username}</span>
          <span className="text-gray-500 text-sm ml-2">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
        {address === author.wallet_address && (
          <button
            onClick={handleDelete}
            className="ml-2 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-100 hover:text-red-600 transition shadow border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200"
            title="Delete"
            aria-label="Delete comment"
            type="button"
          >
            <FiTrash2 size={22} />
          </button>
        )}
      </div>
      <p className="text-gray-700 mb-3 break-words">{content}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 px-3 py-1 rounded-full border transition ${isLiked ? 'bg-blue-100 border-blue-400 text-blue-600' : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600'}`}
          title="Like"
        >
          <FaThumbsUp />
          <span className="font-medium">{likes}</span>
        </button>
        <button
          onClick={handleDislike}
          className={`flex items-center gap-1 px-3 py-1 rounded-full border transition ${isDisliked ? 'bg-red-100 border-red-400 text-red-600' : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-400 hover:text-red-600'}`}
          title="Dislike"
        >
          <FaThumbsDown />
          <span className="font-medium">{dislikes}</span>
        </button>
      </div>
    </div>
  );
};

export default Comment; 