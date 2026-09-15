import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useApp } from '../context/AppContext';

import { HRRelationshipPulse } from '../components/HRRelationshipPulse';
import { ConversationTimeline } from '../components/ConversationTimeline';

import {
  Phone,
  Mail,
  MessageCircle,
  Plus,
  Clock3,
  Building2,
  BriefcaseBusiness,
  Users,
  MapPin,
  ChevronLeft,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Target,
  IndianRupee,
  ArrowUpRight,
  Activity,
  UserRound
} from 'lucide-react';

import { AddInteractionModal } from '../components/modals/AddInteractionModal';
import { ScheduleFollowUpModal } from '../components/modals/ScheduleFollowUpModal';

import { formatNiceDate } from '../utils/dateUtils';


/* =========================================================
   PLACE SYNC COLORS
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
      backgroundColor: '#FFF4E8',
      color: '#A65D20',
      borderColor: '#E8C49F'
    };
  }

  if (
    normalized.includes('inactive')
  ) {
    return {
      backgroundColor: '#F2F1EE',
      color: '#746E65',
      borderColor: '#D8D3CA'
    };
  }

  return {
    backgroundColor: '#EAF5EC',
    color: '#3E7650',
    borderColor: '#BFD9C6'
  };
};


const safeDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};


/* =========================================================
   INFO ITEM
   ========================================================= */

const InfoItem = ({
  icon: Icon,
  label,
  value,
  iconBackground = '#FDFBD4',
  iconColor = '#3A2A16',
  valueClass = ''
}) => {

  return (
    <div
      className="
        rounded-2xl
        border
        border-[#E9E2D3]
        bg-[#FCFBF7]
        p-3.5
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
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-xl
          "
          style={{
            backgroundColor:
              iconBackground,
            color:
              iconColor
          }}
        >
          <Icon size={14} />
        </div>

        <div className="min-w-0">

          <p
            className="
              text-[8px]
              font-black
              uppercase
              tracking-[0.12em]
              text-[#9A9083]
            "
          >
            {label}
          </p>

          <p
            className={`
              mt-1
              truncate
              text-[11px]
              font-black
              text-[#4B3E2E]
              ${valueClass}
            `}
          >
            {value || 'Not available'}
          </p>

        </div>

      </div>

    </div>
  );
};


/* =========================================================
   MAIN PAGE
   ========================================================= */

export const HRProfile = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const {
    hrs = [],
    interactions = [],
    followUps = []
  } = useApp();


  /* =======================================================
     STATE
     ======================================================= */

  const [
    isAddInteractionOpen,
    setIsAddInteractionOpen
  ] = useState(false);

  const [
    isScheduleFollowUpOpen,
    setIsScheduleFollowUpOpen
  ] = useState(false);


  /* =======================================================
     FIND HR
     ======================================================= */

  const hr =
    hrs.find(
      (item) =>
        String(item.id) === String(id)
    ) || null;


  /* =======================================================
     HR DATA
     ======================================================= */

  const hrInteractions = useMemo(() => {

    if (!hr) {
      return [];
    }

    return interactions.filter(
      (interaction) =>
        String(interaction.hrId) ===
          String(hr.id) ||
        interaction.hrName === hr.name
    );

  }, [
    interactions,
    hr
  ]);


  const hrFollowUps = useMemo(() => {

    if (!hr) {
      return [];
    }

    return followUps.filter(
      (followUp) =>
        String(followUp.hrId) ===
          String(hr.id) ||
        followUp.hrName === hr.name
    );

  }, [
    followUps,
    hr
  ]);


  /* =======================================================
     FOLLOW-UP STATISTICS
     ======================================================= */

  const missedCount =
    hrFollowUps.filter(
      (followUp) =>
        followUp.status === 'MISSED' ||
        followUp.status === 'Overdue'
    ).length;


  const latestFollowUp =
    hrFollowUps[0] || null;


  const completedFollowUps =
    hrFollowUps.filter(
      (followUp) => {

        const status =
          String(
            followUp.status || ''
          ).toLowerCase();

        return (
          status.includes('completed') ||
          status.includes('done') ||
          status.includes('success')
        );

      }
    ).length;


  const upcomingFollowUps =
    hrFollowUps.filter(
      (followUp) => {

        const date =
          safeDate(
            followUp.date ||
            followUp.nextFollowUpDate
          );

        if (!date) {
          return false;
        }

        return (
          date >= new Date() &&
          ![
            'MISSED',
            'Overdue',
            'completed',
            'Completed'
          ].includes(
            followUp.status
          )
        );

      }
    ).length;


  /* =======================================================
     COMPANY INFORMATION
     ======================================================= */

  const companyInfo =
    hr.companyInfo || {};


  const studentsRequired =
    companyInfo.studentsRequired ??
    hr.studentsRequired ??
    null;


  const location =
    companyInfo.location ??
    hr.location ??
    'Not specified';


  const recruitmentType =
    companyInfo.recruitmentType ||
    'Not specified';


  const packageDetails =
    companyInfo.pkgDetails ||
    'Not specified';


  const jobRoles =
    Array.isArray(
      companyInfo.jobRoles
    )
      ? companyInfo.jobRoles
      : [];


  /* =======================================================
     STATUS
     ======================================================= */

  const statusStyle =
    getStatusStyle(
      hr.status
    );


  /* =======================================================
     NOT FOUND
     ======================================================= */

  if (!hr) {

    return (

      <main
        className="
          min-h-full
          bg-[#FDFBD4]
          px-4
          pb-24
          pt-8
          sm:px-6
          lg:px-8
        "
      >

        <div
          className="
            mx-auto
            max-w-xl
            rounded-[28px]
            border
            border-[#E1D8C5]
            bg-white
            p-10
            text-center
            shadow-[0_10px_30px_rgba(58,42,22,0.06)]
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
              bg-[#FDFBD4]
              text-[#3A2A16]
            "
          >
            <UserRound size={28} />
          </div>

          <h2
            className="
              mt-5
              text-xl
              font-black
              text-[#3A2A16]
            "
          >
            HR Contact Not Found
          </h2>

          <p
            className="
              mt-2
              text-xs
              font-medium
              text-[#81776B]
            "
          >
            The HR contact you are looking
            for could not be found.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate('/hr')
            }
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[#D4AF37]
              px-5
              py-3
              text-xs
              font-black
              text-[#3A2A16]
              shadow
            "
          >
            <ChevronLeft size={15} />
            Back to HR Contacts
          </button>

        </div>

      </main>

    );
  }


  /* =======================================================
     RENDER
     ======================================================= */

  return (

    <main
      className="
        min-h-full
        w-full
        bg-[#FDFBD4]
        px-4
        pb-24
        pt-5
        sm:px-6
        sm:pt-7
        lg:px-8
        lg:pb-12
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-7xl
        "
      >

        {/* =================================================
            BACK NAVIGATION
            ================================================= */}

        <button
          type="button"
          onClick={() =>
            navigate('/hr')
          }
          className="
            mb-4
            inline-flex
            items-center
            gap-1.5
            text-[11px]
            font-black
            text-[#786E62]
            transition
            hover:text-[#3A2A16]
          "
        >

          <ChevronLeft size={15} />

          Back to HR Contacts

        </button>


        {/* =================================================
            PROFILE HERO
            ================================================= */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[30px]
            border
            border-[#D7B943]
            bg-white
            p-5
            shadow-[0_12px_35px_rgba(58,42,22,0.07)]
            sm:p-7
          "
        >

          {/* GOLD ACCENT */}

          <div
            className="
              absolute
              left-0
              top-0
              h-1
              w-full
            "
            style={{
              backgroundColor:
                COLORS.gold
            }}
          />


          <div
            className="
              relative
              z-10
              flex
              flex-col
              gap-6
              xl:flex-row
              xl:items-center
              xl:justify-between
            "
          >

            {/* PROFILE */}

            <div
              className="
                flex
                min-w-0
                items-start
                gap-4
                sm:items-center
              "
            >

              {/* AVATAR */}

              <div
                className="
                  flex
                  h-20
                  w-20
                  shrink-0
                  items-center
                  justify-center
                  rounded-[24px]
                  border-2
                  text-3xl
                  font-black
                  shadow-sm
                "
                style={{
                  backgroundColor:
                    COLORS.dark,
                  color:
                    COLORS.cream,
                  borderColor:
                    COLORS.gold
                }}
              >
                {getHRInitial(
                  hr.name
                )}
              </div>


              {/* DETAILS */}

              <div className="min-w-0">

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >

                  <h1
                    className="
                      text-2xl
                      font-black
                      tracking-tight
                      text-[#3A2A16]
                      sm:text-3xl
                    "
                  >
                    {hr.name ||
                      'Unknown HR'}
                  </h1>

                  <span
                    className="
                      rounded-full
                      border
                      px-3
                      py-1
                      text-[9px]
                      font-black
                    "
                    style={{
                      backgroundColor:
                        statusStyle.backgroundColor,
                      color:
                        statusStyle.color,
                      borderColor:
                        statusStyle.borderColor
                    }}
                  >
                    {hr.status ||
                      'Active'}
                  </span>

                  {missedCount > 0 && (

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-[#EBCACA]
                        bg-[#FFF1F1]
                        px-3
                        py-1
                        text-[9px]
                        font-black
                        text-[#A33D3D]
                      "
                    >

                      <AlertTriangle
                        size={11}
                      />

                      {missedCount}{' '}
                      Missed

                    </span>

                  )}

                </div>


                <div
                  className="
                    mt-2
                    flex
                    flex-wrap
                    items-center
                    gap-x-3
                    gap-y-1
                    text-xs
                    font-bold
                    text-[#766D61]
                  "
                >

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                    "
                  >
                    <Building2
                      size={13}
                    />

                    {hr.companyName ||
                      'No company'}
                  </span>


                  <span
                    className="
                      hidden
                      text-[#C7BDAE]
                      sm:inline
                    "
                  >
                    •
                  </span>


                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                    "
                  >
                    <BriefcaseBusiness
                      size={13}
                    />

                    {hr.designation ||
                      'HR Contact'}
                  </span>

                </div>


                <p
                  className="
                    mt-2
                    max-w-2xl
                    text-[11px]
                    font-medium
                    leading-5
                    text-[#93897D]
                  "
                >
                  Placement relationship
                  profile and communication
                  history for this HR contact.
                </p>

              </div>

            </div>


            {/* QUICK ACTIONS */}

            <div
              className="
                grid
                grid-cols-2
                gap-2
                sm:flex
                sm:flex-wrap
                xl:justify-end
              "
            >

              {/* CALL */}

              {hr.phone && (

                <a
                  href={`tel:${hr.phone}`}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-1.5
                    rounded-xl
                    border
                    border-[#D5CFBC]
                    bg-[#FDFBD4]
                    px-4
                    py-2.5
                    text-[10px]
                    font-black
                    text-[#3A2A16]
                    transition
                    hover:bg-[#EEE8BA]
                  "
                >

                  <Phone size={14} />

                  Call

                </a>

              )}


              {/* WHATSAPP */}

              {hr.phone && (

                <a
                  href={`https://wa.me/${hr.phone.replace(
                    /[^0-9]/g,
                    ''
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-1.5
                    rounded-xl
                    border
                    border-[#BFD9C6]
                    bg-[#EAF5EC]
                    px-4
                    py-2.5
                    text-[10px]
                    font-black
                    text-[#3E7650]
                    transition
                    hover:bg-[#DCEEE0]
                  "
                >

                  <MessageCircle
                    size={14}
                  />

                  WhatsApp

                </a>

              )}


              {/* EMAIL */}

              {hr.email && (

                <a
                  href={`mailto:${hr.email}`}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-1.5
                    rounded-xl
                    border
                    border-[#E8C49F]
                    bg-[#FFF4E8]
                    px-4
                    py-2.5
                    text-[10px]
                    font-black
                    text-[#A65D20]
                    transition
                    hover:bg-[#FCEBD8]
                  "
                >

                  <Mail size={14} />

                  Email

                </a>

              )}


              {/* ADD INTERACTION */}

              <button
                type="button"
                onClick={() =>
                  setIsAddInteractionOpen(
                    true
                  )
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-1.5
                  rounded-xl
                  px-4
                  py-2.5
                  text-[10px]
                  font-black
                  shadow
                  transition
                  hover:-translate-y-0.5
                "
                style={{
                  backgroundColor:
                    COLORS.gold,
                  color:
                    COLORS.dark
                }}
              >

                <Plus size={14} />

                Add Interaction

              </button>

            </div>

          </div>


          {/* DECORATION */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-48
              w-48
              rounded-full
              opacity-20
            "
            style={{
              backgroundColor:
                COLORS.gold
            }}
          />

        </section>


        {/* =================================================
            CONTACT INFORMATION
            ================================================= */}

        <section
          className="
            mt-5
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          <InfoItem
            icon={Phone}
            label="Phone Number"
            value={
              hr.phone ||
              'Not available'
            }
          />

          <InfoItem
            icon={Mail}
            label="Email Address"
            value={
              hr.email ||
              'Not available'
            }
          />

          <InfoItem
            icon={MapPin}
            label="Job Location"
            value={location}
            iconBackground="#FFF4E8"
            iconColor="#A65D20"
          />

          <InfoItem
            icon={Activity}
            label="Interactions"
            value={`${hrInteractions.length} recorded`}
            iconBackground="#EAF5EC"
            iconColor="#3E7650"
          />

        </section>


        {/* =================================================
            FOLLOW-UP OVERVIEW
            ================================================= */}

        <section
          className="
            mt-5
            grid
            grid-cols-2
            gap-3
            lg:grid-cols-4
          "
        >

          {/* MISSED */}

          <div
            className="
              rounded-2xl
              border
              border-[#EBCACA]
              bg-[#FFF7F7]
              p-4
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-[#A78D8D]
                  "
                >
                  Missed
                </p>

                <p
                  className="
                    mt-1
                    text-2xl
                    font-black
                    text-[#A33D3D]
                  "
                >
                  {missedCount}
                </p>

              </div>

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#FFE7E7]
                  text-[#A33D3D]
                "
              >
                <AlertTriangle
                  size={18}
                />
              </div>

            </div>

          </div>


          {/* UPCOMING */}

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
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-[#958A7D]
                  "
                >
                  Upcoming
                </p>

                <p
                  className="
                    mt-1
                    text-2xl
                    font-black
                    text-[#3A2A16]
                  "
                >
                  {upcomingFollowUps}
                </p>

              </div>

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#FDFBD4]
                  text-[#3A2A16]
                "
              >
                <CalendarDays
                  size={18}
                />
              </div>

            </div>

          </div>


          {/* COMPLETED */}

          <div
            className="
              rounded-2xl
              border
              border-[#BFD9C6]
              bg-[#F7FBF8]
              p-4
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-[#819989]
                  "
                >
                  Completed
                </p>

                <p
                  className="
                    mt-1
                    text-2xl
                    font-black
                    text-[#3E7650]
                  "
                >
                  {completedFollowUps}
                </p>

              </div>

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#EAF5EC]
                  text-[#3E7650]
                "
              >
                <CheckCircle2
                  size={18}
                />
              </div>

            </div>

          </div>


          {/* TOTAL */}

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
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-[#958A7D]
                  "
                >
                  Total Follow-Ups
                </p>

                <p
                  className="
                    mt-1
                    text-2xl
                    font-black
                    text-[#3A2A16]
                  "
                >
                  {hrFollowUps.length}
                </p>

              </div>

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#FFF4E8]
                  text-[#A65D20]
                "
              >
                <Clock3
                  size={18}
                />
              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            COMPANY / RECRUITMENT DETAILS
            ================================================= */}

        <section
          className="
            mt-5
            overflow-hidden
            rounded-[28px]
            border
            border-[#E3DAC6]
            bg-white
            shadow-[0_8px_26px_rgba(58,42,22,0.04)]
          "
        >

          <div
            className="
              flex
              flex-col
              gap-3
              border-b
              border-[#EEE8D9]
              p-5
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:p-6
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#FDFBD4]
                  text-[#3A2A16]
                "
              >
                <Building2 size={19} />
              </div>

              <div>

                <h2
                  className="
                    text-sm
                    font-black
                    text-[#3A2A16]
                    sm:text-base
                  "
                >
                  Recruitment Details
                </h2>

                <p
                  className="
                    mt-0.5
                    text-[10px]
                    font-medium
                    text-[#958A7D]
                  "
                >
                  Company requirements and
                  placement opportunity details
                </p>

              </div>

            </div>


            <span
              className="
                w-fit
                rounded-full
                border
                border-[#D9D1BE]
                bg-[#FAF8F1]
                px-3
                py-1.5
                text-[9px]
                font-black
                text-[#5F5446]
              "
            >
              {companyInfo.currentStatus ||
                'Active Drive'}
            </span>

          </div>


          <div
            className="
              grid
              grid-cols-2
              gap-3
              p-5
              sm:grid-cols-4
              sm:p-6
            "
          >

            {/* RECRUITMENT TYPE */}

            <InfoItem
              icon={Target}
              label="Recruitment Type"
              value={recruitmentType}
            />


            {/* STUDENTS */}

            <InfoItem
              icon={Users}
              label="Students Required"
              value={
                studentsRequired !== null
                  ? `${studentsRequired} Candidates`
                  : 'Not specified'
              }
              iconBackground="#FFF4E8"
              iconColor="#A65D20"
            />


            {/* LOCATION */}

            <InfoItem
              icon={MapPin}
              label="Job Location"
              value={location}
              iconBackground="#EAF5EC"
              iconColor="#3E7650"
            />


            {/* PACKAGE */}

            <InfoItem
              icon={IndianRupee}
              label="Package / Stipend"
              value={packageDetails}
              iconBackground="#FDFBD4"
              iconColor="#3A2A16"
            />

          </div>


          {/* JOB ROLES */}

          {jobRoles.length > 0 && (

            <div
              className="
                border-t
                border-[#EEE8D9]
                p-5
                sm:p-6
              "
            >

              <div
                className="
                  mb-3
                  flex
                  items-center
                  gap-2
                "
              >

                <BriefcaseBusiness
                  size={15}
                  style={{
                    color:
                      COLORS.orange
                  }}
                />

                <h3
                  className="
                    text-xs
                    font-black
                    text-[#3A2A16]
                  "
                >
                  Offered Job Roles
                </h3>

              </div>


              <div
                className="
                  flex
                  flex-wrap
                  gap-2
                "
              >

                {jobRoles.map(
                  (role, index) => (

                    <span
                      key={`${role}-${index}`}
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-xl
                        border
                        border-[#E2D9C7]
                        bg-[#FCFBF7]
                        px-3
                        py-2
                        text-[10px]
                        font-black
                        text-[#554A3C]
                      "
                    >

                      <Target
                        size={11}
                        style={{
                          color:
                            COLORS.orange
                        }}
                      />

                      {role}

                    </span>

                  )
                )}

              </div>

            </div>

          )}

        </section>


        {/* =================================================
            RELATIONSHIP PULSE
            ================================================= */}

        <section className="mt-5">

          <div
            className="
              mb-3
              flex
              items-center
              gap-2
            "
          >

            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-xl
                bg-[#FDFBD4]
                text-[#3A2A16]
              "
            >
              <Activity size={15} />
            </div>

            <div>

              <h2
                className="
                  text-base
                  font-black
                  text-[#3A2A16]
                "
              >
                Relationship Pulse
              </h2>

              <p
                className="
                  text-[10px]
                  font-medium
                  text-[#958A7D]
                "
              >
                Current relationship strength
                and engagement overview
              </p>

            </div>

          </div>

          <HRRelationshipPulse
            hr={hr}
          />

        </section>


        {/* =================================================
            RELATIONSHIP HISTORY
            ================================================= */}

        <section
          className="
            mt-6
          "
        >

          <div
            className="
              mb-3
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <h2
                className="
                  text-lg
                  font-black
                  text-[#3A2A16]
                "
              >
                Relationship History
              </h2>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  font-medium
                  text-[#958A7D]
                "
              >
                Conversations and follow-up
                activity with this HR
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                setIsScheduleFollowUpOpen(
                  true
                )
              }
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-xl
                border
                border-[#D8CFBA]
                bg-white
                px-4
                py-2.5
                text-[10px]
                font-black
                text-[#4D4131]
                shadow-sm
                transition
                hover:border-[#D4AF37]
                hover:bg-[#FDFBD4]
              "
            >

              <Clock3 size={14} />

              Schedule Follow-Up

            </button>

          </div>


          <div
            className="
              overflow-hidden
              rounded-[26px]
              border
              border-[#E5DECF]
              bg-white
              p-4
              shadow-[0_7px_24px_rgba(58,42,22,0.04)]
              sm:p-5
            "
          >

            <ConversationTimeline
              interactions={
                hrInteractions
              }
              followUps={
                hrFollowUps
              }
            />

          </div>

        </section>


        {/* =================================================
            QUICK BOTTOM ACTION
            ================================================= */}

        <section
          className="
            mt-5
            rounded-[24px]
            border
            border-[#D7B943]
            bg-[#3A2A16]
            p-5
            shadow-[0_10px_28px_rgba(58,42,22,0.10)]
            sm:p-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.16em]
                  text-[#D4AF37]
                "
              >
                Keep the relationship active
              </p>

              <h3
                className="
                  mt-1
                  text-base
                  font-black
                  text-[#FDFBD4]
                "
              >
                Ready for your next HR interaction?
              </h3>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-medium
                  text-[#E7DDC9]
                "
              >
                Record the conversation or
                schedule the next follow-up.
              </p>

            </div>


            <div
              className="
                flex
                flex-wrap
                gap-2
              "
            >

              <button
                type="button"
                onClick={() =>
                  setIsAddInteractionOpen(
                    true
                  )
                }
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-xl
                  bg-[#D4AF37]
                  px-4
                  py-2.5
                  text-[10px]
                  font-black
                  text-[#3A2A16]
                  transition
                  hover:bg-[#E1C44D]
                "
              >

                <Plus size={14} />

                Add Interaction

              </button>


              <button
                type="button"
                onClick={() =>
                  setIsScheduleFollowUpOpen(
                    true
                  )
                }
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-xl
                  border
                  border-[#806D3A]
                  bg-[#4B3B23]
                  px-4
                  py-2.5
                  text-[10px]
                  font-black
                  text-[#FDFBD4]
                  transition
                  hover:bg-[#59482A]
                "
              >

                <CalendarDays
                  size={14}
                />

                Schedule

              </button>

            </div>

          </div>

        </section>


        {/* =================================================
            MODALS
            ================================================= */}

        <AddInteractionModal
          isOpen={
            isAddInteractionOpen
          }
          onClose={() =>
            setIsAddInteractionOpen(
              false
            )
          }
          defaultHrId={
            hr.id
          }
        />


        <ScheduleFollowUpModal
          isOpen={
            isScheduleFollowUpOpen
          }
          onClose={() =>
            setIsScheduleFollowUpOpen(
              false
            )
          }
          defaultHrId={
            hr.id
          }
        />

      </div>

    </main>

  );
};