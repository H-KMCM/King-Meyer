
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy text-white/40 py-16 px-6 md:px-12 border-t border-white/10 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-[10px] tracking-[0.2em] uppercase leading-relaxed">
          King & Meyer Holdings Limited (Company No. 16053522) is an Appointed Representative of Thornbridge Investment Management LLP, which is authorised and regulated by the Financial Conduct Authority (FCA).
        </div>
        
        <div className="text-[9px] tracking-widest leading-relaxed opacity-60">
          DISCLAIMER: The information contained on this website is strictly directed at Professional Clients and Elective Professionals as defined by the Financial Conduct Authority. It is not intended for, nor should it be relied upon by, Retail Clients. This website is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any interest in any investment vehicle managed by King & Meyer. Past performance is not a reliable indicator of future results. Capital is at risk.
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] tracking-[0.3em]">
          <div className="uppercase">
            © 2026 KING & MEYER HOLDINGS LIMITED. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-8">
            <Link to="/institutional-login" className="hover:text-white transition-colors uppercase">Institutional Portal</Link>
            <Link to="/login" className="hover:text-white transition-colors uppercase">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
