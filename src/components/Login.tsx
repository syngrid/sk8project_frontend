import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clear stale data on mount to ensure tokens are only generated AFTER login
  useEffect(() => {
    localStorage.clear();
    // Also clear specific keys to be safe
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/admin/login', { email, password });
      
      // Store tokens ONLY after successful login
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.admin));
      
      // Note: refreshToken is stored in a secure HttpOnly cookie by the server, 
      // not in localStorage, for FAANG-level security.
      
      navigate('/Dashboard');
    } catch (err: any) {
      setError('!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden font-sans">
      {/* Balanced Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-16 relative overflow-hidden rounded-xl shadow-2xl">
        <div className="absolute inset-0 bg-white/10 opacity-50 blur-[100px] animate-pulse"></div>
        <div className="relative z-10 w-full max-w-md animate-fade-in flex flex-col items-center">
          <img 
            src="/login_bg.png" 
            alt="" 
            className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] transition-transform duration-700 hover:scale-105"
            style={{ filter: 'sepia(0.5) saturate(2) brightness(1.1)' }} 
          />
        </div>
      </div>

      {/* Balanced Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-[420px] animate-fade-in">
          <div className="bg-white p-12 md:p-14 rounded-xl shadow-[0_25px_60px_rgba(221,153,51,0.15)] border border-primary/5">
            {/* Logo */}
            <div className="flex justify-center mb-12">
              <div className="h-14 flex items-center p-3 bg-white rounded-lg shadow-sm border border-primary/5">
                <img 
                  src="/company_Logo.png" 
                  alt="" 
                  className="h-full w-auto object-contain"
                />
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-primary/5 border border-primary/10 text-primary p-4 rounded-lg font-semibold text-center animate-shake">
                  !
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-black ml-1 uppercase tracking-[0.2em]">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-primary/30 group-focus-within:text-primary transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-lg text-sm text-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all font-bold"
                    placeholder="Email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-black ml-1 uppercase tracking-[0.2em]">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-primary/30 group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-14 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-lg text-sm text-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all font-bold"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-primary/30 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4.5 bg-primary hover:bg-secondary text-white font-semibold rounded-lg shadow-xl shadow-primary/20 transform active:scale-[0.97] transition-all flex items-center justify-center gap-3 mt-4 group"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    Login
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
