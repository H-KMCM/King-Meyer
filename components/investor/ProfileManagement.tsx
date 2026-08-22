import React, { useState } from 'react';
import { UserProfile } from '../../lib/types';
import { User, Building, Users, Bell, Save, CheckCircle, Shield } from 'lucide-react';

interface Props {
  user: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

const ProfileManagement: React.FC<Props> = ({ user, onUpdateProfile }) => {
  const [entityName, setEntityName] = useState(user.entityName || '');
  const [entityType, setEntityType] = useState(user.entityType || 'FAMILY_OFFICE');
  const [signatories, setSignatories] = useState(
    user.signatories?.join('\n') || 'Chief Investment Officer\nManaging Partner'
  );
  const [notificationEmail, setNotificationEmail] = useState(user.email);
  const [notifyOnNewReports, setNotifyOnNewReports] = useState(true);
  const [notifyOnCapitalCalls, setNotifyOnCapitalCalls] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const parsedSignatories = signatories
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/investor/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          entityName,
          entityType,
          signatories: parsedSignatories,
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        onUpdateProfile(data.user);
        setSuccess(true);
      }
    } catch (err) {
      console.error('Failed to save profile', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm p-6 md:p-10 max-w-3xl mx-auto">
      <div className="border-b border-slate-200 pb-6 mb-8">
        <span className="text-gold text-xs uppercase tracking-widest font-bold">Institutional Account</span>
        <h2 className="text-navy text-2xl font-serif font-bold mt-1">Profile &amp; Signatory Management</h2>
        <p className="text-slate text-sm font-light">
          Maintain legal entity details, registered signatories, and secure dispatch preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 rounded">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Profile and signatory mandate successfully updated.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gold uppercase tracking-widest font-bold block mb-2">Legal Entity Name</label>
            <input
              type="text"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder="e.g. Geneva Multi-Family Office S.A."
              className="w-full bg-ghost border border-slate-300 p-3 text-navy font-medium focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          <div>
            <label className="text-gold uppercase tracking-widest font-bold block mb-2">Entity Classification</label>
            <select
              value={entityType}
              onChange={(e: any) => setEntityType(e.target.value)}
              className="w-full bg-ghost border border-slate-300 p-3 text-navy font-medium focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="FAMILY_OFFICE">Family Office</option>
              <option value="INSTITUTIONAL_FUND">Institutional Fund</option>
              <option value="UHNWI">Ultra-High-Net-Worth Individual</option>
              <option value="PENSION_SOVEREIGN">Sovereign / Pension Entity</option>
              <option value="CORPORATE">Strategic Corporate Holding</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-gold uppercase tracking-widest font-bold block mb-2">
            Authorized Signatories (One per line)
          </label>
          <textarea
            rows={3}
            value={signatories}
            onChange={(e) => setSignatories(e.target.value)}
            className="w-full bg-ghost border border-slate-300 p-3 font-mono text-xs text-navy focus:outline-none focus:ring-1 focus:ring-gold leading-relaxed"
          />
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
            Only designated signatories may execute binding LP commitment forms.
          </span>
        </div>

        {/* Secure Notification Settings */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <label className="text-xs uppercase tracking-widest text-navy font-bold block">
            Encrypted Dispatch &amp; Notification Settings
          </label>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-ghost border border-slate-200 cursor-pointer rounded">
              <input
                type="checkbox"
                checked={notifyOnNewReports}
                onChange={(e) => setNotifyOnNewReports(e.target.checked)}
                className="w-4 h-4 text-gold border-slate-300 rounded focus:ring-gold"
              />
              <span className="text-slate-700">
                Notify authorized contacts upon release of new Quarterly Risk &amp; Solvency Memos
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-ghost border border-slate-200 cursor-pointer rounded">
              <input
                type="checkbox"
                checked={notifyOnCapitalCalls}
                onChange={(e) => setNotifyOnCapitalCalls(e.target.checked)}
                className="w-4 h-4 text-gold border-slate-300 rounded focus:ring-gold"
              />
              <span className="text-slate-700">
                Send dual-signature verification prompts for SPV capital allocation notices
              </span>
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-navy text-white px-8 py-3.5 text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileManagement;
