import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Search, Plus, MapPin, Users, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { AddCompanyModal } from '../components/modals/AddCompanyModal';

export const Companies = () => {
  const { companies } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.hrContact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-primary rounded-3xl p-6 shadow-card-custom">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-darkText">
            Recruiting Companies Directory
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-darkText/70 mt-1">
            Track participating companies, drive stages, and campus hiring requirements.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 bg-primary hover:bg-accent text-darkText font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Company</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-2 border-olive/50 rounded-2xl p-4 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-darkText/60 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search company name, industry, or location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 bg-cream border border-olive/50 rounded-xl focus:ring-2 focus:ring-primary outline-none text-darkText"
          />
        </div>
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map(company => (
          <div
            key={company.id}
            className="bg-white hover:bg-cream border-2 border-olive/50 hover:border-primary rounded-3xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4 group"
          >
            <div>
              {/* Top Banner */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-black text-lg text-darkText group-hover:text-accent leading-tight transition-colors">
                    {company.name}
                  </h3>
                  <span className="text-xs font-bold text-darkText/70">
                    {company.industry}
                  </span>
                </div>

                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-primary/30 text-darkText border border-olive/40">
                  {company.tier || 'Tier 1'}
                </span>
              </div>

              {/* Status Chip */}
              <div className="mb-3">
                <span className="inline-block text-[11px] font-extrabold px-3 py-0.5 rounded-full bg-olive/30 text-darkText border border-olive">
                  {company.status}
                </span>
              </div>

              {/* Specs Box */}
              <div className="bg-cream border border-olive/40 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-darkText/70 font-semibold">Location:</span>
                  <span className="font-bold text-darkText flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {company.location}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-darkText/70 font-semibold">Students Required:</span>
                  <span className="font-black text-darkText text-sm">{company.studentsRequired} Candidates</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-darkText/70 font-semibold">Main HR Contact:</span>
                  <span className="font-bold text-accent">{company.hrContact}</span>
                </div>

                <div className="pt-2 border-t border-olive/30">
                  <span className="text-[10px] font-bold text-darkText/70 uppercase block">Recruitment Stage</span>
                  <span className="font-bold text-darkText italic">"{company.recruitmentStage}"</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-olive/40 flex items-center justify-between text-xs font-bold text-darkText/70">
              <div>
                <span>Last Interaction: </span>
                <span className="text-darkText">{company.lastInteraction}</span>
              </div>

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-darkText hover:text-accent hover:underline flex items-center gap-1 transition-colors"
                >
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <AddCompanyModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
