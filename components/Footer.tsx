
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy text-white/40 py-12 px-12 border-t border-white/10 text-[10px] tracking-widest uppercase text-center">
      © 2024 KING & MEYER HOLDINGS LIMITED. ALL RIGHTS RESERVED. PRIVATE OFFICE ACCESS ONLY.
      <div className="mt-4">
        <Link to="/login" className="opacity-50 hover:opacity-100 transition-opacity">Admin Access</Link>
      </div>
    </footer>
  );
};

export default Footer;
