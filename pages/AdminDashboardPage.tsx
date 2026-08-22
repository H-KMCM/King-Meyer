import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  ShieldCheck, 
  FileBox, 
  Settings, 
  LogOut, 
  Activity, 
  Lock, 
  KeyRound, 
  Globe 
} from 'lucide-react';
import CMSManager from '../components/admin/CMSManager';
import UserManagement from '../components/admin/UserManagement';
import DocumentVault from '../components/admin/DocumentVault';
import AuditTrailViewer from '../components/admin/AuditTrailViewer';

type AdminTab = 'cms' | 'users' | 'vault' | 'audit' | 'settings';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('cms');
  const { theme, logo, slogan, seo, setLogo, setAdminPassword, setTheme, setSlogan, setSeo } = useSite();
  const navigate = useNavigate();

  const [localTheme, setLocalTheme] = useState(theme);
  const [localLogo, setLocalLogo] = useState(logo);
  const [localSlogan, setLocalSlogan] = useState(slogan);
  const [localSeo, setLocalSeo] = useState(seo);
  const [newAdminPassword, setNewAdminPassword] = useState({ code: '', confirm: '' });
  const [passwordFeedback, setPasswordFeedback] = useState({ error: '', success: '' });

  const handleLogout = () => {
    sessionStorage.removeItem('km-auth');
    sessionStorage.removeItem('km-institutional-auth');
    navigate('/login');
  };

  const handleAdminPasswordSave = () => {
    setPasswordFeedback({ error: '', success: '' });
    if (!newAdminPassword.code || newAdminPassword.code.length < 8) {
      setPasswordFeedback({ error: 'New code must be at least 8 characters long.', success: '' });
      return;
    }
    if (newAdminPassword.code !== newAdminPassword.confirm) {
      setPasswordFeedback({ error: 'Access codes do not match.', success: '' });
      return;
    }
    setAdminPassword(newAdminPassword.code);
    setPasswordFeedback({ error: '', success: 'Admin access code updated successfully.' });
    setNewAdminPassword({ code: '', confirm: '' });
  };

  return (
    <main className="min-h-screen pt-36 pb-20 bg-ghost">
      <div className="px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-gold text-xs uppercase tracking-[0.4em] font-bold">
                Executive Control Plane
              </span>
              <span className="bg-navy text-gold text-[10px] font-mono px-2 py-0.5 border border-gold/30 rounded font-bold uppercase">
                RBAC Level 4: SUPER_ADMIN
              </span>
            </div>
            <h1 className="text-navy text-3xl md:text-4xl font-serif font-bold mt-2">
              Platform Administration &amp; Vault
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/institutional-portal')}
              className="text-xs uppercase tracking-wider font-semibold text-navy hover:text-gold border border-navy/20 px-4 py-2 bg-white shadow-sm"
            >
              View Investor Portal
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold bg-navy text-white hover:bg-gold px-4 py-2 transition-all shadow-sm"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Modular Navigation Tabs */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-2 p-1.5 bg-slate-200/60 rounded-md border border-slate-200">
          <button
            onClick={() => setActiveTab('cms')}
            className={`flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold rounded transition-all ${
              activeTab === 'cms'
                ? 'bg-navy text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/70 hover:text-navy'
            }`}
          >
            <FileText className="w-4 h-4 text-gold" />
            <span>CMS Content</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold rounded transition-all ${
              activeTab === 'users'
                ? 'bg-navy text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/70 hover:text-navy'
            }`}
          >
            <Users className="w-4 h-4 text-gold" />
            <span>User Clearance</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold rounded transition-all ${
              activeTab === 'vault'
                ? 'bg-navy text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/70 hover:text-navy'
            }`}
          >
            <FileBox className="w-4 h-4 text-gold" />
            <span>Document Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold rounded transition-all ${
              activeTab === 'audit'
                ? 'bg-navy text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/70 hover:text-navy'
            }`}
          >
            <Activity className="w-4 h-4 text-gold" />
            <span>Audit Trail</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center justify-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold rounded transition-all col-span-2 md:col-span-1 ${
              activeTab === 'settings'
                ? 'bg-navy text-white shadow-sm'
                : 'text-slate-700 hover:bg-white/70 hover:text-navy'
            }`}
          >
            <Settings className="w-4 h-4 text-gold" />
            <span>Settings &amp; SEO</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="mt-8">
          {activeTab === 'cms' && <CMSManager />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'vault' && <DocumentVault />}
          {activeTab === 'audit' && <AuditTrailViewer />}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              {/* Security & Access */}
              <div className="bg-white p-8 border border-slate-200/80 shadow-sm">
                <span className="text-gold text-xs uppercase tracking-widest font-bold">Access Security</span>
                <h2 className="text-navy text-xl font-serif font-bold mt-1 mb-6">Administrator Security Key</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-gold uppercase text-xs tracking-widest font-bold block mb-2">
                      New Security Code
                    </label>
                    <input
                      type="password"
                      value={newAdminPassword.code}
                      onChange={(e) => setNewAdminPassword({ ...newAdminPassword, code: e.target.value })}
                      placeholder="Min. 8 characters"
                      className="w-full bg-ghost border border-slate-300 p-3 text-navy focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-gold uppercase text-xs tracking-widest font-bold block mb-2">
                      Confirm Security Code
                    </label>
                    <input
                      type="password"
                      value={newAdminPassword.confirm}
                      onChange={(e) => setNewAdminPassword({ ...newAdminPassword, confirm: e.target.value })}
                      placeholder="Confirm new code"
                      className="w-full bg-ghost border border-slate-300 p-3 text-navy focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                    />
                  </div>
                </div>

                {passwordFeedback.error && (
                  <p className="text-red-600 text-xs mt-3">{passwordFeedback.error}</p>
                )}
                {passwordFeedback.success && (
                  <p className="text-emerald-700 text-xs mt-3">{passwordFeedback.success}</p>
                )}

                <button
                  onClick={handleAdminPasswordSave}
                  className="mt-6 bg-navy text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all"
                >
                  Save New Security Key
                </button>
              </div>

              {/* SEO & Meta Settings */}
              <div className="bg-white p-8 border border-slate-200/80 shadow-sm">
                <span className="text-gold text-xs uppercase tracking-widest font-bold">Metadata &amp; Search</span>
                <h2 className="text-navy text-xl font-serif font-bold mt-1 mb-6">Global SEO Metadata</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-gold uppercase text-xs tracking-widest font-bold block mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={localSeo.title}
                      onChange={(e) => setLocalSeo({ ...localSeo, title: e.target.value })}
                      className="w-full bg-ghost border border-slate-300 p-3 text-navy focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-gold uppercase text-xs tracking-widest font-bold block mb-2">
                      Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={localSeo.description}
                      onChange={(e) => setLocalSeo({ ...localSeo, description: e.target.value })}
                      className="w-full bg-ghost border border-slate-300 p-3 text-navy focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-gold uppercase text-xs tracking-widest font-bold block mb-2">
                      Google Analytics Measurement ID
                    </label>
                    <input
                      type="text"
                      value={localSeo.gaId || ''}
                      onChange={(e) => setLocalSeo({ ...localSeo, gaId: e.target.value })}
                      placeholder="G-XXXXXXXXXX"
                      className="w-full bg-ghost border border-slate-300 p-3 text-navy focus:outline-none focus:ring-1 focus:ring-gold text-sm font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setSeo(localSeo)}
                  className="mt-6 bg-navy text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all"
                >
                  Save Global Metadata
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboardPage;
