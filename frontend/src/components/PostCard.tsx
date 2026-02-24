import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreVertical, Flag, Wifi } from 'lucide-react';

interface PostCardProps {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    mainArea: string;
  };
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onConnectionRequest?: (userId: string, userName: string) => void;
  isLiked?: boolean;
}

export default function PostCard({
  id,
  author,
  content,
  imageUrl,
  likes,
  comments,
  shares,
  createdAt,
  onLike,
  onComment,
  onShare,
  onReport,
  onConnectionRequest,
  isLiked = false,
}: PostCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'agora';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-6 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
              {author.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-bold text-gray-900">{author.name}</h3>
            <p className="text-xs text-green-600 font-semibold">{author.mainArea} • {timeAgo(createdAt)}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                onClick={() => {
                  onReport?.();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-lg"
              >
                <Flag className="w-4 h-4" />
                Denunciar postagem
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-800 mb-4 leading-relaxed">{content}</p>

      {/* Image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Post"
          className="w-full rounded-lg mb-4 max-h-96 object-cover"
        />
      )}

      {/* Interactions */}
      <div className="flex items-center justify-between text-xs text-gray-600 border-t border-gray-200 pt-3 mb-3">
        <span>{likes} curtidas</span>
        <span>{comments} comentários • {shares} compartilhamentos</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-around border-t border-gray-200 pt-3">
        <button
          onClick={onLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${
            isLiked
              ? 'text-red-600 bg-red-50'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-semibold">Curtir</span>
        </button>
        <button
          onClick={onComment}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">Comentar</span>
        </button>
        <button
          onClick={() => onConnectionRequest?.(author.id, author.name)}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-green-600 hover:bg-green-50 rounded-lg transition font-semibold"
          title="Conectar com este usuário"
        >
          <Wifi className="w-5 h-5" />
          <span className="text-sm">Conectar</span>
        </button>
        <button
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-semibold">Compartilhar</span>
        </button>
      </div>
    </div>
  );
}
