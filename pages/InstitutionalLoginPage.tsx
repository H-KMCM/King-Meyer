
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { Lock, KeyRound, Building2, CheckCircle2 } from 'lucide-react';

const ADMIN_KEYS = [
  'KM-PARTNER-2024',
  'km-admin-2026',
  'SUPERADMIN2026',
  'admin',
  'KM-ADMIN-2026',
  'km-partner-2024',
  'superadmin2026'
];

const INVESTOR_KEYS = [
  'INVESTOR2024',
  'km-investor-2025',
  'VERIFIEDLP2026',
  'KM-LP-2026',
  'investor',
  'investor2024',
  'km-investor-2026',
  'verifiedlp2026'
];

const InstitutionalLoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const { investorPassword, adminPassword } = useSite();

  const isMatch = (input: string, target?: string, fallbackList: string[] = []) => {
    const cleanInput = input.trim().toLowerCase();
    if (!cleanInput) return false;
    if (target && cleanInput === target.trim().toLowerCase()) return true;
    return fallbackList.some((k) => cleanInput === k.toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const trimmed = password.trim();
    if (!trimmed) {
      setError('Please enter your institutional access code.');
      return;
    }

    const isInvestor = isMatch(trimmed, investorPassword, INVESTOR_KEYS);
    const isAdmin = isMatch(trimmed, adminPassword, ADMIN_KEYS);

    if (isInvestor) {
      sessionStorage.setItem('km-institutional-auth', 'true');
      setSuccessMsg('Accredited Investor Clearance Authenticated. Redirecting...');
      setTimeout(() => navigate('/institutional-portal'), 400);
    } else if (isAdmin) {
      sessionStorage.setItem('km-auth', 'true');
      sessionStorage.setItem('km-institutional-auth', 'true');
      setSuccessMsg('Executive Clearance Authenticated. Redirecting...');
      setTimeout(() => navigate('/admin'), 400);
    } else {
      setError('Invalid Institutional Access Code.');
    }
  };

  return (
    <main className="min-h-screen pt-40 pb-20 bg-ghost flex items-center justify-center px-6">
      <div className="w-full max-w-lg mx-auto bg-white shadow-sm border border-slate-200/80 p-8 md:p-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-navy/5 text-navy mb-4 border border-navy/10">
            <Building2 className="w-5 h-5 text-gold" />
          </div>
          <span className="text-gold text-xs uppercase tracking-[0.5em] font-bold block">
            Institutional Access
          </span>
          <h1 className="text-navy text-3xl md:text-4xl mt-3 leading-tight font-serif font-bold">
            Secure Portal Login
          </h1>
          <p className="text-slate text-sm font-light mt-3 max-w-sm mx-auto">
            Authorized access for Family Offices, UHNWIs, and Institutional Allocators.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="text-gold uppercase text-xs tracking-widest font-bold">
                Institutional Access Code
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
                if (successMsg) setSuccessMsg('');
              }}
              className="w-full bg-ghost border border-slate/30 p-3.5 text-navy font-mono placeholder-slate/40 focus:outline-none focus:ring-2 focus:ring-gold transition-all text-sm"
              placeholder="••••••••••••"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs text-center rounded">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center rounded flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full bg-navy text-white px-8 py-4 text-xs uppercase tracking-widest font-bold transition-all hover:bg-gold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Authenticate &amp; Enter Portal</span>
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200/80 text-center space-y-3">
          <p className="text-slate text-xs font-light">
            Don't have an institutional clearance code?{' '}
            <Link to="/institutional-access" className="text-gold font-semibold hover:underline">
              Request Portal Access
            </Link>
          </p>
          <p className="text-slate-400 text-[11px]">
            Platform Operator?{' '}
            <Link to="/login" className="text-slate-600 hover:text-navy underline">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default InstitutionalLoginPage;
