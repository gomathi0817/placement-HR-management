import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useApp } from '../context/AppContext';

import {
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  User,
  Download,
  Trash2,
  Pencil
} from 'lucide-react';

import { AddHRModal } from '../components/modals/AddHRModal';
import { EmailComposerModal } from '../components/modals/EmailComposerModal';

import { exportToCSV } from '../utils/exportUtils';
import { hrService } from '../services/hrService';


export const HRContacts = () => {

  const {
    hrs,
    setHrs,
    showToast
  } = useApp();

  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [searchTerm, setSearchTerm] = useState('');

  const [statusFilter, setStatusFilter] = useState('All');

  const [isAddHRModalOpen, setIsAddHRModalOpen] =
    useState(false);

  const [editingHR, setEditingHR] =
    useState(null);

  const [emailTargetHR, setEmailTargetHR] =
    useState(null);

  const [deletingHRId, setDeletingHRId] =
    useState(null);


  // =========================================================
  // FILTER HR CONTACTS
  // =========================================================

  const filteredHRs = hrs.filter((hr) => {

    const searchText =
      searchTerm.toLowerCase();

    const matchesSearch =
      (hr.name || '')
        .toLowerCase()
        .includes(searchText) ||

      (hr.companyName || '')
        .toLowerCase()
        .includes(searchText) ||

      (hr.designation || '')
        .toLowerCase()
        .includes(searchText) ||

      (hr.phone || '')
        .includes(searchText) ||

      (hr.email || '')
        .toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === 'All' ||
      hr.status === statusFilter;

    return (
      matchesSearch &&
      matchesStatus
    );
  });


  // =========================================================
  // ADD HR
  // =========================================================

  const handleOpenAddHR = () => {

    setEditingHR(null);

    setIsAddHRModalOpen(true);

  };


  // =========================================================
  // EDIT HR
  // =========================================================

  const handleEditHR = (e, hr) => {

    e.stopPropagation();

    setEditingHR(hr);

    setIsAddHRModalOpen(true);

  };


  // =========================================================
  // CLOSE ADD / EDIT MODAL
  // =========================================================

  const handleCloseHRModal = () => {

    setIsAddHRModalOpen(false);

    setEditingHR(null);

  };


  // =========================================================
  // EXPORT CSV
  // =========================================================

  const handleExportCSV = () => {

    const exportData =
      filteredHRs.map((h) => ({

        "HR Name":
          h.name,

        "Company":
          h.companyName,

        "Designation":
          h.designation,

        "Phone":
          h.phone,

        "Email":
          h.email,

        "Status":
          h.status,

        "Last Contact":
          h.lastContactDate || '',

        "Next Follow-Up":
          h.nextFollowUpDate || '',

        "Students Required":
          h.companyInfo?.studentsRequired ??
          h.studentsRequired ??
          0,

        "Location":
          h.companyInfo?.location ??
          h.location ??
          ''

      }));

    exportToCSV(
      exportData,
      'gv_hr_contacts_directory.csv'
    );

    showToast(
      '✓ HR Contacts directory exported to CSV!'
    );

  };


  // =========================================================
  // DELETE HR CONTACT
  // =========================================================

  const handleDeleteHR = async (
    e,
    hr
  ) => {

    e.stopPropagation();

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${hr.name}" from HR Contacts?`
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeletingHRId(hr.id);

      await hrService.delete(
        hr.id
      );

      setHrs(
        (previousHRs) =>
          previousHRs.filter(
            (item) =>
              item.id !== hr.id
          )
      );

      showToast(
        `✓ ${hr.name} has been deleted successfully.`
      );

    } catch (error) {

      console.error(
        'Delete HR error:',
        error
      );

      showToast(
        error?.message ||
        'Unable to delete HR contact.',
        'error'
      );

    } finally {

      setDeletingHRId(null);

    }

  };


  // =========================================================
  // GET HR INITIAL
  // =========================================================

  const getHRInitial = (name) => {

    const trimmedName =
      (name || '').trim();

    if (!trimmedName) {
      return '?';
    }

    return trimmedName
      .charAt(0)
      .toUpperCase();

  };


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-primary rounded-3xl p-6 shadow-card-custom">

        <div>

          <h1 className="text-xl sm:text-2xl font-black text-darkText">
            HR Contacts Directory
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-darkText/70 mt-1">
            Manage placement recruiters, contacts, and relationship statuses.
          </p>

        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">

          {/* EXPORT */}

          <button
            onClick={handleExportCSV}
            className="px-4 py-3 bg-cream hover:bg-olive/30 text-darkText border border-olive font-bold text-xs rounded-2xl shadow-xs flex items-center gap-1.5 transition-colors"
          >

            <Download className="w-4 h-4" />

            <span className="hidden sm:inline">
              Export CSV
            </span>

          </button>


          {/* ADD */}

          <button
            onClick={handleOpenAddHR}
            className="px-5 py-3 bg-primary hover:bg-accent text-darkText font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all"
          >

            <Plus className="w-4 h-4" />

            <span>
              + Add HR Contact
            </span>

          </button>

        </div>

      </div>


      {/* =====================================================
          SEARCH + FILTER
      ====================================================== */}

      <div className="bg-white border-2 border-olive/50 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">

        {/* SEARCH */}

        <div className="relative w-full sm:w-96">

          <Search className="w-4 h-4 text-darkText/60 absolute left-3.5 top-3.5" />

          <input
            type="text"
            placeholder="Search HR, company or designation..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 bg-cream border border-olive/50 rounded-xl focus:ring-2 focus:ring-primary outline-none text-darkText"
          />

        </div>


        {/* FILTER */}

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">

          <Filter className="w-4 h-4 text-darkText/60 flex-shrink-0" />

          {[
            'All',
            'Active',
            'Waiting for Response'
          ].map((st) => (

            <button
              key={st}
              onClick={() =>
                setStatusFilter(st)
              }
              className={`
                px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border
                ${
                  statusFilter === st
                    ? 'bg-primary text-darkText border-primary shadow-xs'
                    : 'bg-cream text-darkText/70 border-olive/40 hover:bg-olive/30'
                }
              `}
            >

              {st}

            </button>

          ))}

        </div>

      </div>


      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {filteredHRs.length === 0 ? (

        <div className="bg-white border-2 border-dashed border-olive/60 rounded-3xl p-12 text-center my-6 space-y-3">

          <User className="w-12 h-12 text-primary mx-auto" />

          <h3 className="text-base font-bold text-darkText">
            No HR Contacts Found
          </h3>

          <p className="text-xs text-darkText/70">
            Start building your professional recruitment network by adding your first HR lead.
          </p>

          <button
            onClick={handleOpenAddHR}
            className="px-5 py-2.5 bg-primary hover:bg-accent text-darkText font-bold text-xs rounded-xl shadow inline-flex items-center gap-1.5 transition-colors"
          >

            <Plus className="w-4 h-4" />

            <span>
              Add HR Contact
            </span>

          </button>

        </div>

      ) : (

        /* ===================================================
           HR CARDS
        ==================================================== */

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {filteredHRs.map((hr) => (

            <div
              key={hr.id}
              onClick={() =>
                navigate(`/hr/${hr.id}`)
              }
              className="bg-white hover:bg-cream border-2 border-olive/50 hover:border-primary rounded-3xl p-5 cursor-pointer transition-all shadow-xs hover:shadow-md group flex flex-col justify-between space-y-4"
            >

              {/* =================================================
                  CARD TOP
              ================================================== */}

              <div>

                <div className="flex items-start justify-between gap-3 mb-3">

                  {/* HR INFO */}

                  <div className="flex items-center gap-3 min-w-0">

                    {/* =================================================
                        HR INITIAL PROFILE
                    ================================================== */}

                    <div
                      className="
                        w-12 h-12
                        rounded-2xl
                        flex-shrink-0
                        flex items-center justify-center
                        bg-primary
                        text-darkText
                        border-2 border-olive
                        font-black
                        text-lg
                        uppercase
                      "
                      aria-label={`Profile of ${hr.name || 'Unknown HR'}`}
                    >
                      {getHRInitial(hr.name)}
                    </div>


                    <div className="min-w-0">

                      <h3 className="font-extrabold text-base text-darkText group-hover:text-accent leading-tight truncate transition-colors">
                        {hr.name || 'Unknown HR'}
                      </h3>

                      <p className="text-xs font-bold text-darkText/70 truncate">
                        {hr.companyName || 'No company'}
                      </p>

                      <span className="text-[11px] text-darkText/70 block font-medium truncate">
                        {hr.designation || 'HR Contact'}
                      </span>

                    </div>

                  </div>


                  {/* =================================================
                      STATUS + ACTION BUTTONS
                  ================================================== */}

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">

                    {/* STATUS */}

                    <span
                      className={`
                        text-[10px] font-extrabold px-2.5 py-1 rounded-full border whitespace-nowrap
                        ${
                          hr.status === 'Active'
                            ? 'bg-olive/30 text-darkText border-olive'
                            : 'bg-accent/20 text-darkText border-accent'
                        }
                      `}
                    >

                      {hr.status || 'Active'}

                    </span>


                    {/* ACTION BUTTONS */}

                    <div className="flex items-center gap-1.5">

                      {/* EDIT */}

                      <button
                        type="button"
                        title="Edit HR Contact"
                        onClick={(e) =>
                          handleEditHR(e, hr)
                        }
                        className="
                          w-9 h-9
                          rounded-xl
                          flex items-center justify-center
                          bg-olive/20
                          text-darkText
                          border border-olive/40
                          hover:bg-olive/40
                          transition-all
                        "
                      >

                        <Pencil className="w-4 h-4" />

                      </button>


                      {/* DELETE */}

                      <button
                        type="button"
                        title="Delete HR Contact"
                        disabled={
                          deletingHRId === hr.id
                        }
                        onClick={(e) =>
                          handleDeleteHR(
                            e,
                            hr
                          )
                        }
                        className="
                          w-9 h-9
                          rounded-xl
                          flex items-center justify-center
                          bg-red-50
                          text-red-600
                          border border-red-200
                          hover:bg-red-100
                          hover:border-red-300
                          transition-all
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                        "
                      >

                        {deletingHRId === hr.id ? (

                          <span className="text-[10px] font-bold">
                            ...
                          </span>

                        ) : (

                          <Trash2 className="w-4 h-4" />

                        )}

                      </button>

                    </div>

                  </div>

                </div>


                {/* =================================================
                    CONTACT DETAILS
                ================================================== */}

                <div className="space-y-1.5 text-xs text-darkText bg-cream p-3 rounded-2xl border border-olive/40">

                  {/* PHONE */}

                  <div className="flex items-center gap-2">

                    <Phone className="w-3.5 h-3.5 text-primary" />

                    <span className="font-semibold">
                      {hr.phone || 'No phone number'}
                    </span>

                  </div>


                  {/* EMAIL */}

                  <div className="flex items-center justify-between gap-2">

                    <div className="flex items-center gap-2 truncate">

                      <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />

                      <span className="font-semibold truncate">
                        {hr.email || 'No email'}
                      </span>

                    </div>

                    <button
                      type="button"
                      onClick={(e) => {

                        e.stopPropagation();

                        setEmailTargetHR(hr);

                      }}
                      className="text-[10px] font-bold text-darkText hover:underline bg-white px-2 py-0.5 rounded border border-olive/50 flex-shrink-0"
                    >

                      Draft Email

                    </button>

                  </div>

                </div>

              </div>


              {/* =================================================
                  CARD FOOTER
              ================================================== */}

              <div className="pt-3 border-t border-olive/40 flex items-center justify-between text-xs">

                <div>

                  <span className="text-[10px] font-bold text-darkText/70 uppercase tracking-wider block">
                    Next Follow-Up
                  </span>

                  <span className="font-extrabold text-darkText flex items-center gap-1">

                    <Calendar className="w-3.5 h-3.5 text-primary" />

                    {hr.nextFollowUpDate ||
                      'Not scheduled'}

                  </span>

                </div>

                <div className="w-8 h-8 rounded-xl bg-primary text-darkText flex items-center justify-center group-hover:translate-x-1 transition-transform">

                  <ArrowRight className="w-4 h-4" />

                </div>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* =====================================================
          ADD / EDIT HR MODAL
      ====================================================== */}

      <AddHRModal
        isOpen={isAddHRModalOpen}
        onClose={handleCloseHRModal}
        editHR={editingHR}
      />


      {/* =====================================================
          EMAIL MODAL
      ====================================================== */}

      <EmailComposerModal
        isOpen={Boolean(emailTargetHR)}
        onClose={() =>
          setEmailTargetHR(null)
        }
        hr={emailTargetHR}
      />

    </div>

  );

};