import React from 'react';
import { Clock, ShieldCheck } from 'lucide-react';

interface PartnerColumn {
  title: string;
  caption: string;
  status: string;
  isPending: boolean;
  renderLogo?: () => React.ReactNode;
}

const StoneXLogo = () => (
  <div className="flex items-center justify-center gap-2 w-full">
    <svg className="h-6 w-auto text-slate-100 shrink-0" viewBox="0 0 32 32" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 7 L25 25 M25 7 L7 25" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
    <div className="text-white font-sans text-xl md:text-2xl font-bold tracking-tight">
      Stone<span className="text-slate-100">X</span>
    </div>
  </div>
);

const GovernanceColumnItem: React.FC<{ item: PartnerColumn }> = ({ item }) => {
  return (
    <div className="flex flex-col items-center justify-between text-center p-6 min-h-[160px] w-full bg-slate-900/30 rounded-lg border border-white/5">
      <div className="h-12 flex items-center justify-center w-full text-center">
        {item.renderLogo ? (
          item.renderLogo()
        ) : (
          <div className="text-white font-sans text-xl md:text-2xl font-bold tracking-tight text-center w-full">
            {item.title}
          </div>
        )}
      </div>

      <div className="my-2 space-y-2.5 w-full flex flex-col items-center justify-center">
        <div className="text-[11px] text-white tracking-wider uppercase font-sans font-medium text-center">
          {item.caption}
        </div>

        <div className={`inline-flex items-center justify-center gap-1.5 text-[10px] px-3 py-1 rounded-full border tracking-wider uppercase font-medium ${
          item.isPending
            ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
            : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
        }`}>
          {item.isPending ? (
            <Clock className="w-3 h-3 text-amber-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
          )}
          <span>{item.status}</span>
        </div>
      </div>
    </div>
  );
};

const InstitutionalInfrastructure: React.FC = () => {
  const columns: PartnerColumn[] = [
    {
      title: 'AIFM',
      caption: 'Regulatory Host',
      status: 'Pending Registration',
      isPending: true,
    },
    {
      title: 'Auditor',
      caption: 'Financial Audit',
      status: 'Pending Registration',
      isPending: true,
    },
    {
      title: 'Administrator',
      caption: 'Fund Administration',
      status: 'Pending Registration',
      isPending: true,
    },
    {
      title: 'StoneX',
      caption: 'Prime Broker & Execution',
      status: 'Active Partner',
      isPending: false,
      renderLogo: () => <StoneXLogo />,
    },
  ];

  return (
    <section className="bg-navy py-16 px-6 md:px-12 border-t border-white/10 text-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] text-amber-300 uppercase tracking-[0.2em] font-semibold">
              AIFM Regulation Process In Progress
            </span>
          </div>

          <h2 className="text-white text-2xl md:text-4xl font-serif">
            Institutional Infrastructure & Governance
          </h2>

          <p className="mt-4 text-xs md:text-sm text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            King & Meyer Holdings Limited is currently going through the process for regulation via an AIFM (Alternative Investment Fund Manager).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column, idx) => (
            <GovernanceColumnItem key={idx} item={column} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstitutionalInfrastructure;
