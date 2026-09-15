import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useApp } from '../context/AppContext';

import {
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  CalendarDays,
  ArrowRight,
  UserRound,
  Download,
  Trash2,
  Pencil,
  Building2,
  MapPin,
  Users,
  X,
  BriefcaseBusiness
} from 'lucide-react';

import { AddHRModal } from '../components/modals/AddHRModal';
import { EmailComposerModal } from '../components/modals/EmailComposerModal';

import { exportToCSV } from '../utils/exportUtils';
import { hrService } from '../services/hrService';


/* =========================================================
   PLACE SYNC - HR CONTACTS
   ========================================================= */

const COLORS = {
  dark: '#3A2A16',
  gold: '#D4AF37',
  olive: '#BDB76B',
  cream: '#FDFBD4',
  orange: '#CE8946',
  muted: '#756B5F',
  white: '#FFFFFF'
};


/* =========================================================
   HELPERS
   ========================================================= */

const getHRInitial = (name) => {
  const trimmedName = (name || '').trim();

  if (!trimmedName) {
    return '?';
  }

  return trimmedName.charAt(0).toUpperCase();
};


const getStatusStyle = (status) => {
  const normalized = String(
    status || 'Active'
  ).toLowerCase();

  if (
    normalized.includes('waiting') ||
    normalized.includes('response')
  ) {
    return {
      background: '#FFF4E8',
      color: '#A65D20',
      border: '#E8C49F'
    };
  }

  if (
    normalized.includes('inactive')
  ) {
    return {
      background: '#F2F1EE',
      color: '#746E65',
      border: '#D8D3CA'
    };
  }

  return {
    background: '#EAF5EC',
    color: '#3E7650',
    border: '#BFD9C6'
  };
};


const formatDate = (value) => {
  if (!value) {
    return 'Not scheduled';
  }

  const normalized = String(value).includes('T')
    ? String(value).split('T')[0]
    : String(value).slice(0, 10);

  const date = new Date(
    `${normalized}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
  );
};


/* =========================================================
   HR CONTACT CARD
   ========================================================= */

const HRContactCard = ({
  hr,
  onOpen,
  onEdit,
  onDelete,
  onEmail,
  deleting
}) => {

  const statusStyle =
    getStatusStyle(hr.status);

  const studentsRequired =
    hr.companyInfo?.studentsRequired ??
    hr.studentsRequired ??
    null;

  const location =
    hr.companyInfo?.location ??
    hr.location ??
    '';

  return (
    <article
      onClick={onOpen}
      className="
        group
        relative
        cursor-pointer
        overflow-hidden
        rounded-[26px]
        border
        border-[#E7E0CF]
        bg-white
        p-5
        shadow-[0_7px_25px_rgba(58,42,22,0.05)]
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-[#D4AF37]
        hover:shadow-[0_14px_32px_rgba(58,42,22,0.10)]
      "
    >

      {/* TOP ACCENT */}

      <div
        className="
          absolute
          left-0
          top-0
          h-1
          w-full
        "
        style={{
          backgroundColor: COLORS.gold
        }}
      />

      {/* HEADER */}

      <div className="flex items-start justify-between gap-3">

        <div className="flex min-w-0 items-center gap-3">

          {/* AVATAR */}

          <div
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border-2
              text-xl
              font-black
            "
            style={{
              backgroundColor: COLORS.dark,
              color: COLORS.cream,
              borderColor: COLORS.gold
            }}
          >
            {getHRInitial(hr.name)}
          </div>


          {/* NAME */}

          <div className="min-w-0">

            <h3
              className="
                truncate
                text-[15px]
                font-black
              "
              style={{
                color: COLORS.dark
              }}
            >
              {hr.name || 'Unknown HR'}
            </h3>

            <p
              className="
                mt-1
                truncate
                text-xs
                font-bold
                text-[#766D61]
              "
            >
              {hr.designation ||
                'HR Contact'}
            </p>

            <div
              className="
                mt-1
                flex
                items-center
                gap-1
                truncate
                text-[11px]
                font-semibold
                text-[#92887B]
              "
            >
              <Building2 size={11} />

              <span className="truncate">
                {hr.companyName ||
                  'No company'}
              </span>
            </div>

          </div>

        </div>


        {/* STATUS */}

        <span
          className="
            shrink-0
            rounded-full
            border
            px-2.5
            py-1
            text-[9px]
            font-black
          "
          style={{
            backgroundColor:
              statusStyle.background,
            color:
              statusStyle.color,
            borderColor:
              statusStyle.border
          }}
        >
          {hr.status || 'Active'}
        </span>

      </div>


      {/* CONTACT DETAILS */}

      <div
        className="
          mt-5
          rounded-2xl
          border
          border-[#EEE8D9]
          bg-[#FCFBF6]
          p-3
        "
      >

        {/* PHONE */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <div
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-lg
            "
            style={{
              backgroundColor:
                COLORS.cream,
              color:
                COLORS.dark
            }}
          >
            <Phone size={13} />
          </div>

          <span
            className="
              truncate
              text-[11px]
              font-bold
              text-[#665D52]
            "
          >
            {hr.phone ||
              'No phone number'}
          </span>

        </div>


        {/* EMAIL */}

        <div
          className="
            mt-2
            flex
            min-w-0
            items-center
            gap-2
          "
        >

          <div
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-lg
            "
            style={{
              backgroundColor:
                COLORS.cream,
              color:
                COLORS.dark
            }}
          >
            <Mail size={13} />
          </div>

          <span
            className="
              min-w-0
              flex-1
              truncate
              text-[11px]
              font-bold
              text-[#665D52]
            "
          >
            {hr.email ||
              'No email'}
          </span>

          {hr.email && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEmail();
              }}
              className="
                shrink-0
                rounded-lg
                border
                border-[#DED5C2]
                bg-white
                px-2
                py-1
                text-[9px]
                font-black
                text-[#4D4131]
                transition
                hover:bg-[#FDFBD4]
              "
            >
              Email
            </button>
          )}

        </div>

      </div>


      {/* EXTRA INFORMATION */}

      <div
        className="
          mt-4
          grid
          grid-cols-2
          gap-2
        "
      >

        <div
          className="
            rounded-xl
            border
            border-[#EEE8D9]
            bg-white
            p-2.5
          "
        >

          <p
            className="
              text-[8px]
              font-black
              uppercase
              tracking-[0.12em]
              text-[#9A9083]
            "
          >
            Follow-Up
          </p>

          <div
            className="
              mt-1.5
              flex
              items-center
              gap-1.5
            "
          >

            <CalendarDays
              size={13}
              style={{
                color: COLORS.gold
              }}
            />

            <span
              className="
                truncate
                text-[10px]
                font-black
                text-[#4B3E2E]
              "
            >
              {formatDate(
                hr.nextFollowUpDate
              )}
            </span>

          </div>

        </div>


        <div
          className="
            rounded-xl
            border
            border-[#EEE8D9]
            bg-white
            p-2.5
          "
        >

          <p
            className="
              text-[8px]
              font-black
              uppercase
              tracking-[0.12em]
              text-[#9A9083]
            "
          >
            Students
          </p>

          <div
            className="
              mt-1.5
              flex
              items-center
              gap-1.5
            "
          >

            <Users
              size={13}
              style={{
                color: COLORS.orange
              }}
            />

            <span
              className="
                text-[10px]
                font-black
                text-[#4B3E2E]
              "
            >
              {studentsRequired ??
                '—'}
            </span>

          </div>

        </div>

      </div>


      {/* LOCATION */}

      {location && (
        <div
          className="
            mt-3
            flex
            items-center
            gap-1.5
            text-[10px]
            font-semibold
            text-[#81776B]
          "
        >

          <MapPin
            size={12}
            style={{
              color: COLORS.orange
            }}
          />

          <span className="truncate">
            {location}
          </span>

        </div>
      )}


      {/* FOOTER */}

      <div
        className="
          mt-5
          flex
          items-center
          justify-between
          border-t
          border-[#EEE8D9]
          pt-4
        "
      >

        <div className="flex items-center gap-1.5">

          {/* EDIT */}

          <button
            type="button"
            title="Edit HR Contact"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-[#DDD3BE]
              bg-[#FDFBD4]
              text-[#4D4131]
              transition
              hover:bg-[#EDE7B8]
            "
          >
            <Pencil size={15} />
          </button>


          {/* DELETE */}

          <button
            type="button"
            title="Delete HR Contact"
            disabled={deleting}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-[#EBCACA]
              bg-[#FFF3F3]
              text-[#B94A48]
              transition
              hover:bg-[#FCE3E3]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {deleting ? (
              <span className="text-[9px] font-black">
                ...
              </span>
            ) : (
              <Trash2 size={15} />
            )}
          </button>

        </div>


        {/* PROFILE */}

        <div
          className="
            flex
            items-center
            gap-1
            text-[10px]
            font-black
          "
          style={{
            color: COLORS.dark
          }}
        >
          View Profile

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-xl
              transition-transform
              group-hover:translate-x-1
            "
            style={{
              backgroundColor:
                COLORS.gold
            }}
          >
            <ArrowRight size={14} />
          </div>

        </div>

      </div>

    </article>
  );
};


/* =========================================================
   MAIN PAGE
   ========================================================= */

export const HRContacts = () => {

  const {
    hrs = [],
    setHrs,
    showToast
  } = useApp();

  const navigate = useNavigate();


  /* =======================================================
     STATE
     ======================================================= */

  const [searchTerm, setSearchTerm] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('All');

  const [isAddHRModalOpen, setIsAddHRModalOpen] =
    useState(false);

  const [editingHR, setEditingHR] =
    useState(null);

  const [emailTargetHR, setEmailTargetHR] =
    useState(null);

  const [deletingHRId, setDeletingHRId] =
    useState(null);


  /* =======================================================
     FILTER
     ======================================================= */

  const filteredHRs = useMemo(() => {

    const search =
      searchTerm.trim().toLowerCase();

    return hrs.filter((hr) => {

      const matchesSearch =
        !search ||

        (hr.name || '')
          .toLowerCase()
          .includes(search) ||

        (hr.companyName || '')
          .toLowerCase()
          .includes(search) ||

        (hr.designation || '')
          .toLowerCase()
          .includes(search) ||

        (hr.phone || '')
          .toLowerCase()
          .includes(search) ||

        (hr.email || '')
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === 'All' ||
        hr.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  }, [
    hrs,
    searchTerm,
    statusFilter
  ]);


  /* =======================================================
     COUNTS
     ======================================================= */

  const activeCount =
    hrs.filter(
      (hr) =>
        hr.status === 'Active'
    ).length;

  const waitingCount =
    hrs.filter((hr) => {

      const status =
        String(
          hr.status || ''
        ).toLowerCase();

      return (
        status.includes('waiting') ||
        status.includes('response')
      );

    }).length;


  /* =======================================================
     ADD
     ======================================================= */

  const handleOpenAddHR = () => {

    setEditingHR(null);
    setIsAddHRModalOpen(true);

  };


  /* =======================================================
     EDIT
     ======================================================= */

  const handleEditHR = (
    hr
  ) => {

    setEditingHR(hr);
    setIsAddHRModalOpen(true);

  };


  /* =======================================================
     CLOSE MODAL
     ======================================================= */

  const handleCloseHRModal = () => {

    setIsAddHRModalOpen(false);
    setEditingHR(null);

  };


  /* =======================================================
     EXPORT
     ======================================================= */

  const handleExportCSV = () => {

    const exportData =
      filteredHRs.map((h) => ({

        'HR Name':
          h.name || '',

        Company:
          h.companyName || '',

        Designation:
          h.designation || '',

        Phone:
          h.phone || '',

        Email:
          h.email || '',

        Status:
          h.status || '',

        'Last Contact':
          h.lastContactDate || '',

        'Next Follow-Up':
          h.nextFollowUpDate || '',

        'Students Required':
          h.companyInfo?.studentsRequired ??
          h.studentsRequired ??
          0,

        Location:
          h.companyInfo?.location ??
          h.location ??
          ''

      }));


    exportToCSV(
      exportData,
      'placesync_hr_contacts_directory.csv'
    );


    showToast(
      '✓ PlaceSync HR Contacts directory exported to CSV!'
    );

  };


  /* =======================================================
     DELETE
     ======================================================= */

  const handleDeleteHR = async (
    hr
  ) => {

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


  /* =======================================================
     CLEAR SEARCH
     ======================================================= */

  const clearSearch = () => {

    setSearchTerm('');

  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (

    <main
      className="
        min-h-full
        w-full
        px-4
        pb-24
        pt-5
        sm:px-6
        sm:pt-7
        lg:px-8
        lg:pb-12
      "
      style={{
        backgroundColor:
          COLORS.cream
      }}
    >

      <div
        className="
          mx-auto
          w-full
          max-w-7xl
        "
      >

        {/* =================================================
            HEADER
            ================================================= */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-[#D7B943]
            bg-white
            p-5
            shadow-[0_10px_32px_rgba(58,42,22,0.06)]
            sm:p-7
          "
        >

          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-[#FDFBD4]
                  px-3
                  py-1.5
                "
              >

                <Users
                  size={13}
                  style={{
                    color:
                      COLORS.dark
                  }}
                />

                <span
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.14em]
                  "
                  style={{
                    color:
                      COLORS.dark
                  }}
                >
                  Placement Network
                </span>

              </div>


              <h1
                className="
                  mt-3
                  text-2xl
                  font-black
                  tracking-tight
                  sm:text-3xl
                "
                style={{
                  color:
                    COLORS.dark
                }}
              >
                HR Contacts
              </h1>


              <p
                className="
                  mt-1
                  max-w-xl
                  text-xs
                  font-medium
                  leading-5
                  text-[#786E62]
                  sm:text-sm
                "
              >
                Manage recruiters, build
                professional relationships,
                and never lose track of an
                important HR connection.
              </p>

            </div>


            {/* ACTIONS */}

            <div
              className="
                flex
                w-full
                flex-col
                gap-2
                sm:w-auto
                sm:flex-row
              "
            >

              <button
                type="button"
                onClick={handleExportCSV}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border
                  border-[#DDD3BE]
                  bg-[#FAF8F1]
                  px-4
                  py-3
                  text-xs
                  font-black
                  text-[#4D4131]
                  transition
                  hover:bg-[#F3EFD9]
                "
              >

                <Download size={16} />

                Export CSV

              </button>


              <button
                type="button"
                onClick={handleOpenAddHR}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  px-5
                  py-3
                  text-xs
                  font-black
                  shadow-md
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-lg
                  active:scale-[0.98]
                "
                style={{
                  backgroundColor:
                    COLORS.gold,
                  color:
                    COLORS.dark
                }}
              >

                <Plus size={17} />

                Add HR Contact

              </button>

            </div>

          </div>


          {/* DECORATION */}

          <div
            className="
              pointer-events-none
              absolute
              -right-16
              -top-20
              hidden
              h-52
              w-52
              rounded-full
              opacity-15
              sm:block
            "
            style={{
              backgroundColor:
                COLORS.gold
            }}
          />

        </section>


        {/* =================================================
            SUMMARY
            ================================================= */}

        <section
          className="
            mt-5
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
          "
        >

          <div
            className="
              rounded-2xl
              border
              border-[#E7E0CF]
              bg-white
              p-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                "
                style={{
                  backgroundColor:
                    COLORS.cream,
                  color:
                    COLORS.dark
                }}
              >
                <Users size={17} />
              </div>

              <div>

                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-wider
                    text-[#958A7D]
                  "
                >
                  Total
                </p>

                <p
                  className="
                    text-xl
                    font-black
                  "
                  style={{
                    color:
                      COLORS.dark
                  }}
                >
                  {hrs.length}
                </p>

              </div>

            </div>

          </div>


          <div
            className="
              rounded-2xl
              border
              border-[#E7E0CF]
              bg-white
              p-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#EAF5EC]
                  text-[#3E7650]
                "
              >
                <BriefcaseBusiness
                  size={17}
                />
              </div>

              <div>

                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-wider
                    text-[#958A7D]
                  "
                >
                  Active
                </p>

                <p
                  className="
                    text-xl
                    font-black
                  "
                  style={{
                    color:
                      COLORS.dark
                  }}
                >
                  {activeCount}
                </p>

              </div>

            </div>

          </div>


          <div
            className="
              col-span-2
              rounded-2xl
              border
              border-[#E7E0CF]
              bg-white
              p-4
              sm:col-span-1
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#FFF4E8]
                  text-[#A65D20]
                "
              >
                <Phone size={17} />
              </div>

              <div>

                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-wider
                    text-[#958A7D]
                  "
                >
                  Waiting
                </p>

                <p
                  className="
                    text-xl
                    font-black
                  "
                  style={{
                    color:
                      COLORS.dark
                  }}
                >
                  {waitingCount}
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            SEARCH / FILTER
            ================================================= */}

        <section
          className="
            mt-5
            rounded-[24px]
            border
            border-[#E7E0CF]
            bg-white
            p-4
            shadow-[0_6px_22px_rgba(58,42,22,0.04)]
          "
        >

          <div
            className="
              flex
              flex-col
              gap-3
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >

            {/* SEARCH */}

            <div
              className="
                relative
                w-full
                lg:max-w-xl
              "
            >

              <Search
                size={17}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[#92887B]
                "
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                placeholder="Search HR name, company, designation, phone or email..."
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#DDD5C4]
                  bg-[#FCFBF6]
                  py-3
                  pl-11
                  pr-10
                  text-xs
                  font-semibold
                  text-[#3A2A16]
                  outline-none
                  transition
                  placeholder:text-[#A39A8E]
                  focus:border-[#D4AF37]
                  focus:ring-2
                  focus:ring-[#D4AF37]/20
                "
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="
                    absolute
                    right-3
                    top-1/2
                    flex
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    p-1
                    text-[#82786C]
                    hover:bg-[#F0ECE1]
                  "
                >
                  <X size={14} />
                </button>
              )}

            </div>


            {/* FILTERS */}

            <div
              className="
                flex
                items-center
                gap-2
                overflow-x-auto
                pb-1
              "
            >

              <Filter
                size={15}
                className="
                  shrink-0
                  text-[#81776B]
                "
              />

              {[
                'All',
                'Active',
                'Waiting for Response'
              ].map((status) => {

                const selected =
                  statusFilter ===
                  status;

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setStatusFilter(
                        status
                      )
                    }
                    className="
                      shrink-0
                      rounded-xl
                      border
                      px-3
                      py-2
                      text-[10px]
                      font-black
                      transition
                    "
                    style={{
                      backgroundColor:
                        selected
                          ? COLORS.gold
                          : '#FAF8F1',
                      color:
                        selected
                          ? COLORS.dark
                          : '#756B5F',
                      borderColor:
                        selected
                          ? COLORS.gold
                          : '#DDD5C4'
                    }}
                  >
                    {status}
                  </button>
                );

              })}

            </div>

          </div>


          {/* RESULT COUNT */}

          <div
            className="
              mt-3
              flex
              items-center
              justify-between
              border-t
              border-[#EEE8D9]
              pt-3
            "
          >

            <p
              className="
                text-[10px]
                font-bold
                text-[#8C8275]
              "
            >
              Showing{' '}
              <span
                className="
                  font-black
                  text-[#3A2A16]
                "
              >
                {filteredHRs.length}
              </span>{' '}
              of{' '}
              <span
                className="
                  font-black
                  text-[#3A2A16]
                "
              >
                {hrs.length}
              </span>{' '}
              HR contacts
            </p>

            {searchTerm && (
              <p
                className="
                  text-[10px]
                  font-semibold
                  text-[#9A9083]
                "
              >
                Search: "{searchTerm}"
              </p>
            )}

          </div>

        </section>


        {/* =================================================
            EMPTY STATE
            ================================================= */}

        {filteredHRs.length === 0 ? (

          <section
            className="
              mt-5
              rounded-[28px]
              border
              border-dashed
              border-[#D7CDB9]
              bg-white
              p-10
              text-center
            "
          >

            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
              "
              style={{
                backgroundColor:
                  COLORS.cream,
                color:
                  COLORS.dark
              }}
            >
              <UserRound size={28} />
            </div>

            <h3
              className="
                mt-4
                text-lg
                font-black
              "
              style={{
                color:
                  COLORS.dark
              }}
            >
              {searchTerm ||
              statusFilter !== 'All'
                ? 'No matching HR contacts'
                : 'No HR contacts yet'}
            </h3>

            <p
              className="
                mx-auto
                mt-1
                max-w-md
                text-xs
                font-medium
                leading-5
                text-[#82786C]
              "
            >
              {searchTerm ||
              statusFilter !== 'All'
                ? 'Try changing your search or filter.'
                : 'Start building your placement network by adding your first HR contact.'}
            </p>

            {searchTerm ||
            statusFilter !== 'All' ? (

              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                }}
                className="
                  mt-5
                  rounded-xl
                  border
                  border-[#DDD3BE]
                  bg-[#FAF8F1]
                  px-4
                  py-2.5
                  text-xs
                  font-black
                  text-[#4D4131]
                "
              >
                Clear Filters
              </button>

            ) : (

              <button
                type="button"
                onClick={handleOpenAddHR}
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  px-5
                  py-3
                  text-xs
                  font-black
                  shadow
                "
                style={{
                  backgroundColor:
                    COLORS.gold,
                  color:
                    COLORS.dark
                }}
              >
                <Plus size={15} />
                Add HR Contact
              </button>

            )}

          </section>

        ) : (

          /* =================================================
             HR GRID
             ================================================= */

          <section
            className="
              mt-5
              grid
              grid-cols-1
              gap-4
              md:grid-cols-2
              xl:grid-cols-3
            "
          >

            {filteredHRs.map((hr) => (

              <HRContactCard
                key={hr.id}
                hr={hr}
                deleting={
                  deletingHRId === hr.id
                }
                onOpen={() =>
                  navigate(
                    `/hr/${hr.id}`
                  )
                }
                onEdit={() =>
                  handleEditHR(hr)
                }
                onEmail={() =>
                  setEmailTargetHR(hr)
                }
                onDelete={() =>
                  handleDeleteHR(hr)
                }
              />

            ))}

          </section>

        )}


        {/* =================================================
            ADD / EDIT MODAL
            ================================================= */}

        <AddHRModal
          isOpen={
            isAddHRModalOpen
          }
          onClose={
            handleCloseHRModal
          }
          editHR={editingHR}
        />


        {/* =================================================
            EMAIL MODAL
            ================================================= */}

        <EmailComposerModal
          isOpen={
            Boolean(emailTargetHR)
          }
          onClose={() =>
            setEmailTargetHR(null)
          }
          hr={emailTargetHR}
        />

      </div>

    </main>

  );
};