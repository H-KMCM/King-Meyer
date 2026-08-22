import React, { useState } from 'react';
import { ShieldCheck, FileCheck2, AlertCircle, Lock } from 'lucide-react';
import { UserProfile } from '../../lib/types';

interface Props {
  user: UserProfile;
  onAttestationSuccess: (updatedUser: UserProfile) => void;
}

const OnboardingAttestation: React.FC<Props> = ({ user, onAttestationSuccess }) => {
  const [investorType, setInvestorType] = useState<'ELECTIVE_PROFESSIONAL' | 'PER_SE_PROFESSIONAL' | 'QUALIFIED_PURCHASER' | 'ACCREDITED_INVESTOR'>('ELECTIVE_PROFESSIONAL');
  const [jurisdiction, setJurisdiction] = useState('United Kingdom / EEA (MIFID II)');
  const [confirmedNetWorth, setConfirmedNetWorth] = useState(false);
  const [confirmedExperience, setConfirmedExperience] = useState(false);
  const [confirmedRiskAwareness, setConfirmedRiskAwareness] = useState(false);
  const [signatureName, setSignatureName] = useState(user.name || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedNetWorth || !confirmedExperience || !confirmedRiskAwareness) {
      setError('You must confirm all regulatory declarations before proceeding.');
      return;
    }
    if (!signatureName.trim()) {
      setError('Please provide a legal electronic signature.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/investor/attestation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          investorType,
          jurisdiction,
          confirmedNetWorth,
          confirmedExperience,
          confirmedRiskAwareness,
          signatureName,
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        onAttestationSuccess(data.user);
      } else {
        setError(data.error || 'Failed to process self-declaration.');
      }
    } catch (err: any) {
      setError('Error submitting attestation: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 shadow-sm p-6 md:p-10 max-w-3xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 text-gold mb-4 border border-gold/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <span className="text-gold text-xs uppercase tracking-widest font-bold block">Compliance Requirement</span>
        <h2 className="text-navy text-2xl md:text-3xl font-serif font-bold mt-2">
          Investor Classification &amp; Attestation
        </h2>
        <p className="text-slate text-sm font-light mt-2 leading-relaxed">
          Pursuant to international regulatory frameworks (FCA, SEC, MIFID II), access to King &amp; Meyer
          confidential memos and LP agreements requires self-declaration of professional status.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-ghost/60 p-5 border border-slate-200">
          <div>
            <label className="text-gold uppercase tracking-widest font-bold block mb-2">Investor Classification</label>
            <select
              value={investorType}
              onChange={(e: any) => setInvestorType(e.target.value)}
              className="w-full bg-white border border-slate-300 p-3 text-navy font-medium focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="ELECTIVE_PROFESSIONAL">Elective Professional Client (COBS 3.5)</option>
              <option value="PER_SE_PROFESSIONAL">Per Se Professional / Institutional Allocator</option>
              <option value="QUALIFIED_PURCHASER">US Qualified Purchaser ($5M+ / $25M+ investments)</option>
              <option value="ACCREDITED_INVESTOR">SEC Accredited Investor (Rule 501 Reg D)</option>
            </select>
          </div>

          <div>
            <label className="text-gold uppercase tracking-widest font-bold block mb-2">Primary Jurisdiction</label>
            <input
              type="text"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full bg-white border border-slate-300 p-3 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
        </div>

        {/* Declarations */}
        <div className="space-y-4 pt-2">
          <label className="text-xs uppercase tracking-widest text-navy font-bold block">
            Statutory Declarations &amp; Tail-Risk Acknowledgment
          </label>

          <label className="flex items-start gap-3 p-3.5 border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer rounded">
            <input
              type="checkbox"
              checked={confirmedNetWorth}
              onChange={(e) => setConfirmedNetWorth(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-gold border-slate-300 rounded focus:ring-gold"
            />
            <span className="text-slate-700 leading-relaxed">
              I confirm that the entity/individual possesses net financial assets exceeding statutory professional
              minimums (e.g. €500,000 / $5,000,000 liquid capital) or meets institution-level criteria.
            </span>
          </label>

          <label className="flex items-start gap-3 p-3.5 border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer rounded">
            <input
              type="checkbox"
              checked={confirmedExperience}
              onChange={(e) => setConfirmedExperience(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-gold border-slate-300 rounded focus:ring-gold"
            />
            <span className="text-slate-700 leading-relaxed">
              I confirm substantial experience in alternative asset allocations, quantitative balance sheet architectures,
              and private market liquidity profiles.
            </span>
          </label>

          <label className="flex items-start gap-3 p-3.5 border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer rounded">
            <input
              type="checkbox"
              checked={confirmedRiskAwareness}
              onChange={(e) => setConfirmedRiskAwareness(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-gold border-slate-300 rounded focus:ring-gold"
            />
            <span className="text-slate-700 leading-relaxed">
              I acknowledge that confidential repository materials contain dynamically watermarked data tied to my
              electronic identity and IP address for audit and non-disclosure compliance.
            </span>
          </label>
        </div>

        {/* Signature */}
        <div className="pt-4 border-t border-slate-200">
          <label className="text-gold uppercase tracking-widest font-bold block mb-1">
            Authorized Signatory Electronic Signature
          </label>
          <input
            type="text"
            required
            value={signatureName}
            onChange={(e) => setSignatureName(e.target.value)}
            placeholder="Enter Full Legal Name of Authorized Signatory"
            className="w-full bg-ghost border border-slate-300 p-3.5 text-navy font-serif text-sm focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Cryptographically logged with UTC timestamp and client network address.
          </span>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 rounded">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-navy text-white px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Lock className="w-4 h-4" />
            <span>{submitting ? 'Authenticating Attestation...' : 'Execute Attestation & Unlock Vault'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardingAttestation;
