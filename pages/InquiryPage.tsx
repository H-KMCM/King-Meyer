
import React, { useState, useEffect } from 'react';

const InquiryPage: React.FC = () => {
  const [formData, setFormData] = useState({
    legalEntityName: '',
    email: '',
    phoneNumber: '',
    verticalAlignment: '',
    systemicInefficiency: '',
    capitalCommitment: '',
    controlAcknowledgment: false,
  });

  const [wordCount, setWordCount] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const {
      legalEntityName,
      email,
      verticalAlignment,
      systemicInefficiency,
      capitalCommitment,
      controlAcknowledgment,
    } = formData;

    const words = systemicInefficiency.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);

    const isValid =
      legalEntityName.trim() !== '' &&
      email.trim() !== '' &&
      /\S+@\S+\.\S+/.test(email) &&
      verticalAlignment.trim() !== '' &&
      systemicInefficiency.trim() !== '' &&
      words.length > 0 && words.length <= 200 &&
      capitalCommitment.trim() !== '' &&
      controlAcknowledgment;

    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const inputStyle = "mt-2 w-full bg-ghost border border-slate/30 p-3 text-navy placeholder-slate/50 focus:outline-none focus:ring-2 focus:ring-gold transition-all";
  const labelStyle = "text-gold uppercase text-xs tracking-widest font-bold";

  return (
    <main className="min-h-screen pt-40 pb-20 bg-ghost">
      <div className="px-12 md:px-24 max-w-3xl mx-auto">
        <div className="text-center">
          <span className="text-gold text-xs uppercase tracking-[0.5em] font-bold">Strategic Inquiry</span>
          <h1 className="text-navy text-4xl md:text-7xl mt-6 leading-tight font-serif">
            The Gatekeeper.
          </h1>
          <p className="text-slate mt-8 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            We do not provide consultations. We enter into high-stakes partnerships with high-conviction operators and allocators.
          </p>
        </div>
        <form 
          action="https://formspree.io/f/xzdzydnn" 
          method="POST" 
          className="mt-20 space-y-8"
        >
          <div>
            <label htmlFor="legalEntityName" className={labelStyle}>Legal Entity Name</label>
            <input type="text" id="legalEntityName" name="legalEntityName" value={formData.legalEntityName} onChange={handleChange} className={inputStyle} placeholder="No individuals without a holding structure" />
          </div>
          <div>
            <label htmlFor="email" className={labelStyle}>Contact Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputStyle} placeholder="Primary institutional contact email" required />
          </div>
          <div>
            <label htmlFor="phoneNumber" className={labelStyle}>Contact Phone (Optional)</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputStyle} placeholder="Optional contact number" />
          </div>
          <div>
            <label htmlFor="verticalAlignment" className={labelStyle}>Proposed Vertical Alignment</label>
            <select id="verticalAlignment" name="verticalAlignment" value={formData.verticalAlignment} onChange={handleChange} className={inputStyle}>
              <option value="" disabled>Select a vertical...</option>
              <option>Quant Core</option>
              <option>NEON</option>
              <option>Legacy Assets</option>
              <option>Digital Layer</option>
            </select>
          </div>
          <div>
            <label htmlFor="systemicInefficiency" className={labelStyle}>The Systemic Inefficiency</label>
            <textarea id="systemicInefficiency" name="systemicInefficiency" value={formData.systemicInefficiency} onChange={handleChange} rows={6} placeholder="In 200 words, define the structural failure you are addressing." className={inputStyle} maxLength={1200}></textarea>
            <p className={`text-right text-xs mt-1 ${wordCount > 200 ? 'text-red-500' : 'text-slate'}`}>{wordCount} / 200 words</p>
          </div>
          <div>
            <label htmlFor="capitalCommitment" className={labelStyle}>Capital/Resource Commitment</label>
            <textarea id="capitalCommitment" name="capitalCommitment" value={formData.capitalCommitment} onChange={handleChange} rows={4} placeholder="Define the 'Skin in the Game' currently deployed." className={inputStyle}></textarea>
          </div>
          <div className="flex items-start">
            <input type="checkbox" id="controlAcknowledgment" name="controlAcknowledgment" checked={formData.controlAcknowledgment} onChange={handleChange} className="mt-1 h-4 w-4 text-gold border-slate/30 focus:ring-gold" />
            <label htmlFor="controlAcknowledgment" className="ml-3 text-sm text-navy font-light">
              I understand and accept that King & Meyer operates under a Majority-Control and Institutional-Grade Mandate.
            </label>
          </div>
          <div>
            <button type="submit" disabled={!isFormValid} className="w-full bg-gold text-white px-10 py-4 text-sm uppercase tracking-widest font-bold transition-all disabled:bg-slate-300 disabled:cursor-not-allowed enabled:hover:bg-amber-700">
              Submit Inquiry
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default InquiryPage;
