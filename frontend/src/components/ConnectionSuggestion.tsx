import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionSuggestionProps {
  id: string;
  name: string;
  avatar?: string;
  mainArea: string;
  experienceYears: number;
  state: string;
  commonInterests: string[];
  onConnect?: () => void;
  isConnected?: boolean;
}

export default function ConnectionSuggestion({
  id,
  name,
  avatar,
  mainArea,
  experienceYears,
  state,
  commonInterests,
  onConnect,
  isConnected = false,
}: ConnectionSuggestionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 mb-4 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
            {name.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
          <p className="text-xs text-green-600 font-semibold">{mainArea}</p>
        </div>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-600 space-y-1 mb-3">
        <p>📍 {state}</p>
        <p>⏱️ {experienceYears} anos de experiência</p>
      </div>

      {/* Common Interests */}
      {commonInterests.length > 0 && (
        <div className="mb-3 pb-3 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Interesses em comum:</p>
          <div className="flex flex-wrap gap-1">
            {commonInterests.map((interest, i) => (
              <span
                key={i}
                className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
              >
                ✓ {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={onConnect}
        className={`w-full py-2 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${
          isConnected
            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        {isConnected ? (
          <>
            <Wifi className="w-4 h-4" />
            Conectado
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            Conectar
          </>
        )}
      </button>
    </div>
  );
}
