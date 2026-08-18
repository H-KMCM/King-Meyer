
import React from 'react';

const verticals = [
  {
    number: '01',
    title: 'Quantitative Core (King & Meyer)',
    subtitle: 'The Engine of Liquidity.',
    description: 'Algorithmic execution, quantitative macro positioning, and systematic Treasury management. This forms our institutional foundation for capital preservation, tail-risk mitigation, and systematic compounding.'
  },
  {
    number: '02',
    title: 'Performance Infrastructure (NEON)',
    subtitle: 'The Engine of Human Capital.',
    description: 'Clinical-grade cognitive architecture and executive performance protocols. We engineer decision velocity and cognitive resilience for high-stakes operators, turning key-person human capital into an unassailable institutional asset.'
  },
  {
    number: '03',
    title: 'Legacy Assets (Legacy Lifestyles & Vitae Monaco)',
    subtitle: 'The Engine of Real Stability.',
    description: 'Demographic real estate and specialised healthcare infrastructure. From UK-based dementia care facilities to high-barrier longevity assets in Monaco, we develop inflation-hedged, cash-flowing physical environments.'
  },
  {
    number: '04',
    title: 'Digital Integration (Legacy Line)',
    subtitle: 'The Engine of Scalability.',
    description: 'Proprietary AI-assisted operational technology for healthcare ecosystems. A data-driven service layer designed to reduce OPEX, optimise care delivery, and scale operating margins across our physical real estate portfolio.'
  },
  {
    number: '05',
    title: 'Digital Infrastructure (Compute & Power)',
    subtitle: 'The Engine of Compute & Power.',
    description: 'Capitalising high-density Tier-4 AI data centre assets and securing sovereign-grade power grid entitlements. We acquire fibre-dense site control, engineer isolated infrastructure SPVs, and establish an inflation-hedged, hard-asset yield floor backed by long-term enterprise leases.'
  }
];

const VerticalsPage: React.FC = () => {
  return (
    <main className="min-h-screen pt-40 pb-20 bg-ghost">
      <div className="px-12 md:px-24 max-w-7xl mx-auto">
        <span className="text-gold text-xs uppercase tracking-[0.5em] font-bold">Our Focus</span>
        <h1 className="text-navy text-4xl md:text-7xl mt-6 mb-8 leading-tight font-serif">
          An Infrastructure of Structural Solvency.
        </h1>

        <div className="max-w-4xl mb-20 space-y-6">
          <h2 className="text-xl md:text-2xl font-serif text-navy font-bold">
            A Multidisciplinary Capital Core Built for Structural Solvency.
          </h2>
          <p className="text-slate text-base md:text-lg leading-relaxed font-light">
            King & Meyer operates as a strategic capital nucleus and quantitative holding platform optimised for multi-generational capital preservation, systematic compounding, and asset-backed durability. We deploy capital and operational resources across five core disciplines: quantitative liquidity execution, high-stakes human capital architecture, specialised demographic real estate, healthcare operational technology, and high-density digital compute infrastructure.
          </p>
          <p className="text-slate text-base md:text-lg leading-relaxed font-light">
            By unifying liquid quantitative strategies with inflation-hedged physical assets, our mandate is the systematic elimination of operational friction and tail-risk—ensuring balance-sheet resilience across all macroeconomic regimes.
          </p>
          
          <div className="pt-4 border-t border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest block mb-1">
              Institutional Governance & Regulatory Notice
            </span>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              Communications from King & Meyer are directed exclusively at Professional Clients, Institutional Investors, and Eligible Counterparties. King & Meyer does not offer financial products or investment services to retail clients. Where applicable, regulated financial activities are conducted strictly within authorised regulatory frameworks.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-20">
          {verticals.map((vertical) => (
            <div key={vertical.number} className="border-l-2 border-gold pl-8">
              <span className="text-gold text-5xl font-light">{vertical.number}</span>
              <h2 className="text-2xl font-bold text-navy mt-4 font-serif">{vertical.title}</h2>
              <h3 className="text-lg text-gold mt-2 italic font-serif">{vertical.subtitle}</h3>
              <p className="text-slate mt-4 leading-relaxed font-light">{vertical.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default VerticalsPage;
