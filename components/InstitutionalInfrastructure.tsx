
import React from 'react';

const InstitutionalInfrastructure: React.FC = () => {
  const partners = [
    { name: 'Thornbridge', caption: 'AIFM & Regulatory Host' },
    { name: 'PwC', caption: 'Auditor' },
    { name: 'Suntera Global', caption: 'Fund Administrator' },
    { name: 'StoneX', caption: 'Prime Broker & Execution' },
  ];

  return (
    <section className="bg-navy py-24 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-white/60 font-serif italic text-sm tracking-[0.4em] uppercase mb-16">
          Institutional Infrastructure & Governance
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {partners.map((partner) => (
            <div key={partner.name} className="flex flex-col items-center text-center space-y-4 group">
              <div className="h-12 flex items-center justify-center">
                <span className="text-white/30 text-xl font-serif tracking-widest uppercase group-hover:text-white/60 transition-colors duration-500">
                  {partner.name}
                </span>
              </div>
              <div className="text-[9px] text-white/20 tracking-[0.2em] uppercase font-sans">
                {partner.caption}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstitutionalInfrastructure;
