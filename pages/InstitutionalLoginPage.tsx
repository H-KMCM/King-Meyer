
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

const InstitutionalLoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { investorPassword } = useSite();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === investorPassword) {
      sessionStorage.setItem('km-institutional-auth', 'true');
      navigate('/institutional-portal');
    } else {
      setError('Invalid Access Code.');
    }
  };

  return (
    <main className="min-h-screen pt-40 pb-20 bg-ghost flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-8 bg-white shadow-md">
        <div className="text-center">
          <span className="text-gold text-xs uppercase tracking-[0.5em] font-bold">Institutional Access</span>
          <h1 className="text-navy text-3xl md:text-5xl mt-6 leading-tight font-serif">
            Secure Portal Login
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="password" className="text-gold uppercase text-xs tracking-widest font-bold">Access Code</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full bg-ghost border border-slate/30 p-3 text-navy placeholder-slate/50 focus:outline-none focus:ring-2 focus:ring-gold transition-all"
              placeholder="Enter access code"
            />
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <div>
            <button type="submit" className="w-full bg-gold text-white px-10 py-4 text-sm uppercase tracking-widest font-bold transition-all hover:bg-amber-700">
              Authenticate
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default InstitutionalLoginPage;
