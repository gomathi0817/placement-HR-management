import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Search,
  Plus,
  MapPin,
  Users,
  CalendarDays,
  ExternalLink,
  BriefcaseBusiness,
  UserRound,
  ChevronRight,
  Layers3
} from 'lucide-react';
import { AddCompanyModal } from '../components/modals/AddCompanyModal';

const getInitial = (name) => {
  const value = String(name || '').trim();

  if (!value) return 'C';

  return value.charAt(0).toUpperCase();
};

const getCompanyValue = (value, fallback = 'Not available') => {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ''
  ) {
    return fallback;
  }

  return value;
};

const getStatusStyle = (status) => {
  const value = String(status || '').toLowerCase();

  if (
    value.includes('active') ||
    value.includes('ongoing') ||
    value.includes('open')
  ) {
    return {
      bg: '#EAF5EC',
      text: '#3E7650',
      border: '#BFD9C6'
    };
  }

  if (
    value.includes('complete') ||
    value.includes('closed') ||
    value.includes('selected')
  ) {
    return {
      bg: '#FDFBD4',
      text: '#69591F',
      border: '#D8C98C'
    };
  }

  if (
    value.includes('pending') ||
    value.includes('waiting')
  ) {
    return {
      bg: '#FFF5E9',
      text: '#A65D20',
      border: '#E8C49F'
    };
  }

  return {
    bg: '#F7F3E8',
    text: '#5D5041',
    border: '#DDD4C2'
  };
};

export const Companies = () => {
  const {
    companies = []
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);

  const filteredCompanies = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return companies;
    }

    return companies.filter((company) => {
      const searchableText = [
        company.name,
        company.industry,
        company.location,
        company.hrContact,
        company.status,
        company.tier,
        company.recruitmentStage
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(search);
    });
  }, [companies, searchTerm]);

  const activeCompanies = companies.filter((company) => {
    const status = String(
      company.status || ''
    ).toLowerCase();

    return (
      status.includes('active') ||
      status.includes('ongoing') ||
      status.includes('open')
    );
  }).length;

  const totalStudentsRequired = companies.reduce(
    (total, company) => {
      const number = Number(
        company.studentsRequired
      );

      return total + (
        Number.isFinite(number)
          ? number
          : 0
      );
    },
    0
  );

  return (
    <main className="min-h-full w-full bg-[#FDFBD4] px-4 pb-24 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-12">

      <div className="mx-auto w-full max-w-7xl">

        {/* PAGE HEADER */}
        <section className="relative overflow-hidden rounded-[30px] border border-[#D7B943] bg-white p-5 shadow-[0_12px_35px_rgba(58,42,22,0.07)] sm:p-7">

          <div
            className="absolute left-0 top-0 h-1 w-full"
            style={{
              backgroundColor: '#D4AF37'
            }}
          />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#3A2A16]">
                  <Building2 size={20} />
                </div>

                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#A65D20]">
                  PlaceSync
                </span>

              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-[#3A2A16] sm:text-3xl">
                Company Directory
              </h1>

              <p className="mt-1 max-w-xl text-[11px] font-medium leading-5 text-[#81776B] sm:text-xs">
                Manage recruiting companies, hiring requirements and placement relationships in one place.
              </p>

            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3A2A16] px-5 py-3 text-[10px] font-black text-[#FDFBD4] shadow-[0_8px_20px_rgba(58,42,22,0.15)] transition hover:-translate-y-0.5 hover:bg-[#4B371F] active:translate-y-0"
            >
              <Plus size={15} />
              Add Company
            </button>

          </div>

          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#D4AF37] opacity-10" />

        </section>

        {/* SUMMARY */}
        <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#E5DECF] bg-white p-4">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#958A7D]">
                  Total Companies
                </p>

                <p className="mt-1 text-2xl font-black text-[#3A2A16]">
                  {companies.length}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#3A2A16]">
                <Building2 size={18} />
              </div>

            </div>

            <p className="mt-2 text-[9px] font-semibold text-[#958A7D]">
              Companies in your directory
            </p>

          </div>

          <div className="rounded-2xl border border-[#BFD9C6] bg-[#F7FBF8] p-4">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#819989]">
                  Active Companies
                </p>

                <p className="mt-1 text-2xl font-black text-[#3E7650]">
                  {activeCompanies}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#3E7650]">
                <Layers3 size={18} />
              </div>

            </div>

            <p className="mt-2 text-[9px] font-semibold text-[#819989]">
              Currently participating
            </p>

          </div>

          <div className="rounded-2xl border border-[#E8C49F] bg-[#FFF9F2] p-4">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#A09689]">
                  Students Required
                </p>

                <p className="mt-1 text-2xl font-black text-[#A65D20]">
                  {totalStudentsRequired}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#A65D20]">
                <Users size={18} />
              </div>

            </div>

            <p className="mt-2 text-[9px] font-semibold text-[#A09689]">
              Total hiring requirement
            </p>

          </div>

        </section>

        {/* SEARCH */}
        <section className="mt-5 rounded-2xl border border-[#E3DAC6] bg-white p-4 shadow-[0_6px_20px_rgba(58,42,22,0.03)]">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="relative w-full sm:max-w-xl">

              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#958A7D]"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search company, industry, location, HR..."
                className="w-full rounded-xl border border-[#DDD4C2] bg-[#FCFBF7] py-3 pl-10 pr-4 text-[10px] font-semibold text-[#3A2A16] outline-none transition placeholder:text-[#A09689] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              />

            </div>

            <div className="flex items-center gap-2">

              <span className="rounded-full bg-[#FDFBD4] px-3 py-1.5 text-[8px] font-black text-[#5D5041]">
                {filteredCompanies.length} Results
              </span>

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="rounded-full border border-[#DDD4C2] bg-white px-3 py-1.5 text-[8px] font-black text-[#81776B] transition hover:border-[#D4AF37] hover:text-[#3A2A16]"
                >
                  Clear
                </button>
              )}

            </div>

          </div>

        </section>

        {/* COMPANY DIRECTORY */}
        <section className="mt-5">

          {filteredCompanies.length === 0 ? (

            <div className="rounded-[28px] border border-dashed border-[#D8CFBD] bg-white px-5 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDFBD4] text-[#3A2A16]">
                <Building2 size={28} />
              </div>

              <h2 className="mt-4 text-base font-black text-[#3A2A16]">
                No companies found
              </h2>

              <p className="mx-auto mt-1 max-w-sm text-[10px] font-medium leading-5 text-[#958A7D]">
                Try another search term or add a new recruiting company to your directory.
              </p>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3A2A16] px-4 py-2.5 text-[9px] font-black text-[#FDFBD4]"
              >
                <Plus size={13} />
                Add Company
              </button>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

              {filteredCompanies.map((company) => {

                const statusStyle =
                  getStatusStyle(company.status);

                return (
                  <article
                    key={company.id}
                    className="group flex min-h-[355px] flex-col overflow-hidden rounded-[26px] border border-[#E3DAC6] bg-white shadow-[0_7px_22px_rgba(58,42,22,0.04)] transition-all hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_14px_32px_rgba(58,42,22,0.09)]"
                  >

                    {/* TOP */}
                    <div className="border-b border-[#EEE8D9] p-5">

                      <div className="flex items-start gap-3">

                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black"
                          style={{
                            backgroundColor: '#3A2A16',
                            color: '#FDFBD4',
                            border: '1px solid #D4AF37'
                          }}
                        >
                          {getInitial(company.name)}
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-2">

                            <div className="min-w-0">

                              <h2 className="truncate text-sm font-black text-[#3A2A16]">
                                {getCompanyValue(
                                  company.name,
                                  'Company'
                                )}
                              </h2>

                              <p className="mt-1 truncate text-[9px] font-bold text-[#958A7D]">
                                {getCompanyValue(
                                  company.industry,
                                  'Industry not specified'
                                )}
                              </p>

                            </div>

                            <span className="shrink-0 rounded-full border border-[#DDD4C2] bg-[#FCFBF7] px-2.5 py-1 text-[7px] font-black uppercase tracking-wide text-[#5D5041]">
                              {getCompanyValue(
                                company.tier,
                                'Tier 1'
                              )}
                            </span>

                          </div>

                          <span
                            className="mt-3 inline-flex rounded-full border px-2.5 py-1 text-[7px] font-black uppercase tracking-wide"
                            style={{
                              backgroundColor:
                                statusStyle.bg,
                              color:
                                statusStyle.text,
                              borderColor:
                                statusStyle.border
                            }}
                          >
                            {getCompanyValue(
                              company.status,
                              'Status not specified'
                            )}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 p-5">

                      <div className="space-y-2.5">

                        <div className="flex items-center gap-3 rounded-xl border border-[#ECE6D9] bg-[#FCFBF7] p-3">

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FDFBD4] text-[#A65D20]">
                            <MapPin size={14} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[7px] font-black uppercase tracking-wider text-[#A09689]">
                              Location
                            </p>

                            <p className="mt-0.5 truncate text-[9px] font-black text-[#4D4131]">
                              {getCompanyValue(
                                company.location
                              )}
                            </p>
                          </div>

                        </div>

                        <div className="grid grid-cols-2 gap-2">

                          <div className="rounded-xl border border-[#ECE6D9] bg-[#FCFBF7] p-3">

                            <div className="flex items-center gap-2">

                              <Users
                                size={13}
                                className="shrink-0 text-[#3E7650]"
                              />

                              <div className="min-w-0">

                                <p className="text-[7px] font-black uppercase tracking-wider text-[#A09689]">
                                  Students
                                </p>

                                <p className="mt-0.5 truncate text-[10px] font-black text-[#4D4131]">
                                  {getCompanyValue(
                                    company.studentsRequired,
                                    '0'
                                  )}
                                </p>

                              </div>

                            </div>

                          </div>

                          <div className="rounded-xl border border-[#ECE6D9] bg-[#FCFBF7] p-3">

                            <div className="flex items-center gap-2">

                              <UserRound
                                size={13}
                                className="shrink-0 text-[#A65D20]"
                              />

                              <div className="min-w-0">

                                <p className="text-[7px] font-black uppercase tracking-wider text-[#A09689]">
                                  HR Contact
                                </p>

                                <p className="mt-0.5 truncate text-[9px] font-black text-[#4D4131]">
                                  {getCompanyValue(
                                    company.hrContact
                                  )}
                                </p>

                              </div>

                            </div>

                          </div>

                        </div>

                        <div className="rounded-xl border border-[#E5DDBF] bg-[#FDFBD4] p-3">

                          <div className="flex items-start gap-2">

                            <BriefcaseBusiness
                              size={13}
                              className="mt-0.5 shrink-0 text-[#69591F]"
                            />

                            <div className="min-w-0">

                              <p className="text-[7px] font-black uppercase tracking-wider text-[#9A8B62]">
                                Recruitment Stage
                              </p>

                              <p className="mt-1 text-[9px] font-bold leading-4 text-[#4D4131]">
                                {getCompanyValue(
                                  company.recruitmentStage,
                                  'Stage not specified'
                                )}
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* FOOTER */}
                    <div className="border-t border-[#EEE8D9] bg-[#FCFBF7] px-5 py-3.5">

                      <div className="flex items-center justify-between gap-3">

                        <div className="flex min-w-0 items-center gap-2">

                          <CalendarDays
                            size={12}
                            className="shrink-0 text-[#958A7D]"
                          />

                          <div className="min-w-0">

                            <p className="text-[7px] font-black uppercase tracking-wider text-[#A09689]">
                              Last Interaction
                            </p>

                            <p className="truncate text-[8px] font-black text-[#5D5041]">
                              {getCompanyValue(
                                company.lastInteraction
                              )}
                            </p>

                          </div>

                        </div>

                        {company.website ? (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#D8CFBD] bg-white px-2.5 py-2 text-[8px] font-black text-[#5D5041] transition hover:border-[#D4AF37] hover:bg-[#FDFBD4]"
                          >
                            Website
                            <ExternalLink size={11} />
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[8px] font-bold text-[#A09689]">
                            <ChevronRight size={11} />
                            Directory
                          </span>
                        )}

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

          )}

        </section>

      </div>

      <AddCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

    </main>
  );
};

export default Companies;