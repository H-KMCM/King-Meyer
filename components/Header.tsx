
import React from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

const Header: React.FC = () => {
  const { slogan } = useSite();

  return (
    <header className="fixed top-0 w-full z-50 bg-navy text-white py-6 px-12 flex justify-between items-center border-b border-white/10">
      <div>
        <Link to="/" className="text-xl font-bold tracking-widest uppercase">
          King <span className="text-gold">&</span> Meyer
        </Link>
        {slogan && <p className="text-slate/50 text-[10px] tracking-widest mt-1">{slogan}</p>}
      </div>
      <nav className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] font-semibold">
        <Link to="/the-doctrine" className="hover:text-gold transition-colors">The Doctrine</Link>
        <Link to="/verticals" className="hover:text-gold transition-colors">Verticals</Link>
        <Link to="/solvency" className="hover:text-gold transition-colors">Systemic Solvency</Link>
        <Link to="/intelligence-theses" className="hover:text-gold transition-colors">Intelligence &amp; Theses</Link>
        <Link to="/institutional-access" className="hover:text-gold transition-colors">Institutional Access</Link>
        <Link to="/inquiry" className="border border-gold px-4 py-1 hover:bg-gold hover:text-white transition-colors">Strategic Inquiry</Link>
      </nav>
    </header>
  );
};

export default Header;