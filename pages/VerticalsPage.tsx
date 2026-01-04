
import React from 'react';

const verticals = [
  {
    number: '01',
    title: 'Quantitative Core (King & Meyer)',
    subtitle: 'The Engine of Liquidity.',
    description: 'Automated trading, fixed income, and Treasury management. This is our foundation of capital preservation and systematic compounding.'
  },
  {
    number: '02',
    title: 'Performance Infrastructure (NEON)',
    subtitle: 'The Engine of Talent.',
    description: 'The Neurodivergent Executive Optimisation Network. We provide clinical-grade diagnostics and performance architecture for the high-stakes executive class. We turn cognitive intensity into a sustainable institutional asset.'
  },
  {
    number: '03',
    title: 'Legacy Assets (Legacy Lifestyles & Vitae Monaco)',
    subtitle: 'The Engine of Stability.',
    description: 'Re-engineering the global infrastructure of longevity. From UK-based dementia villages to ultra-high-end longevity ecosystems in Monaco, we build asset-backed, cash-flowing environments that solve the looming solvency crisis in eldercare.'
  },
  {
    number: '04',
    title: 'Digital Integration (Legacy Line)',
    subtitle: 'The Engine of Scalability.',
    description: 'A data-driven, AI-assisted concierge layer for the elderly. We are building the early-service layer for the future of digital-human care integration.'
  }
];

const VerticalsPage: React.FC = () => {
  return (
    <main className="min-h-screen pt-40 pb-20 bg-ghost">
      <div className="px-12 md:px-24 max-w-7xl mx-auto">
        <span className="text-gold text-xs uppercase tracking-[0.5em] font-bold">Our Focus</span>
        <h1 className="text-navy text-4xl md:text-7xl mt-6 mb-20 leading-tight font-serif">
          An Ecosystem of Solvency.
        </h1>
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
