
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const InstitutionalAccessPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    institutionName: '',
    title: '',
    aum: '',
    message: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  // State to manage select text color due to cross-browser rendering issues with <option> styles.
  const [aumSelectColor, setAumSelectColor] = useState('text-white');

  useEffect(() => {
    const { fullName, email, institutionName, aum } = formData;

    const isValid =
      fullName.trim() !== '' &&
      email.trim() !== '' &&
      /\S+@\S+\.\S+/.test(email) &&
      institutionName.trim() !== '' &&
      aum.trim() !== '';

    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputStyle = "mt-2 w-full bg-slate-800/50 border border-white/20 p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold transition-all";
  const labelStyle = "text-gold uppercase text-xs tracking-widest font-bold";

  // When no value is selected, we want the placeholder color. Otherwise, use the dynamic color from state.
  const dynamicSelectColor = formData.aum ? aumSelectColor : 'text-slate-400';

  // Inline styles for options to force readability in native browser pickers
  const optionStyle = { color: 'black', backgroundColor: 'white' };

  return (
    <main className="min-h-screen pt-40 pb-20 bg-navy">
      <div className="px-12 md:px-24 max-w-3xl mx-auto">
        <div className="text-center">
          <span className="text-gold text-xs uppercase tracking-[0.5em] font-bold">Institutional Access</span>
          <h1 className="text-white text-4xl md:text-7xl mt-6 leading-tight font-serif">
            Request Portal Access.
          </h1>
          <p className="text-slate-300 mt-8 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            Our platform is reserved for Family Offices, UHNWIs, and Institutional Allocators. Please submit your details for verification. Access is typically granted within one business day.
          </p>
        </div>

        <form 
          action="https://formspree.io/f/xnjnwkwr" 
          method="POST" 
          className="mt-20 space-y-8"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="fullName" className={labelStyle}>Full Name</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className={inputStyle} placeholder="Primary Contact" required />
            </div>
            <div>
              <label htmlFor="email" className={labelStyle}>Institutional Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputStyle} placeholder="name@institution.com" required />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="institutionName" className={labelStyle}>Institution / Family Office</label>
              <input type="text" id="institutionName" name="institutionName" value={formData.institutionName} onChange={handleChange} className={inputStyle} placeholder="Entity Name" required />
            </div>
             <div>
              <label htmlFor="title" className={labelStyle}>Role / Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={inputStyle} placeholder="e.g., Chief Investment Officer" />
            </div>
          </div>
          <div>
            <label htmlFor="aum" className={labelStyle}>Assets Under Management (AUM)</label>
            {/* 
              Workaround for browsers (like Safari) that ignore color styles on <option> elements.
              By applying BOTH backgroundColor: 'white' and color: 'black' directly to options,
              we force most native pickers to render readable text.
            */}
            <select 
              id="aum" 
              name="aum" 
              value={formData.aum} 
              onChange={handleChange} 
              onFocus={() => setAumSelectColor('text-black')}
              onBlur={() => setAumSelectColor('text-white')}
              className={`${inputStyle.replace('text-white', '').replace('placeholder-slate-400', '')} ${dynamicSelectColor}`}
              required
            >
              <option value="" disabled style={optionStyle}>Select AUM Range...</option>
              <option value="< $50M" style={optionStyle}>Less than $50M</option>
              <option value="$50M - $250M" style={optionStyle}>$50M - $250M</option>
              <option value="$250M - $1B" style={optionStyle}>$250M - $1B</option>
              <option value="$1B - $5B" style={optionStyle}>$1B - $5B</option>
              <option value="> $5B" style={optionStyle}>Greater than $5B</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className={labelStyle}>Message (Optional)</label>
            <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Briefly state your area of interest (e.g., Legacy Assets, NEON)." className={inputStyle}></textarea>
          </div>
          <div>
            <button type="submit" disabled={!isFormValid} className="w-full bg-gold text-white px-10 py-4 text-sm uppercase tracking-widest font-bold transition-all disabled:bg-slate-500 disabled:cursor-not-allowed enabled:hover:bg-amber-700">
              Submit Access Request
            </button>
          </div>
        </form>

        <div className="text-center mt-16 border-t border-white/10 pt-8">
            <p className="text-slate-300 text-sm font-light">Already have access?</p>
            <Link to="/institutional-login" className="text-gold font-bold uppercase tracking-widest text-xs hover:underline mt-2 inline-block">
                Proceed to Secure Login
            </Link>
        </div>
      </div>
    </main>
  );
};

export default InstitutionalAccessPage;
