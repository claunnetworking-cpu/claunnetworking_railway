import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { LogOut, Home, User, MessageCircle, Settings } from 'lucide-react';

interface CommunityLayoutProps {
  children: ReactNode;
  userProfile?: {
    id: string;
    fullName: string;
    profilePhotoUrl?: string;
    mainArea: string;
    experienceYears: number;
    state: string;
    city: string;
  };
  rightSidebar?: ReactNode;
}

export default function CommunityLayout({
  children,
  userProfile,
  rightSidebar,
}: CommunityLayoutProps) {
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('communityUser');
    localStorage.removeItem('communityUserId');
    setLocation('/community');
  };

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-primary border-b border-primary/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary font-bold">
              C
            </div>
            <h1 className="text-2xl font-bold text-white">ClaunNetworking</h1>
          </div>
          <nav className="flex items-center gap-6">
            <button
              onClick={() => setLocation('/community/feed')}
              className="flex items-center gap-2 text-white hover:text-green-300 font-semibold transition"
            >
              <Home className="w-5 h-5" />
              Feed
            </button>
            <button
              onClick={() => setLocation('/community/messages')}
              className="flex items-center gap-2 text-white hover:text-green-300 font-semibold transition"
            >
              <MessageCircle className="w-5 h-5" />
              Mensagens
            </button>
            <button
              onClick={() => setLocation(`/community/profile/${userProfile?.id}`)}
              className="flex items-center gap-2 text-white hover:text-green-300 font-semibold transition"
            >
              <User className="w-5 h-5" />
              Perfil
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-300 hover:text-red-200 font-semibold transition"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content - 3 Columns */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Profile */}
          {userProfile && (
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                {/* Profile Photo */}
                <div className="mb-6 text-center">
                  {userProfile.profilePhotoUrl ? (
                    <img
                      src={userProfile.profilePhotoUrl}
                      alt={userProfile.fullName}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-green-500"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold">
                      {userProfile.fullName.charAt(0)}
                    </div>
                  )}
                  <h2 className="text-lg font-bold text-gray-900">{userProfile.fullName}</h2>
                  <p className="text-sm text-green-600 font-semibold">{userProfile.mainArea}</p>
                </div>

                {/* Profile Info */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Experiência</p>
                    <p className="text-sm text-gray-900">{userProfile.experienceYears} anos</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Localização</p>
                    <p className="text-sm text-gray-900">
                      {userProfile.city}, {userProfile.state}
                    </p>
                  </div>
                </div>

                {/* Menu */}
                <div className="space-y-2 border-t border-gray-200 pt-4 mt-4">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition">
                    ✏️ Editar Perfil
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition">
                    📋 Recados
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition">
                    🖼️ Álbum
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition">
                    ⚙️ Configurações
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Center - Main Content */}
          <div className={userProfile ? 'col-span-6' : 'col-span-9'}>
            {children}
          </div>

          {/* Right Sidebar - Suggestions/Info */}
          {rightSidebar && (
            <div className="col-span-3">
              <div className="sticky top-24">
                {rightSidebar}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
