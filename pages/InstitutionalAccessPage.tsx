
import React from 'react';

const InstitutionalAccessPage: React.FC = () => {
  return (
    <main className="min-h-screen pt-40 pb-20 bg-navy text-white">
      <div className="px-12 md:px-24 max-w-4xl mx-auto text-center">
        <span className="text-gold text-xs uppercase tracking-[0.5em] font-bold">Institutional Access</span>
        <h1 className="text-4xl md:text-7xl mt-6 leading-tight font-serif">
          Qualified Capital & Strategic Allocation.
        </h1>
        <p className="text-slate-300 mt-12 max-w-2xl mx-auto text-xl leading-relaxed font-light">
          King & Meyer does not accept retail capital. Our platform is reserved for Family Offices, UHNWIs, and Institutional Allocators who seek exposure to high-conviction, managed-risk verticals.
        </p>
        <div className="mt-16 border-t border-white/10 pt-12">
          <h2 className="text-gold uppercase tracking-widest font-bold">Access Requirements</h2>
          <p className="text-slate-300 mt-4 text-lg leading-relaxed font-light">
            Entry to the Investor Portal requires verification of institutional status.
          </p>
          <div className="mt-12">
            <button className="bg-gold text-white px-10 py-5 text-sm uppercase tracking-widest font-bold hover:bg-amber-700 transition-all text-center">
              Request Access / Secure Login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InstitutionalAccessPage;
