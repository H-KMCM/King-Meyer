import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, PlusCircle, Info, LogOut } from 'lucide-react';

// FIX: AdminSection component was defined inside AdminDashboardPage, causing re-definitions on each render and potential type inference issues. It has been moved to the module scope and its props have been explicitly typed.
interface AdminSectionProps {
  title: string;
  children: React.ReactNode;
}

const AdminSection: React.FC<AdminSectionProps> = ({ title, children }) => (
  <div className="bg-white p-6 md:p-8 shadow-md border border-slate/10 mb-8">
    <h2 className="text-xl font-bold text-navy mb-6 border-b border-slate/10 pb-4 font-serif">{title}</h2>
    {children}
  </div>
);

const AdminDashboardPage: React.FC = () => {
  const { theme, slogan, seo, theses, setTheme, setSlogan, setSeo, setTheses } = useSite();
  const navigate = useNavigate();

  const [localTheme, setLocalTheme] = useState(theme);
  const [localSlogan, setLocalSlogan] = useState(slogan);
  const [localSeo, setLocalSeo] = useState(seo);
  const [editingThesis, setEditingThesis] = useState(null);

  const handleLogout = () => {
    sessionStorage.removeItem('km-auth');
    navigate('/login');
  };

  const handleThemeSave = () => setTheme(localTheme);
  const handleSloganSave = () => setSlogan(localSlogan);
  const handleSeoSave = () => setSeo(localSeo);
  
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

  const handleSaveThesis = (thesisToSave) => {
    if(thesisToSave.id.startsWith('new-')) {
      // It's a new thesis
      setTheses([...theses, {...thesisToSave, id: `${Date.now()}`}]);
    } else {
      // It's an existing thesis
      setTheses(theses.map(t => t.id === thesisToSave.id ? thesisToSave : t));
    }
    setEditingThesis(null);
  }

  const handleDeleteThesis = (thesisId) => {
    if(window.confirm('Are you sure you want to delete this thesis? This action cannot be undone.')) {
      setTheses(theses.filter(t => t.id !== thesisId));
    }
  }

  // FIX: Define a props interface for InputField to make `tooltip` optional.
  interface InputFieldProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    name: string;
    type?: string;
    tooltip?: string;
  }

  const InputField = ({ label, value, onChange, name, type = 'text', tooltip }: InputFieldProps) => (
    <div className="mb-4">
      <label className="text-gold uppercase text-xs tracking-widest font-bold flex items-center">
        {label}
        {/* FIX: The `title` prop is not valid for `lucide-react` components. To display a tooltip, wrap the icon in a `span` with a `title` attribute. */}
        {tooltip && <span title={tooltip}><Info size={12} className="ml-2 text-slate" /></span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={5}
          className="mt-2 w-full bg-ghost border border-slate/30 p-3 text-navy focus:outline-none focus:ring-2 focus:ring-gold transition-all"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="mt-2 w-full bg-ghost border border-slate/30 p-3 text-navy focus:outline-none focus:ring-2 focus:ring-gold transition-all"
        />
      )}
    </div>
  );
  
  const ThesisForm = ({ thesis, onSave, onCancel }) => {
    const [formState, setFormState] = useState(thesis);
    
    const handleChange = e => {
      const { name, value, type, checked } = e.target;
      setFormState(prev => ({...prev, [name]: type === 'checkbox' ? checked : value}));
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
        
        {/* Theme Editor */}
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

        {/* Site Slogan */}
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
        
        {/* Content Manager */}
        <AdminSection title="Content: Intelligence & Theses">
          <div className="space-y-4">
            {theses.map(thesis => (
              <div key={thesis.id} className="flex justify-between items-center p-4 border border-slate/20">
                <div>
                  <p className="font-bold text-navy">{thesis.title}</p>
                  <p className="text-sm text-slate">{thesis.description}</p>
                </div>
                <div className="flex gap-4">
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

        {/* SEO Manager */}
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
            value={localSeo.gaId} 
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