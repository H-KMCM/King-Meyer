
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { logo } = useSite();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMenuOpen]);

  // Links for Mobile Menu
  const MobileNavLinks = () => (
    <>
      <Link to="/the-doctrine" className="hover:text-gold transition-colors block py-3">The Doctrine</Link>
      <Link to="/verticals" className="hover:text-gold transition-colors block py-3">Verticals</Link>
      <Link to="/solvency" className="hover:text-gold transition-colors block py-3">Systemic Solvency</Link>
      <Link to="/intelligence-theses" className="hover:text-gold transition-colors block py-3">Intelligence &amp; Theses</Link>
      <Link to="/institutional-access" className="hover:text-gold transition-colors block py-3">Institutional Access</Link>
      <Link to="/inquiry" className="border border-gold px-6 py-3 mt-4 inline-block hover:bg-gold hover:text-white transition-colors">Strategic Inquiry</Link>
    </>
  );

  // Links for Desktop Menu
  const DesktopNavLinks = () => (
      <>
        <Link to="/the-doctrine" className="hover:text-gold transition-colors">The Doctrine</Link>
        <Link to="/verticals" className="hover:text-gold transition-colors">Verticals</Link>
        <Link to="/solvency" className="hover:text-gold transition-colors">Systemic Solvency</Link>
        <Link to="/intelligence-theses" className="hover:text-gold transition-colors">Intelligence &amp; Theses</Link>
        <Link to="/institutional-access" className="hover:text-gold transition-colors">Institutional Access</Link>
        <Link to="/inquiry" className="border border-gold px-4 py-1 hover:bg-gold hover:text-white transition-colors">Strategic Inquiry</Link>
      </>
  );

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-navy text-white py-6 px-6 md:px-12 flex justify-between items-center border-b border-white/10 h-[89px]">
        <div>
          <Link to="/">
            {logo ? (
              <img src={logo} alt="King & Meyer Logo" className="max-h-12" />
            ) : (
              <span className="text-xl font-bold tracking-widest uppercase">
                King <span className="text-gold">&</span> Meyer
              </span>
            )}
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] font-semibold">
          <DesktopNavLinks />
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" className="relative z-50">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 left-0 w-full h-full bg-navy z-40 transform transition-transform duration-300 ease-in-out md:hidden pt-[89px] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <nav className="flex flex-col items-center justify-center h-full text-center gap-4 text-white text-base uppercase tracking-[0.2em] font-semibold -mt-[89px]">
          <MobileNavLinks />
        </nav>
      </div>
    </>
  );
};

export default Header;
