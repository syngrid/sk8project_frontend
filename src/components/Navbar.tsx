import React, { useState } from 'react';
import { Menu, ShieldCheck, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  
  const adminData = localStorage.getItem('user');
  const admin = adminData ? JSON.parse(adminData) : null;

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.clear();
      navigate('/Login');
    }
  };

  return (
    <div className="h-[75px] bg-primary flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        {/* Mobile Toggle */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all border border-white/10"
        >
          <Menu size={22} />
        </button>
      </div>

      <div className="flex items-center gap-4 md:gap-8 relative">
        {/* Admin Profile Section */}
        <div 
          className="flex items-center gap-4 pl-6 border-l border-white/10 group cursor-pointer relative"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="text-right hidden md:block">
            <p className="text-sm font-black text-white leading-none mb-1">Admin</p>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">{admin?.email || 'Administrator'}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white border-4 border-primary shadow-xl flex items-center justify-center text-primary transform group-hover:scale-105 transition-all">
             <ShieldCheck size={24} />
          </div>

          {/* Logout Dropdown */}
          {showDropdown && (
            <div className="absolute top-full right-0 mt-4 w-48 bg-white rounded-2xl shadow-2xl border border-primary/5 p-2 animate-fade-in z-[60]">
               <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 p-4 hover:bg-primary/5 text-primary rounded-xl transition-all font-black text-xs uppercase tracking-widest"
               >
                  <LogOut size={18} />
                  Logout
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-[55]" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default Navbar;
