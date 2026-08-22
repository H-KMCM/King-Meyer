
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { Lock, Shield, Building2, KeyRound } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'institutional' | 'admin'>('institutional');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { adminPassword, investorPassword } = useSite();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please enter an access code.');
      return;
    }

    if (activeTab === 'institutional') {
      if (password === investorPassword) {
        sessionStorage.setItem('km-institutional-auth', 'true');
        navigate('/institutional-portal');
      } else if (password === adminPassword) {
        // Smart fallback if admin logs in on institutional tab
        sessionStorage.setItem('km-auth', 'true');
        navigate('/admin');
      } else {
        setError('Invalid access code for the Institutional Portal.');
      }
    } else {
      if (password === adminPassword) {
        sessionStorage.setItem('km-auth', 'true');
        navigate('/admin');
      } else if (password === investorPassword) {
        // Smart fallback if investor logs in on admin tab
        sessionStorage.setItem('km-institutional-auth', 'true');
        navigate('/institutional-portal');
      } else {
        setError('Invalid access code for Administrator Access.');
      }
    }
  };

  return (
    <main className="min-h-screen pt-40 pb-20 bg-ghost flex items-center justify-center px-6">
      <div className="w-full max-w-lg mx-auto bg-white shadow-sm border border-slate-200/80 p-8 md:p-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-navy/5 text-navy mb-4 border border-navy/10">
            <Lock className="w-5 h-5 text-gold" />
          </div>
          <span className="text-gold text-xs uppercase tracking-[0.5em] font-bold block">
            Secure Authentication
          </span>
          <h1 className="text-navy text-3xl md:text-4xl mt-3 leading-tight font-serif font-bold">
            Portal Access
          </h1>
          <p className="text-slate text-sm font-light mt-3 max-w-sm mx-auto">
            Select your credential clearance to access verified research, capital accounts, or platform controls.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="mt-8 grid grid-cols-2 gap-2 p-1.5 bg-slate-100/80 border border-slate-200/60 rounded-md">
          <button
            type="button"
            onClick={() => {
              setActiveTab('institutional');
              setError('');
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold transition-all rounded ${
              activeTab === 'institutional'
                ? 'bg-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-navy hover:bg-white/60'
            }`}
          >
            <Building2 className="w-4 h-4 text-gold" />
            <span>Institutional</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setError('');
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold transition-all rounded ${
              activeTab === 'admin'
                ? 'bg-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-navy hover:bg-white/60'
            }`}
          >
            <Shield className="w-4 h-4 text-gold" />
            <span>Admin Access</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="text-gold uppercase text-xs tracking-widest font-bold">
                {activeTab === 'institutional' ? 'Institutional Access Code' : 'Admin Security Key'}
              </label>
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-slate-400" />
                256-bit SSL
              </span>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-ghost border border-slate/30 p-3.5 text-navy placeholder-slate/50 focus:outline-none focus:ring-2 focus:ring-gold transition-all text-sm"
              placeholder={
                activeTab === 'institutional'
                  ? 'Enter institutional access code'
                  : 'Enter admin security key'
              }
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs text-center rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full bg-navy text-white px-8 py-4 text-xs uppercase tracking-widest font-bold transition-all hover:bg-gold flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Authenticate &amp; Enter</span>
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200/80 text-center space-y-3">
          {activeTab === 'institutional' ? (
            <p className="text-slate text-xs font-light">
              Don't have an institutional clearance code?{' '}
              <Link to="/institutional-access" className="text-gold font-semibold hover:underline">
                Request Access Here
              </Link>
            </p>
          ) : (
            <p className="text-slate text-xs font-light">
              Executive and operations management only. Restricted internal protocol.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
