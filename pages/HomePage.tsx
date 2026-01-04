
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="h-screen bg-navy flex flex-col justify-center px-12 md:px-24">
        <div className="max-w-5xl fade-in">
          <div className="h-px bg-gold w-[60px] mb-8"></div>
          <h1 className="text-white text-4xl md:text-7xl mb-8 leading-[1.1] font-serif">
            Translating High-Conviction <br />
            Passion into Institutional-Grade Impact.
          </h1>
          <p className="text-slate text-xl md:text-2xl max-w-3xl mb-12 font-light leading-relaxed">
            King & Meyer is a strategic holding core and capital platform. We provide the institutional framework, capital discipline, and operational rigour required to turn systemic vision into enduring, asset-backed reality.
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
      <section className="py-32 bg-white px-12 md:px-24 flex justify-center">
        <div className="max-w-4xl text-center">
          <span className="text-gold text-xs uppercase tracking-[0.5em] font-bold">The Core Premise</span>
          <h2 className="text-navy text-3xl md:text-5xl mt-12 italic leading-snug font-serif">
            "Impact is not an intention; it is an engineering outcome. At King & Meyer, we bridge the gap between high-intensity conviction and systemic solvency."
          </h2>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
