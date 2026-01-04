
import React from 'react';

const DoctrinePage: React.FC = () => {
  return (
    <main className="min-h-screen pt-40 pb-20 bg-ghost">
      <div className="px-12 md:px-24 max-w-7xl mx-auto">
        <span className="text-gold text-xs uppercase tracking-[0.5em] font-bold">The Doctrine</span>
        <h1 className="text-navy text-4xl md:text-7xl mt-6 mb-20 leading-tight font-serif">
          The King & Meyer Doctrine:<br />Majority Control, Systemic Durability.
        </h1>

        <div className="grid md:grid-cols-2 gap-24 items-start">
          <div className="space-y-16">
            <section>
              <h3 className="text-gold uppercase text-xs tracking-widest font-bold mb-4">The Philosophy</h3>
              <p className="text-navy text-lg leading-relaxed font-light">
                We do not invest in "potential." We invest in Systems of Conviction. King & Meyer was founded to solve a specific market failure: the lack of institutional-grade infrastructure for high-stakes, high-intensity operators.
              </p>
            </section>

            <section className="bg-navy text-white p-12 border border-navy/10">
              <h3 className="text-gold uppercase text-xs tracking-widest font-bold mb-4">The Majority-Control Mandate</h3>
              <p className="text-slate-300 text-lg leading-relaxed font-light italic">
                We operate with a principal-first logic. King & Meyer maintains majority control and IP ownership across all strategic verticals. We do not seek "participation"; we seek the authority to enforce discipline, ensure capital preservation, and drive systemic evolution.
              </p>
            </section>
          </div>

          <div className="pt-12 md:pt-0">
             <section className="border-l border-gold pl-12">
              <h3 className="text-gold uppercase text-xs tracking-widest font-bold mb-4">The Cognitive Edge</h3>
              <p className="text-navy text-lg leading-relaxed font-light">
                Our approach is driven by ADHD-integrated hyper-focus. We detect systemic inefficiencies in market structures and social infrastructure (Healthcare, Performance, Finance) before they are priced in by the broader market. We don't avoid intensity; we weaponise it.
              </p>
              <div className="mt-12 h-[400px] bg-slate-200 grayscale contrast-125 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800" 
                  alt="Institutional Clarity" 
                  className="w-full h-full object-cover opacity-50"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DoctrinePage;
