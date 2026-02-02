
import React from 'react';
import { LayoutDashboard, Wallet, PieChart, Menu } from 'lucide-react';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={onLogoClick}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Wallet size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">ArthaAI</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-emerald-400 transition-colors">Market</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Analytics</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Learn</a>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="hidden sm:block px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-semibold transition-all shadow-md shadow-emerald-500/10">
            Login
          </button>
          <button className="md:hidden text-gray-400">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
