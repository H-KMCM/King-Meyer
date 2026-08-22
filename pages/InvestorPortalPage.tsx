import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Shield, 
  FolderKanban, 
  Briefcase, 
  UserCog, 
  LogOut, 
  CheckCircle, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';
import { UserProfile } from '../lib/types';
import DocumentCenter from '../components/investor/DocumentCenter';
import OnboardingAttestation from '../components/investor/OnboardingAttestation';
import ProfileManagement from '../components/investor/ProfileManagement';

const InvestorPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'documents' | 'vdr' | 'capital' | 'attestation' | 'profile'>('documents');
  
  // Default verified institutional profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'usr-lp-001',
    email: 'investor@genevacapital.ch',
    name: 'Geneva Multi-Family Office S.A.',
    role: 'VERIFIED_LP',
    status: 'APPROVED',
    entityName: 'Geneva Multi-Family Office Asset Holding',
    entityType: 'FAMILY_OFFICE',
    signatories: ['Dr. Philippe Laurent (Managing Director)', 'Marcelle Dupont (CIO)'],
    isAccredited: true,
    twoFactorEnabled: false,
    createdAt: '2024-05-10T12:00:00.000Z',
    updatedAt: new Date().toISOString(),
  });

  const handleLogout = () => {
    sessionStorage.removeItem('km-institutional-auth');
    sessionStorage.removeItem('km-auth');
    navigate('/login');
  };

  const handleAttestationSuccess = (updatedUser: UserProfile) => {
    setUserProfile(updatedUser);
    setActiveTab('documents');
  };

  return (
    <main className="min-h-screen pt-36 pb-20 bg-ghost">
      <div className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-gold text-xs uppercase tracking-[0.4em] font-bold">
                Institutional Investor Gateway
              </span>
              <span
                className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase ${
                  userProfile.isAccredited
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {userProfile.isAccredited ? 'Verified Professional LP' : 'Accreditation Pending'}
              </span>
            </div>
            <h1 className="text-navy text-3xl md:text-4xl font-serif font-bold mt-2">
              Investor Portal &amp; Data Room
            </h1>
            <p className="text-slate text-sm font-light mt-1">
              Authorized entity: <span className="font-medium text-navy">{userProfile.entityName || userProfile.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold bg-navy text-white hover:bg-gold px-4 py-2 transition-all shadow-sm"
            >
              <LogOut size={14} />
              <span>Secure Logout</span>
            </button>
          </div>
        </div>

        {/* Attestation Alert If Not Accredited */}
        {!userProfile.isAccredited && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-4 rounded">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
              <span>
                Your MIFID II / SEC Accredited Investor attestation is pending. Complete self-declaration to unlock restricted LP agreements.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('attestation')}
              className="bg-navy text-white px-4 py-2 uppercase tracking-widest font-bold text-[10px] hover:bg-gold whitespace-nowrap"
            >
              Complete Attestation
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-2 p-1.5 bg-slate-200/60 rounded-md border border-slate-200">
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold rounded transition-all ${
              activeTab === 'documents'
                ? 'bg-navy text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/70 hover:text-navy'
            }`}
          >
            <FileText className="w-4 h-4 text-gold" />
            <span>Document Center</span>
          </button>

          <button
            onClick={() => setActiveTab('vdr')}
            className={`flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold rounded transition-all ${
              activeTab === 'vdr'
                ? 'bg-navy text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/70 hover:text-navy'
            }`}
          >
            <FolderKanban className="w-4 h-4 text-gold" />
            <span>Virtual Data Room</span>
          </button>

          <button
            onClick={() => setActiveTab('capital')}
            className={`flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold rounded transition-all ${
              activeTab === 'capital'
                ? 'bg-navy text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/70 hover:text-navy'
            }`}
          >
            <Briefcase className="w-4 h-4 text-gold" />
            <span>Capital Account</span>
          </button>

          <button
            onClick={() => setActiveTab('attestation')}
            className={`flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold rounded transition-all ${
              activeTab === 'attestation'
                ? 'bg-navy text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/70 hover:text-navy'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-gold" />
            <span>Attestation</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold rounded transition-all ${
              activeTab === 'profile'
                ? 'bg-navy text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/70 hover:text-navy'
            }`}
          >
            <UserCog className="w-4 h-4 text-gold" />
            <span>Profile &amp; Mandate</span>
          </button>
        </div>

        {/* Tab Panels */}
        <div className="mt-8">
          {activeTab === 'documents' && <DocumentCenter user={userProfile} />}

          {activeTab === 'attestation' && (
            <OnboardingAttestation
              user={userProfile}
              onAttestationSuccess={handleAttestationSuccess}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileManagement
              user={userProfile}
              onUpdateProfile={(updated) => setUserProfile(updated)}
            />
          )}

          {activeTab === 'vdr' && (
            <div className="bg-white p-8 border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-gold text-xs uppercase tracking-widest font-bold">Due Diligence</span>
                <h2 className="text-navy text-2xl font-serif font-bold mt-1">Virtual Data Room (VDR)</h2>
                <p className="text-slate text-sm font-light">
                  Continuous data room access for diligence teams, legal counsel, and quantitative risk auditors.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4">
                {[
                  { title: 'Quantitative Treasury & Volatility Surface VDR', status: 'Active (24 Files)' },
                  { title: 'Vitae Monaco Real Estate & Longevity SPV VDR', status: 'Active (18 Files)' },
                  { title: 'Digital Layer & Tier-4 AI Infrastructure VDR', status: 'Active (12 Files)' },
                  { title: 'Audited Financial Statements & Tax Opinions', status: 'Updated Q2 2026' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 border border-slate-200 bg-ghost/40 hover:border-gold transition-all flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-navy font-serif font-bold text-sm">{item.title}</h4>
                      <span className="text-[11px] text-gold font-mono">{item.status}</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className="text-xs uppercase tracking-wider font-bold text-navy hover:text-gold"
                    >
                      Open &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'capital' && (
            <div className="bg-white p-8 border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-gold text-xs uppercase tracking-widest font-bold">Portfolio Reporting</span>
                <h2 className="text-navy text-2xl font-serif font-bold mt-1">Capital Account Overview</h2>
                <p className="text-slate text-sm font-light">
                  Real-time Net Asset Value (NAV) summary, commitment pacing, and audited distribution schedules.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5 font-semibold">Fund / SPV Structure</th>
                      <th className="p-3.5 text-right font-semibold">Total Commitment</th>
                      <th className="p-3.5 text-right font-semibold">Capital Called</th>
                      <th className="p-3.5 text-right font-semibold">Distributions</th>
                      <th className="p-3.5 text-right font-semibold">Current NAV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-navy font-mono">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-sans font-semibold text-sm">
                        King &amp; Meyer Legacy Assets Core Fund I, LP
                      </td>
                      <td className="p-3.5 text-right">$5,000,000</td>
                      <td className="p-3.5 text-right">$3,500,000</td>
                      <td className="p-3.5 text-right text-emerald-700">$250,000</td>
                      <td className="p-3.5 text-right font-bold text-gold">$3,820,000</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-sans font-semibold text-sm">
                        NEON Cognitive Architecture &amp; Clinical Diagnostics SPV
                      </td>
                      <td className="p-3.5 text-right">$1,500,000</td>
                      <td className="p-3.5 text-right">$1,500,000</td>
                      <td className="p-3.5 text-right text-emerald-700">$0</td>
                      <td className="p-3.5 text-right font-bold text-gold">$1,950,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default InvestorPortalPage;
