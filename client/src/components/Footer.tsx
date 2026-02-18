import { Link, useLocation } from 'wouter';
import { Wifi } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [, navigate] = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleShowMenu = () => {
    const token = localStorage.getItem('adminToken');
    setIsAdmin(!!token);
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setIsAdmin(false);
    setShowMenu(false);
    navigate('/');
  };

  return (
    <footer className="bg-primary text-white py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Links Legais */}
        <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm md:text-base items-center">
          <Link href="/privacy" className="hover:text-secondary transition">
            LGPD - Privacidade
          </Link>
          <span className="text-white/50">•</span>
          <Link href="/terms" className="hover:text-secondary transition">
            Termos e Condições
          </Link>
          <span className="text-white/50">•</span>
          <Link href="/access" className="hover:text-secondary transition">
            Política de Acesso
          </Link>
          <span className="text-white/50">•</span>
          
          {/* Menu Wi-Fi */}
          <div className="relative">
            <button
              onClick={handleShowMenu}
              className="hover:opacity-80 transition p-2 rounded-lg hover:bg-white/10 flex items-center gap-2"
              title="Menu de Acesso"
            >
              <Wifi size={20} className="text-secondary" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-2xl z-50 border border-gray-100">
                {isAdmin ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-primary">Painel Admin</p>
                      <p className="text-xs text-gray-600">{localStorage.getItem('adminEmail')}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/admin');
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors font-medium text-primary"
                    >
                      📊 Ir para Painel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-2 text-red-600 border-t border-gray-200"
                    >
                      🚪 Sair
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/login');
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors font-semibold text-primary"
                  >
                    🔐 Acessar Painel
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-white/80 border-t border-white/20 pt-6">
          <p>© 2026 Claunnetworking. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
