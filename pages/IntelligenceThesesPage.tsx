
import React from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

const IntelligenceThesesPage: React.FC = () => {
  const { theses } = useSite();
  const sortedTheses = [...theses].sort((a, b) => (a.lead === b.lead) ? 0 : a.lead ? -1 : 1);

  return (
    <main className="min-h-screen pt-40 pb-20 bg-ghost">
      <div className="px-12 md:px-24 max-w-7xl mx-auto">
        <div className="text-center">
          <span className="text-gold text-xs uppercase tracking-[0.5em] font-bold">Intelligence & Theses</span>
          <h1 className="text-navy text-4xl md:text-7xl mt-6 leading-tight font-serif">
            The Architecture of Conviction.
          </h1>
          <p className="text-slate mt-8 max-w-3xl mx-auto text-xl leading-relaxed font-light">
            Systemic analysis on market fragility, longevity economics, and cognitive optimization.
          </p>
        </div>
        <div className="mt-24 space-y-24">
          {sortedTheses.map((thesis, index) => (
            <div key={thesis.id || index} className="border-t border-slate/20 pt-12">
              <div className="grid md:grid-cols-12 gap-x-12">
                <div className="md:col-span-4">
                  <div className="sticky top-32">
                     {thesis.lead && (
                        <span className="bg-gold text-white text-xs uppercase tracking-widest font-bold px-3 py-1 mb-4 inline-block">Lead Thesis</span>
                      )}
                    <h2 className="text-3xl text-navy font-bold font-serif">{`"${thesis.title}"`}</h2>
                    <p className="text-slate mt-4 text-lg leading-relaxed font-light italic">{thesis.description}</p>
                    <div className="mt-6 h-48 bg-slate-200 grayscale contrast-125 overflow-hidden">
                       <img 
                        src={thesis.imageUrl}
                        alt={`Technical graphic for ${thesis.title}`}
                        className="w-full h-full object-cover opacity-75"
                      />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-8 mt-8 md:mt-0">
                  <div className="prose prose-slate max-w-none prose-p:font-light prose-p:leading-relaxed text-navy font-light leading-relaxed space-y-4 whitespace-pre-wrap">
                    <p>{thesis.excerpt}</p>
                  </div>
                   <div className="mt-8">
                      <Link to="/institutional-access" className="bg-navy text-white px-8 py-3 text-sm uppercase tracking-widest font-bold hover:bg-slate-800 transition-all text-center">
                        Request Full PDF via Institutional Access
                      </Link>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default IntelligenceThesesPage;
