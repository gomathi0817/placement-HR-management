import React, { useState } from 'react';
import { X, Building2, MapPin, Globe, Users, Briefcase } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddCompanyModal = ({ isOpen, onClose }) => {
  const { addCompany } = useApp();

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('IT Services & Software');
  const [location, setLocation] = useState('Bengaluru');
  const [studentsRequired, setStudentsRequired] = useState(25);
  const [status, setStatus] = useState('Active Recruitment');
  const [tier, setTier] = useState('Tier 1');
  const [hrContact, setHrContact] = useState('');
  const [website, setWebsite] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCompany({
      name,
      industry,
      location,
      studentsRequired: Number(studentsRequired) || 0,
      status,
      tier,
      hrContact: hrContact || 'TBD',
      website
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border-2 border-primary rounded-3xl max-w-md w-full overflow-hidden shadow-modal-custom flex flex-col">
        {/* Header */}
        <div className="bg-primary text-darkText p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-darkText text-cream flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Add Company Profile</h3>
              <span className="text-[11px] text-darkText/80 font-medium">Register new recruiter organization</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-darkText/10 text-darkText hover:bg-darkText/20 flex items-center justify-center transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 overflow-y-auto bg-cream/40 flex-1">
          <div>
            <label className="block text-xs font-bold text-darkText mb-1">
              Company Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ABC Technologies"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-xs p-3 bg-white border border-olive/50 rounded-xl focus:ring-2 focus:ring-primary outline-none text-darkText font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-darkText mb-1">
                Industry
              </label>
              <input
                type="text"
                placeholder="IT & Consulting"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-olive/50 rounded-xl outline-none text-darkText font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-darkText mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Bengaluru"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-olive/50 rounded-xl outline-none text-darkText font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-darkText mb-1">
                Students Required
              </label>
              <input
                type="number"
                value={studentsRequired}
                onChange={e => setStudentsRequired(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-olive/50 rounded-xl outline-none text-darkText font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-darkText mb-1">
                Company Tier
              </label>
              <select
                value={tier}
                onChange={e => setTier(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-olive/50 rounded-xl font-bold text-darkText"
              >
                <option value="Tier 1">Tier 1 (Dream)</option>
                <option value="Tier 2">Tier 2 (Core)</option>
                <option value="Tier 3">Tier 3 (Mass)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-darkText mb-1">
              Main HR Lead Name
            </label>
            <input
              type="text"
              placeholder="Gomathi HR"
              value={hrContact}
              onChange={e => setHrContact(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-olive/50 rounded-xl outline-none text-darkText font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-darkText mb-1">
              Website URL
            </label>
            <input
              type="url"
              placeholder="https://abctechnologies.com"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-olive/50 rounded-xl outline-none text-darkText font-semibold"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-darkText/70 hover:text-darkText"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary hover:bg-accent text-darkText font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              ✓ Add Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
