
import React from 'react';

const focusAreas = [
  {
    title: 'The Care Crisis',
    description: 'Replacing failing state and low-tier private care with solvent, high-yield, human-centric infrastructure.'
  },
  {
    title: 'The Performance Gap',
    description: 'Solving the burn-out and under-utilization of the world’s most intense leaders (Neuro-Performance).'
  },
  {
    title: 'Capital Fragility',
    description: 'Moving away from speculative "growth" toward asset-backed, cash-flowing durability.'
  }
];

const SolvencyPage: React.FC = () => {
  return (
    <main className="min-h-screen pt-40 pb-20 bg-ghost">
      <div className="px-12 md:px-24 max-w-4xl mx-auto text-center">
        <span className="text-gold text-xs uppercase tracking-[0.5em] font-bold">Our Framework</span>
        <h1 className="text-navy text-4xl md:text-7xl mt-6 leading-tight font-serif">
          Impact is Alpha.
        </h1>
        <div className="mt-16 text-left max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-navy font-serif">The Thesis</h2>
          <p className="text-slate mt-4 text-xl leading-relaxed font-light italic">
            The greatest financial returns of the next 30 years will come from solving the world’s most acute systemic failures.
          </p>
        </div>
        <div className="mt-20 text-left max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-navy mb-8 font-serif">Our Focus Areas</h2>
          <div className="space-y-10">
            {focusAreas.map((area) => (
              <div key={area.title}>
                <h3 className="text-gold uppercase tracking-widest font-bold">{area.title}</h3>
                <p className="text-navy mt-2 text-lg leading-relaxed font-light">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SolvencyPage;
