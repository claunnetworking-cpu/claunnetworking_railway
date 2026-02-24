import { Link, useLocation } from 'wouter';
import { Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [, navigate] = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAdmin(!!token);
  }, []);

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
          <button
            onClick={() => navigate('/admin')}
            className="hover:opacity-100 transition opacity-60 flex items-center gap-1 text-white"
            title="Painel Admin"
          >
            <Lock size={16} />
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-white/80 border-t border-white/20 pt-6">
          <p>© 2026 Claunnetworking. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
