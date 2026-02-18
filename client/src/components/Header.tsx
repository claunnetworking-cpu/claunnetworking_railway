import { Wifi, Instagram, LogOut } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useState, useEffect } from 'react';

export default function Header() {
  const [, navigate] = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAdmin(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setIsAdmin(false);
    setShowMenu(false);
    navigate('/');
  };

  return (
    <header className="bg-primary text-white py-4 px-4 md:px-6 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <span className="font-bold text-lg md:text-xl">ClaunNetworking</span>
        </Link>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/claunnetworking?igsh=MXVidzdrNzdiOXIxcw%3D%3D&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition"
        >
          <Instagram size={24} />
        </a>
      </div>
    </header>
  );
}
