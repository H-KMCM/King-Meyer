import React, { useState, useEffect } from 'react';
import { VaultDocument, UserProfile } from '../../lib/types';
import { FileText, Download, Shield, Lock, Clock, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface Props {
  user: UserProfile;
}

const DocumentCenter: React.FC<Props> = ({ user }) => {
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  useEffect(() => {
    fetchAccessibleDocuments();
  }, [user.role]);

  const fetchAccessibleDocuments = async () => {
    try {
      const res = await fetch(`/api/investor/documents?role=${user.role}`);
      const data = await res.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error('Failed to fetch investor documents', err);
    }
  };

  const handleDownloadWithSignedToken = async (doc: VaultDocument) => {
    setLoadingDocId(doc.id);
    setDownloadSuccess(null);

    try {
      // 1. Request short-lived (15-min) signed token from backend
      const res = await fetch(`/api/investor/documents/${doc.id}/signed-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const data = await res.json();
      if (data.success && data.downloadUrl) {
        // 2. Open / Trigger download of the dynamic watermarked PDF
        window.open(data.downloadUrl, '_blank');
        setDownloadSuccess(
          `Generating watermarked PDF stamped for ${user.email} (Token valid for 15 minutes).`
        );
        fetchAccessibleDocuments(); // Refresh download count
      }
    } catch (err) {
      console.error('Download error', err);
    } finally {
      setLoadingDocId(null);
    }
  };

  const filtered = documents.filter((doc) => {
    if (filterCategory === 'ALL') return true;
    return doc.category === filterCategory;
  });

  return (
    <div className="space-y-8">
      {/* Watermarking Notice Banner */}
      <div className="bg-navy text-white p-5 md:p-6 border-l-4 border-gold shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-serif font-bold tracking-wide text-gold uppercase">
              Dynamic Watermark Protocol Active
            </h4>
            <p className="text-xs text-slate-300 font-light mt-0.5">
              All documents are dynamically stamped with recipient identity (<span className="text-white font-mono">{user.email}</span>),
              network IP, and cryptographic timestamp upon transmission.
            </p>
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-gold" />
          <span>Signed URL TTL: 15 Minutes</span>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 rounded">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
        {['ALL', 'CONFIDENTIAL_MEMO', 'LP_AGREEMENT', 'PITCH_BOOK', 'DUE_DILIGENCE_VDR', 'PERFORMANCE_REPORT'].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold rounded transition-all ${
                filterCategory === cat
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-ghost text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          )
        )}
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-white border border-slate-200 p-6 flex flex-col justify-between hover:border-gold/60 transition-all shadow-sm group"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-mono font-bold uppercase text-gold bg-gold/10 px-2.5 py-1 rounded">
                  {doc.category.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {(doc.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB PDF
                </span>
              </div>

              <h3 className="font-serif font-bold text-navy text-lg group-hover:text-gold transition-colors mb-2">
                {doc.title}
              </h3>
              <p className="text-slate text-xs font-light leading-relaxed mb-6">
                {doc.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <Lock className="w-3 h-3 text-gold" />
                <span>Tier: {doc.accessTier.replace(/_/g, ' ')}</span>
              </div>

              <button
                onClick={() => handleDownloadWithSignedToken(doc)}
                disabled={loadingDocId === doc.id}
                className="bg-navy hover:bg-gold text-white px-4 py-2 text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{loadingDocId === doc.id ? 'Stamping PDF...' : 'Download Stamped PDF'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentCenter;
