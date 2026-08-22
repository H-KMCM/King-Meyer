import React, { useState, useEffect } from 'react';
import { VaultDocument, DocumentAccessTier, DocumentCategory } from '../../lib/types';
import { Upload, FileText, Trash2, Eye, Shield, Calendar, Download, CheckCircle, AlertTriangle } from 'lucide-react';

const DocumentVault: React.FC = () => {
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'CONFIDENTIAL_MEMO' as DocumentCategory,
    accessTier: 'VERIFIED_LP_ONLY' as DocumentAccessTier,
    fileName: '',
    fileSizeBytes: 2500000,
    expiresAt: '',
  });
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/admin/documents');
      const data = await res.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error('Failed to fetch vault documents', err);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.description || !uploadForm.fileName) {
      setStatusMsg({ text: 'Please fill in all mandatory fields.', type: 'error' });
      return;
    }

    setUploading(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/admin/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...uploadForm,
          expiresAt: uploadForm.expiresAt ? new Date(uploadForm.expiresAt).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ text: 'Document successfully registered in Vault with dynamic watermark policy.', type: 'success' });
        setShowUploadModal(false);
        setUploadForm({
          title: '',
          description: '',
          category: 'CONFIDENTIAL_MEMO',
          accessTier: 'VERIFIED_LP_ONLY',
          fileName: '',
          fileSizeBytes: 2500000,
          expiresAt: '',
        });
        fetchDocuments();
      } else {
        setStatusMsg({ text: data.error || 'Failed to upload document', type: 'error' });
      }
    } catch (err: any) {
      setStatusMsg({ text: 'Upload failed: ' + err.message, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to purge this document from the vault?')) return;
    try {
      const res = await fetch(`/api/admin/documents/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchDocuments();
      }
    } catch (err) {
      console.error('Failed to delete document', err);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 shadow-sm p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-gold text-xs uppercase tracking-widest font-bold">Secure Asset Repository</span>
          <h2 className="text-navy text-2xl font-serif font-bold mt-1">Institutional Document Vault</h2>
          <p className="text-slate text-sm font-light">
            Upload institutional PDFs, configure RBAC clearance flags, and enforce dynamic recipient watermarking.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-navy text-white px-5 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload PDF Asset</span>
        </button>
      </div>

      {statusMsg && (
        <div
          className={`mt-6 p-4 text-xs rounded flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Document Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="border border-slate-200 bg-ghost/40 p-5 rounded flex flex-col justify-between hover:border-gold/60 transition-all shadow-sm"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-mono font-bold uppercase text-gold bg-gold/10 px-2 py-0.5 rounded">
                  {doc.category.replace(/_/g, ' ')}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    doc.accessTier === 'VERIFIED_LP_ONLY'
                      ? 'bg-emerald-100 text-emerald-800'
                      : doc.accessTier === 'PROSPECT_ONLY'
                      ? 'bg-blue-100 text-blue-800'
                      : doc.accessTier === 'PUBLIC'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {doc.accessTier.replace(/_/g, ' ')}
                </span>
              </div>

              <h3 className="font-serif font-bold text-navy text-base line-clamp-2 mb-2">{doc.title}</h3>
              <p className="text-slate text-xs font-light line-clamp-3 mb-4 leading-relaxed">{doc.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-200/80 space-y-3">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>{(doc.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                <span>{doc.downloadCount} Downloads</span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <a
                  href={`/api/investor/documents/${doc.id}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-navy font-bold hover:text-gold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Test Watermark</span>
                </a>

                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-slate-400 hover:text-red-600 transition-colors p-1"
                  title="Purge Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full p-8 border border-gold/30 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <h3 className="text-xl font-serif font-bold text-navy">Upload Document to Vault</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-navy text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-gold uppercase tracking-widest font-bold block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="e.g. Quantitative Execution & Tail-Risk Parametrization (Q3 2026)"
                  className="w-full bg-ghost border border-slate-300 p-2.5 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="text-gold uppercase tracking-widest font-bold block mb-1">File Name</label>
                <input
                  type="text"
                  required
                  value={uploadForm.fileName}
                  onChange={(e) => setUploadForm({ ...uploadForm, fileName: e.target.value })}
                  placeholder="e.g. KM_Quant_Execution_Memo_2026.pdf"
                  className="w-full bg-ghost border border-slate-300 p-2.5 text-navy focus:outline-none focus:ring-1 focus:ring-gold font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gold uppercase tracking-widest font-bold block mb-1">Category</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as DocumentCategory })}
                    className="w-full bg-ghost border border-slate-300 p-2.5 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    <option value="CONFIDENTIAL_MEMO">Confidential Memo</option>
                    <option value="LP_AGREEMENT">LP Agreement</option>
                    <option value="PITCH_BOOK">Pitch Book</option>
                    <option value="PERFORMANCE_REPORT">Performance Report</option>
                    <option value="FINANCIAL_STATEMENT">Financial Statement</option>
                    <option value="DUE_DILIGENCE_VDR">Due Diligence VDR</option>
                  </select>
                </div>

                <div>
                  <label className="text-gold uppercase tracking-widest font-bold block mb-1">Clearance Tier</label>
                  <select
                    value={uploadForm.accessTier}
                    onChange={(e) => setUploadForm({ ...uploadForm, accessTier: e.target.value as DocumentAccessTier })}
                    className="w-full bg-ghost border border-slate-300 p-2.5 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    <option value="VERIFIED_LP_ONLY">Verified LP Only</option>
                    <option value="PROSPECT_ONLY">Prospect LP &amp; Verified</option>
                    <option value="PUBLIC">Public Institutional</option>
                    <option value="INTERNAL_ADMIN">Internal Admin Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gold uppercase tracking-widest font-bold block mb-1">Executive Summary</label>
                <textarea
                  rows={3}
                  required
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="Provide an institutional summary of the document contents and risk profile..."
                  className="w-full bg-ghost border border-slate-300 p-2.5 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="text-gold uppercase tracking-widest font-bold block mb-1">Expiration Date (Optional)</label>
                <input
                  type="date"
                  value={uploadForm.expiresAt}
                  onChange={(e) => setUploadForm({ ...uploadForm, expiresAt: e.target.value })}
                  className="w-full bg-ghost border border-slate-300 p-2.5 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-5 py-2.5 border border-slate-300 text-slate-600 uppercase tracking-widest font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-navy text-white uppercase tracking-widest font-bold hover:bg-gold transition-all"
                >
                  {uploading ? 'Registering...' : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentVault;
