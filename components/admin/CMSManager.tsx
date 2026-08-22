import React, { useState, useEffect } from 'react';
import { CMSCopyBlock } from '../../lib/types';
import { FileText, Save, CheckCircle, RefreshCw } from 'lucide-react';

const CMSManager: React.FC = () => {
  const [blocks, setBlocks] = useState<CMSCopyBlock[]>([]);
  const [activeKey, setActiveKey] = useState<string>('hero_headline');
  const [currentContent, setCurrentContent] = useState<string>('');
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const res = await fetch('/api/admin/cms');
      const data = await res.json();
      if (data.blocks) {
        setBlocks(data.blocks);
        const active = data.blocks.find((b: CMSCopyBlock) => b.key === activeKey) || data.blocks[0];
        if (active) {
          setActiveKey(active.key);
          setCurrentContent(active.content);
          setCurrentTitle(active.title);
        }
      }
    } catch (err) {
      console.error('Failed to fetch CMS blocks', err);
    }
  };

  const handleSelectBlock = (block: CMSCopyBlock) => {
    setActiveKey(block.key);
    setCurrentContent(block.content);
    setCurrentTitle(block.title);
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const active = blocks.find((b) => b.key === activeKey);
      const res = await fetch(`/api/admin/cms/${activeKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: activeKey,
          title: currentTitle,
          content: currentContent,
          section: active?.section || 'DOCTRINE',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Content block successfully synchronized and saved to database.', type: 'success' });
        fetchBlocks();
      } else {
        setMessage({ text: data.error || 'Failed to update CMS block', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: 'Error connecting to CMS service: ' + err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 shadow-sm p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-gold text-xs uppercase tracking-widest font-bold">Content Management System</span>
          <h2 className="text-navy text-2xl font-serif font-bold mt-1">Platform Copy Blocks</h2>
          <p className="text-slate text-sm font-light">
            Manage doctrine statements, structural solvency definitions, and public platform positioning.
          </p>
        </div>
        <button
          onClick={fetchBlocks}
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-slate hover:text-gold border border-slate-200 px-4 py-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left: Block Navigator */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-gold font-bold block mb-3">Copy Blocks</label>
          {blocks.map((block) => (
            <button
              key={block.key}
              onClick={() => handleSelectBlock(block)}
              className={`w-full text-left p-3.5 text-xs transition-all border ${
                activeKey === block.key
                  ? 'bg-navy text-white border-navy font-semibold shadow-sm'
                  : 'bg-ghost text-slate-700 border-slate-200/70 hover:border-gold hover:bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[10px] text-gold uppercase">{block.section}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(block.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="font-medium truncate">{block.title}</div>
            </button>
          ))}
        </div>

        {/* Right: Block Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">Block Title</label>
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              className="w-full bg-ghost border border-slate-300 p-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">Copy Content</label>
            <textarea
              rows={8}
              value={currentContent}
              onChange={(e) => setCurrentContent(e.target.value)}
              className="w-full bg-ghost border border-slate-300 p-4 text-sm font-light text-navy focus:outline-none focus:ring-2 focus:ring-gold font-serif leading-relaxed"
            />
          </div>

          {message && (
            <div
              className={`p-4 text-xs rounded flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{message.text}</span>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-navy text-white px-8 py-3.5 text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Synchronizing...' : 'Save & Publish Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSManager;
