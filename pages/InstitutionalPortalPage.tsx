
import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, FileText, FolderKanban, Briefcase, KeyRound } from 'lucide-react';

interface PortalSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const PortalSection: React.FC<PortalSectionProps> = ({ title, icon, children }) => (
  <div className="bg-white p-6 md:p-8 shadow-sm border border-slate/10 mb-8">
    <div className="flex items-center text-navy mb-6 border-b border-slate/10 pb-4">
        {icon}
        <h2 className="text-xl font-bold ml-4 font-serif">{title}</h2>
    </div>
    {children}
  </div>
);

const InputField: React.FC<{ label: string; name: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; }> = 
({ label, name, type, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={name} className="text-gold uppercase text-xs tracking-widest font-bold">{label}</label>
        <input 
            type={type} 
            id={name} 
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-2 w-full bg-ghost border border-slate/30 p-3 text-navy placeholder-slate/50 focus:outline-none focus:ring-2 focus:ring-gold transition-all"
        />
    </div>
);


const InstitutionalPortalPage: React.FC = () => {
  const { theses, setInvestorPassword } = useSite();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState({ code: '', confirm: '' });
  const [passwordFeedback, setPasswordFeedback] = useState({ error: '', success: '' });

  const handleLogout = () => {
    sessionStorage.removeItem('km-institutional-auth');
    navigate('/institutional-login');
  };

  const handlePasswordSave = () => {
    setPasswordFeedback({ error: '', success: '' });
    if (!newPassword.code || newPassword.code.length < 8) {
        setPasswordFeedback({ error: 'New code must be at least 8 characters long.', success: '' });
        return;
    }
    if (newPassword.code !== newPassword.confirm) {
        setPasswordFeedback({ error: 'Access codes do not match.', success: '' });
        return;
    }
    setInvestorPassword(newPassword.code);
    setPasswordFeedback({ error: '', success: 'Access code updated successfully.' });
    setNewPassword({ code: '', confirm: '' });
  };

  return (
    <main className="min-h-screen pt-40 pb-20 bg-ghost">
      <div className="px-12 md:px-24 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
            <div>
                <span className="text-gold text-xs uppercase tracking-[0.5em] font-bold">Confidential</span>
                <h1 className="text-navy text-4xl md:text-5xl mt-2 leading-tight font-serif">Institutional Portal</h1>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate hover:text-gold transition-colors">
                <LogOut size={16} /> Secure Logout
            </button>
        </div>
        
        {/* Confidential Memos */}
        <PortalSection title="Confidential Memos & Theses" icon={<FileText className="text-gold" />}>
           <div className="space-y-4">
            {theses.map((thesis: any) => (
              <div key={thesis.id} className="flex justify-between items-center p-4 border border-slate/10 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-bold text-navy">{thesis.title}</p>
                  <p className="text-sm text-slate mt-1">{thesis.description}</p>
                </div>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-sm uppercase tracking-widest font-bold text-gold hover:underline whitespace-nowrap">
                  View PDF
                </a>
              </div>
            ))}
          </div>
        </PortalSection>

        {/* Virtual Data Room */}
        <PortalSection title="Virtual Data Room (VDR)" icon={<FolderKanban className="text-gold" />}>
           <p className="text-slate mb-6 text-sm font-light">Access to due diligence materials, financial statements, and legal documentation for active verticals.</p>
           <div className="grid md:grid-cols-2 gap-4">
                <a href="#" onClick={(e) => e.preventDefault()} className="block p-4 border border-slate/20 text-center text-navy font-bold hover:bg-gold hover:text-white transition-all">Quant Core VDR</a>
                <a href="#" onClick={(e) => e.preventDefault()} className="block p-4 border border-slate/20 text-center text-navy font-bold hover:bg-gold hover:text-white transition-all">NEON VDR</a>
                <a href="#" onClick={(e) => e.preventDefault()} className="block p-4 border border-slate/20 text-center text-navy font-bold hover:bg-gold hover:text-white transition-all">Legacy Assets VDR</a>
                <a href="#" onClick={(e) => e.preventDefault()} className="block p-4 border border-slate/20 text-center text-navy font-bold hover:bg-gold hover:text-white transition-all">Digital Layer VDR</a>
           </div>
        </PortalSection>

        {/* Capital Account */}
        <PortalSection title="Capital Account Overview" icon={<Briefcase className="text-gold" />}>
            <p className="text-slate mb-6 text-sm font-light">A summary of your capital account status as of Q3 2024. Official statements are distributed quarterly.</p>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate uppercase tracking-wider text-xs">
                        <tr>
                            <th className="p-3">Fund/Vertical</th>
                            <th className="p-3 text-right">Commitment</th>
                            <th className="p-3 text-right">Capital Called</th>
                            <th className="p-3 text-right">Distributions</th>
                            <th className="p-3 text-right">Net Asset Value</th>
                        </tr>
                    </thead>
                    <tbody className="text-navy">
                        <tr className="border-b border-slate/10">
                            <td className="p-3 font-semibold">K&M Legacy Assets Fund I, LP</td>
                            <td className="p-3 text-right font-mono">$5,000,000</td>
                            <td className="p-3 text-right font-mono">$3,500,000</td>
                            <td className="p-3 text-right font-mono">$250,000</td>
                            <td className="p-3 text-right font-mono font-bold text-gold">$3,820,000</td>
                        </tr>
                         <tr className="border-b border-slate/10">
                            <td className="p-3 font-semibold">NEON Performance SPV</td>
                            <td className="p-3 text-right font-mono">$1,500,000</td>
                            <td className="p-3 text-right font-mono">$1,500,000</td>
                            <td className="p-3 text-right font-mono">$0</td>
                            <td className="p-3 text-right font-mono font-bold text-gold">$1,950,000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </PortalSection>

        {/* Security Settings */}
        <PortalSection title="Security Settings" icon={<KeyRound className="text-gold" />}>
            <div className="grid md:grid-cols-2 gap-6">
                <InputField 
                    label="New Access Code" 
                    name="code" 
                    type="password"
                    value={newPassword.code}
                    onChange={(e) => setNewPassword({...newPassword, code: e.target.value})}
                    placeholder="Min. 8 characters"
                />
                <InputField 
                    label="Confirm New Code" 
                    name="confirm"
                    type="password" 
                    value={newPassword.confirm}
                    onChange={(e) => setNewPassword({...newPassword, confirm: e.target.value})}
                    placeholder="Confirm new code"
                />
            </div>
            {passwordFeedback.error && <p className="text-red-600 text-sm mt-2">{passwordFeedback.error}</p>}
            {passwordFeedback.success && <p className="text-green-600 text-sm mt-2">{passwordFeedback.success}</p>}
            <div className="mt-6">
                <button onClick={handlePasswordSave} className="bg-navy text-white px-8 py-3 text-sm uppercase tracking-widest font-bold hover:bg-slate-800 transition-all text-center">
                    Update Access Code
                </button>
            </div>
        </PortalSection>
      </div>
    </main>
  );
};

export default InstitutionalPortalPage;
