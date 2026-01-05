
import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, PlusCircle, Info, LogOut } from 'lucide-react';

// AdminSection component for consistent panel styling
interface AdminSectionProps {
  title: string;
  children: React.ReactNode;
}

const AdminSection: React.FC<AdminSectionProps> = ({ title, children }) => (
  <div className="bg-white p-6 md:p-8 shadow-sm border border-slate/10 mb-8">
    <h2 className="text-xl font-bold text-navy mb-6 border-b border-slate/10 pb-4 font-serif">{title}</h2>
    {children}
  </div>
);

// InputField component for consistent form elements
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  name: string;
  type?: string;
  tooltip?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, name, type = 'text', tooltip, placeholder }) => (
    <div className="mb-4">
      <label className="text-gold uppercase text-xs tracking-widest font-bold flex items-center">
        {label}
        {tooltip && (
          <span title={tooltip} className="cursor-help">
            <Info size={12} className="ml-2 text-slate" />
          </span>
        )}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={5}
          className="mt-2 w-full bg-ghost border border-slate/30 p-3 text-navy focus:outline-none focus:ring-2 focus:ring-gold transition-all"
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="mt-2 w-full bg-ghost border border-slate/30 p-3 text-navy focus:outline-none focus:ring-2 focus:ring-gold transition-all"
          placeholder={placeholder}
        />
      )}
    </div>
);

// ThesisForm modal component
const ThesisForm: React.FC<{ thesis: any; onSave: (thesis: any) => void; onCancel: () => void; }> = ({ thesis, onSave, onCancel }) => {
    const [formState, setFormState] = useState(thesis);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      setFormState((prev: any) => ({...prev, [name]: type === 'checkbox' ? checked : value}));
    };
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-bold text-navy mb-6 font-serif">{thesis.id.startsWith('new-') ? 'Add New Thesis' : 'Edit Thesis'}</h3>
          <InputField label="Title" name="title" value={formState.title} onChange={handleChange} />
          <InputField label="Description" name="description" value={formState.description} onChange={handleChange} />
          <InputField label="Image URL" name="imageUrl" value={formState.imageUrl} onChange={handleChange} />
          <InputField label="Excerpt" name="excerpt" type="textarea" value={formState.excerpt} onChange={handleChange} />
          <div className="flex items-center mb-6">
             <input type="checkbox" name="lead" id="lead" checked={formState.lead} onChange={handleChange} className="h-4 w-4 text-gold border-slate/30 focus:ring-gold" />
             <label htmlFor="lead" className="ml-2 text-navy">Make this the Lead Thesis</label>
          </div>
          <div className="flex justify-end gap-4">
            <button onClick={onCancel} className="border border-slate/30 text-navy px-6 py-2 text-sm uppercase tracking-widest font-bold hover:bg-slate/10 transition-all">Cancel</button>
            <button onClick={() => onSave(formState)} className="bg-gold text-white px-6 py-2 text-sm uppercase tracking-widest font-bold hover:bg-amber-700 transition-all">Save Thesis</button>
          </div>
        </div>
      </div>
    );
};


const AdminDashboardPage: React.FC = () => {
  const { theme, logo, slogan, seo, theses, setLogo, setAdminPassword, setTheme, setSlogan, setSeo, setTheses } = useSite();
  const navigate = useNavigate();

  const [localTheme, setLocalTheme] = useState(theme);
  const [localLogo, setLocalLogo] = useState(logo);
  const [localSlogan, setLocalSlogan] = useState(slogan);
  const [localSeo, setLocalSeo] = useState(seo);
  const [editingThesis, setEditingThesis] = useState<any>(null);
  const [newAdminPassword, setNewAdminPassword] = useState({ code: '', confirm: '' });
  const [passwordFeedback, setPasswordFeedback] = useState({ error: '', success: '' });

  const handleLogout = () => {
    sessionStorage.removeItem('km-auth');
    navigate('/login');
  };

  const handleThemeSave = () => setTheme(localTheme);
  const handleLogoSave = () => setLogo(localLogo);
  const handleSloganSave = () => setSlogan(localSlogan);
  const handleSeoSave = () => setSeo(localSeo);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddNewThesis = () => {
    setEditingThesis({
      id: `new-${Date.now()}`,
      title: '',
      description: '',
      lead: false,
      imageUrl: '',
      excerpt: ''
    });
  }

  const handleSaveThesis = (thesisToSave: any) => {
    if (thesisToSave.id.startsWith('new-')) {
      setTheses([...theses, {...thesisToSave, id: `${Date.now()}`}]);
    } else {
      setTheses(theses.map((t: any) => t.id === thesisToSave.id ? thesisToSave : t));
    }
    setEditingThesis(null);
  }

  const handleDeleteThesis = (thesisId: string) => {
    if (window.confirm('Are you sure you want to delete this thesis? This action cannot be undone.')) {
      setTheses(theses.filter((t: any) => t.id !== thesisId));
    }
  }

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
    <main className="min-h-screen pt-40 pb-20 bg-ghost">
      {editingThesis && <ThesisForm thesis={editingThesis} onSave={handleSaveThesis} onCancel={() => setEditingThesis(null)} />}
      <div className="px-12 md:px-24 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
            <h1 className="text-navy text-4xl md:text-5xl leading-tight font-serif">Admin Dashboard</h1>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate hover:text-gold transition-colors">
                <LogOut size={16} /> Logout
            </button>
        </div>

        <AdminSection title="Company Branding">
            <InputField 
              label="Logo URL" 
              name="logoUrl" 
              value={localLogo} 
              onChange={e => setLocalLogo(e.target.value)}
              placeholder="https://example.com/logo.png"
              tooltip="Paste an image URL or upload a file below."
            />
            <div className="mb-4">
                <label className="text-gold uppercase text-xs tracking-widest font-bold">Upload Logo File</label>
                <input type="file" onChange={handleLogoUpload} accept="image/*" className="mt-2 text-sm text-slate file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold/10 file:text-gold hover:file:bg-gold/20" />
            </div>
            {localLogo && (
                <div className="mt-4 p-4 border border-slate/20">
                    <p className="text-sm font-bold text-navy mb-2">Logo Preview:</p>
                    <img src={localLogo} alt="Logo preview" className="max-h-16 bg-navy p-2" />
                </div>
            )}
            <div className="flex gap-4 mt-4">
                <button onClick={handleLogoSave} className="bg-navy text-white px-6 py-2 text-sm uppercase tracking-widest font-bold hover:bg-slate-800 transition-all">Save Branding</button>
                <button onClick={() => setLocalLogo('')} className="border border-slate/30 text-navy px-6 py-2 text-sm uppercase tracking-widest font-bold hover:bg-slate/10 transition-all">Remove Logo</button>
            </div>
        </AdminSection>
        
        <AdminSection title="Theme Editor">
          <div className="grid md:grid-cols-2 gap-6">
            <InputField 
              label="Primary Color (Navy)" 
              name="primary" 
              value={localTheme.primary} 
              onChange={e => setLocalTheme({...localTheme, primary: e.target.value})}
              tooltip="This controls the main background colors like headers and footers."
            />
            <InputField 
              label="Secondary Color (Gold)" 
              name="secondary" 
              value={localTheme.secondary} 
              onChange={e => setLocalTheme({...localTheme, secondary: e.target.value})}
              tooltip="This controls accent colors for buttons, links, and highlights."
            />
          </div>
          <button onClick={handleThemeSave} className="mt-4 bg-navy text-white px-6 py-2 text-sm uppercase tracking-widest font-bold hover:bg-slate-800 transition-all">Save Theme</button>
        </AdminSection>

        <AdminSection title="Security & Access">
          <div className="grid md:grid-cols-2 gap-6">
             <InputField 
              label="New Admin Access Code" 
              name="code"
              type="password"
              value={newAdminPassword.code}
              onChange={e => setNewAdminPassword({...newAdminPassword, code: e.target.value})}
              placeholder="Min. 8 characters"
            />
             <InputField 
              label="Confirm New Access Code" 
              name="confirm"
              type="password"
              value={newAdminPassword.confirm}
              onChange={e => setNewAdminPassword({...newAdminPassword, confirm: e.target.value})}
              placeholder="Confirm new code"
            />
          </div>
          {passwordFeedback.error && <p className="text-red-600 text-sm mt-2">{passwordFeedback.error}</p>}
          {passwordFeedback.success && <p className="text-green-600 text-sm mt-2">{passwordFeedback.success}</p>}
          <button onClick={handleAdminPasswordSave} className="mt-4 bg-navy text-white px-6 py-2 text-sm uppercase tracking-widest font-bold hover:bg-slate-800 transition-all">Save New Access Code</button>
        </AdminSection>

        <AdminSection title="Site Slogan">
           <InputField 
              label="Header Slogan" 
              name="slogan" 
              value={localSlogan} 
              onChange={e => setLocalSlogan(e.target.value)}
              tooltip="This text appears below the logo in the header."
            />
           <button onClick={handleSloganSave} className="mt-4 bg-navy text-white px-6 py-2 text-sm uppercase tracking-widest font-bold hover:bg-slate-800 transition-all">Save Slogan</button>
        </AdminSection>
        
        <AdminSection title="Content: Intelligence & Theses">
          <div className="space-y-4">
            {theses.map((thesis: any) => (
              <div key={thesis.id} className="flex justify-between items-center p-4 border border-slate/20 rounded-md">
                <div>
                  <p className="font-bold text-navy">{thesis.title} {thesis.lead && <span className="text-xs bg-gold text-white px-2 py-0.5 rounded-full ml-2">LEAD</span>}</p>
                  <p className="text-sm text-slate">{thesis.description}</p>
                </div>
                <div className="flex gap-4 flex-shrink-0">
                  <button onClick={() => setEditingThesis(thesis)} title="Edit"><Edit className="text-slate hover:text-gold" /></button>
                  <button onClick={() => handleDeleteThesis(thesis.id)} title="Delete"><Trash2 className="text-slate hover:text-red-600" /></button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleAddNewThesis} className="mt-6 flex items-center gap-2 bg-gold text-white px-6 py-2 text-sm uppercase tracking-widest font-bold hover:bg-amber-700 transition-all">
            <PlusCircle size={16} /> Add New Thesis
          </button>
        </AdminSection>

        <AdminSection title="SEO Manager">
          <InputField 
            label="Meta Title" 
            name="title" 
            value={localSeo.title} 
            onChange={e => setLocalSeo({...localSeo, title: e.target.value})}
            tooltip="The title that appears in the browser tab and search engine results."
          />
          <InputField 
            label="Meta Description" 
            name="description" 
            type="textarea"
            value={localSeo.description} 
            onChange={e => setLocalSeo({...localSeo, description: e.target.value})}
            tooltip="A brief summary of the page for search engines."
          />
           <InputField 
            label="Google Analytics ID" 
            name="gaId" 
            value={localSeo.gaId || ''} 
            onChange={e => setLocalSeo({...localSeo, gaId: e.target.value})}
            tooltip="e.g., G-XXXXXXXXXX. Leave blank to disable."
          />
          <button onClick={handleSeoSave} className="mt-4 bg-navy text-white px-6 py-2 text-sm uppercase tracking-widest font-bold hover:bg-slate-800 transition-all">Save SEO Settings</button>
        </AdminSection>

      </div>
    </main>
  );
};

export default AdminDashboardPage;
