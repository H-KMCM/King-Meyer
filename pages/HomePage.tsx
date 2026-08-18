
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="min-h-screen bg-navy flex flex-col justify-center px-12 md:px-24 py-20">
        <div className="max-w-5xl fade-in">
          <div className="h-px bg-gold w-[60px] mb-8"></div>
          <h1 className="text-white text-4xl md:text-7xl mb-8 leading-[1.1] font-serif">
            Engineering Balance Sheet Solvency. <br className="hidden md:block" />
            Eliminating Cognitive Drag.
          </h1>
          <p className="text-slate text-xl md:text-2xl max-w-3xl mb-12 font-light leading-relaxed">
            King & Meyer is a strategic capital core and systematic quantitative platform. We deploy algorithmic risk architecture to eradicate human discretionary bias, neutralise structural yield erosion, and enforce long-term capital preservation.
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            <Link to="/the-doctrine" className="bg-gold text-white px-10 py-5 text-sm uppercase tracking-widest font-bold hover:bg-amber-700 transition-all text-center">
              View the Doctrine
            </Link>
            <Link to="/verticals" className="border border-white/20 text-white px-10 py-5 text-sm uppercase tracking-widest font-bold hover:bg-white hover:text-navy transition-all text-center">
              Strategic Verticals
            </Link>
          </div>
        </div>
      </section>

      {/* CORE PREMISE SECTION */}
      <section className="py-28 bg-white px-12 md:px-24 flex justify-center">
        <div className="max-w-4xl text-center">
          <span className="text-gold text-xs uppercase tracking-[0.5em] font-bold">The Core Premise</span>
          <h2 className="text-navy text-2xl md:text-4xl mt-8 italic leading-snug font-serif">
            "Capital erosion is not caused by market volatility—it is caused by human latency and unhedged structural friction."
          </h2>
          <p className="text-slate text-base md:text-lg mt-8 max-w-3xl mx-auto font-light leading-relaxed">
            Traditional capital allocation degrades under discretionary emotional drag, execution delays, and unhedged tail-risk shocks. King & Meyer bridges the gap between macro volatility and asset-backed durability through automated execution, strict risk boundaries, and institutional governance.
          </p>
          <div className="mt-12 pt-10 border-t border-slate-200/60 max-w-3xl mx-auto">
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-bold block mb-3">Structural Solvency</span>
            <p className="text-navy text-lg md:text-xl font-serif italic leading-relaxed">
              "Structural Solvency is the alignment of liquid quantitative execution, inflation-hedged physical infrastructure, and strict capital preservation parameters, ensuring multi-generational balance sheet durability regardless of macro regime shifts."
            </p>
          </div>
        </div>
      </section>

      {/* STRATEGIC THESIS PREVIEW */}
      <section className="py-24 bg-ghost px-12 md:px-24 border-t border-slate/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold text-xs uppercase tracking-[0.5em] font-bold">Core Architecture</span>
            <h2 className="text-navy text-2xl md:text-4xl mt-4 font-serif">Strategic Verticals & Risk Insulation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-white p-8 rounded-lg border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-gold font-mono text-xs uppercase tracking-widest mb-3">Pillar 01</div>
                <h3 className="text-navy text-xl font-bold font-serif mb-4">Zero Discretionary Drag</h3>
                <p className="text-slate text-sm font-light leading-relaxed">
                  Algorithmic execution eliminating emotional bias and human latency.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-gold font-mono text-xs uppercase tracking-widest mb-3">Pillar 02</div>
                <h3 className="text-navy text-xl font-bold font-serif mb-4">Structural Tail-Risk Insulation</h3>
                <p className="text-slate text-sm font-light leading-relaxed">
                  Systematic treasury, fixed-income, and futures risk management against macro regime shifts.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-gold font-mono text-xs uppercase tracking-widest mb-3">Pillar 03</div>
                <h3 className="text-navy text-xl font-bold font-serif mb-4">Capital Solvency Core</h3>
                <p className="text-slate text-sm font-light leading-relaxed">
                  Institution-grade risk boundaries verified by top-tier audit and regulatory infrastructure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
