
import React from 'react';

const focusAreas = [
  {
    title: 'The Demographic Imbalance',
    description: 'Capitalising specialised healthcare real estate and longevity infrastructure to capture sticky, inflation-hedged yields driven by secular demographic shifts.'
  },
  {
    title: 'Cognitive Capacity',
    description: 'Deploying clinical-grade performance architecture to eliminate executive decision drag and protect key-person capital across high-stakes leadership teams.'
  },
  {
    title: 'Balance Sheet Durability',
    description: 'Reallocating capital away from speculative market growth toward asset-backed, systematic compounding and tail-risk insulation.'
  }
];

const SolvencyPage: React.FC = () => {
  return (
    <main className="min-h-screen pt-40 pb-20 bg-ghost">
      <div className="px-12 md:px-24 max-w-4xl mx-auto text-center">
        <span className="text-gold text-xs uppercase tracking-[0.5em] font-bold">Our Framework</span>
        <h1 className="text-navy text-4xl md:text-7xl mt-6 leading-tight font-serif">
          Structure is Alpha.
        </h1>
        <div className="mt-16 text-left max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-navy font-serif">The Thesis</h2>
          <p className="text-slate mt-4 text-xl leading-relaxed font-light italic">
            "The highest risk-adjusted returns over the next 30 years will come from capitalising essential, supply-constrained infrastructure."
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
