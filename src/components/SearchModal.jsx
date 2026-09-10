import React, { useState, useEffect } from 'react';
import { Search, X, Users, Building2, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const SearchModal = ({ isOpen, onClose }) => {
  const { hrs, companies, followUps, interactions } = useApp();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedHRs = query.trim() ? hrs.filter(h =>
    h.name.toLowerCase().includes(query.toLowerCase()) ||
    h.companyName.toLowerCase().includes(query.toLowerCase()) ||
    h.designation.toLowerCase().includes(query.toLowerCase())
  ) : hrs.slice(0, 3);

  const matchedCompanies = query.trim() ? companies.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.industry.toLowerCase().includes(query.toLowerCase())
  ) : companies.slice(0, 3);

  const matchedFollowUps = query.trim() ? followUps.filter(f =>
    f.hrName.toLowerCase().includes(query.toLowerCase()) ||
    f.companyName.toLowerCase().includes(query.toLowerCase()) ||
    f.purpose.toLowerCase().includes(query.toLowerCase())
  ) : followUps.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border-2 border-primary rounded-3xl max-w-xl w-full overflow-hidden shadow-modal-custom flex flex-col max-h-[80vh]">
        {/* Search Input Header */}
        <div className="p-4 border-b-2 border-olive/40 bg-cream flex items-center gap-3">
          <Search className="w-5 h-5 text-darkText" />
          <input
            type="text"
            autoFocus
            placeholder="Global Search HR, Company, Purpose... (Press ESC to close)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-darkText outline-none placeholder:text-darkText/60"
          />
          <button onClick={onClose} className="p-1 text-darkText/70 hover:text-darkText">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 bg-white">
          {/* HR Contacts Category */}
          {matchedHRs.length > 0 && (
            <div>
              <span className="text-[10px] font-black uppercase text-darkText/70 tracking-wider block mb-2">
                HR Contacts ({matchedHRs.length})
              </span>
              <div className="space-y-1.5">
                {matchedHRs.map(h => (
                  <div
                    key={h.id}
                    onClick={() => {
                      navigate(`/hr/${h.id}`);
                      onClose();
                    }}
                    className="p-3 bg-cream hover:bg-olive/20 rounded-xl border border-olive/30 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary text-darkText flex items-center justify-center font-bold text-xs">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-darkText">{h.name}</h4>
                        <span className="text-[11px] text-darkText/70 font-semibold">{h.companyName} • {h.designation}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-darkText" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Companies Category */}
          {matchedCompanies.length > 0 && (
            <div>
              <span className="text-[10px] font-black uppercase text-darkText/70 tracking-wider block mb-2">
                Recruiting Companies ({matchedCompanies.length})
              </span>
              <div className="space-y-1.5">
                {matchedCompanies.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      navigate(`/companies`);
                      onClose();
                    }}
                    className="p-3 bg-cream hover:bg-olive/20 rounded-xl border border-olive/30 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-olive text-darkText flex items-center justify-center font-bold text-xs">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-darkText">{c.name}</h4>
                        <span className="text-[11px] text-darkText/70 font-semibold">{c.industry} • {c.location}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-darkText" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follow-Ups Category */}
          {matchedFollowUps.length > 0 && (
            <div>
              <span className="text-[10px] font-black uppercase text-darkText/70 tracking-wider block mb-2">
                Follow-Up Reminders ({matchedFollowUps.length})
              </span>
              <div className="space-y-1.5">
                {matchedFollowUps.map(f => (
                  <div
                    key={f.id}
                    onClick={() => {
                      navigate(`/follow-ups`);
                      onClose();
                    }}
                    className="p-3 bg-cream hover:bg-olive/20 rounded-xl border border-olive/30 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center font-bold text-xs border border-accent/30">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-darkText">{f.hrName} ({f.companyName})</h4>
                        <span className="text-[11px] text-darkText/70 font-semibold">"{f.purpose}" • {f.date}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-darkText" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
