import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

import {
  Users,
  Building2,
  CalendarDays,
  Clock3,
  AlertTriangle,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Plus,
  CalendarClock,
  BriefcaseBusiness,
  Activity,
  Phone,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

/* =========================================================
   PLACE SYNC DASHBOARD
   ========================================================= */

const COLORS = {
  dark: '#3A2A16',
  gold: '#D4AF37',
  olive: '#BDB76B',
  cream: '#FDFBD4',
  orange: '#CE8946',
  white: '#FFFFFF',
  muted: '#756B5F',
  danger: '#B94A48',
  dangerBg: '#FCEAEA',
  success: '#3E7D55',
  successBg: '#EAF6EE',
  blue: '#4D6F91',
  blueBg: '#EAF2F8'
};

/* =========================================================
   DATE HELPERS
   ========================================================= */

const getTodayString = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const normalizeDate = (value) => {
  if (!value) return '';

  const valueString = String(value);

  if (valueString.includes('T')) {
    return valueString.split('T')[0];
  }

  return valueString.slice(0, 10);
};

const formatDate = (value) => {
  if (!value) return 'No date';

  const normalized = normalizeDate(value);

  const date = new Date(`${normalized}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatShortDate = (value) => {
  if (!value) return '';

  const normalized = normalizeDate(value);

  const date = new Date(`${normalized}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short'
  });
};

const formatTime = (value) => {
  if (!value) return '';

  const parts = String(value).split(':');

  if (parts.length < 2) {
    return value;
  }

  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return value;
  }

  const date = new Date();

  date.setHours(hour);
  date.setMinutes(minute);

  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit'
  });
};

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good Morning';
  }

  if (hour < 17) {
    return 'Good Afternoon';
  }

  return 'Good Evening';
};

/* =========================================================
   SAFE DATA HELPERS
   ========================================================= */

const getHRName = (item) => {
  return (
    item?.hrName ||
    item?.name ||
    'HR Contact'
  );
};

const getCompanyName = (item) => {
  return (
    item?.companyName ||
    item?.company_name ||
    item?.company ||
    'Company'
  );
};

const getFollowUpDate = (item) => {
  return (
    item?.date ||
    item?.followUpDate ||
    item?.nextFollowUpDate ||
    item?.next_follow_up_date ||
    ''
  );
};

const getFollowUpTime = (item) => {
  return (
    item?.time ||
    item?.followUpTime ||
    item?.nextFollowUpTime ||
    item?.next_follow_up_time ||
    ''
  );
};

const getFollowUpStatus = (item) => {
  return String(
    item?.status || 'Pending'
  ).toLowerCase();
};

const isPending = (item) => {
  const status = getFollowUpStatus(item);

  return (
    status === 'pending' ||
    status === 'scheduled' ||
    status === 'upcoming' ||
    status === 'due'
  );
};

const getDaysOverdue = (dateValue) => {
  const today = new Date(
    `${getTodayString()}T00:00:00`
  );

  const date = new Date(
    `${normalizeDate(dateValue)}T00:00:00`
  );

  const difference = Math.floor(
    (today.getTime() - date.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return Math.max(1, difference);
};

/* =========================================================
   STAT CARD
   ========================================================= */

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBackground,
  iconColor,
  description,
  onClick
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        w-full
        text-left
        outline-none
      "
    >
      <div
        className="
          h-full
          rounded-[24px]
          border
          border-[#E7E0CF]
          bg-white
          p-4
          shadow-[0_8px_28px_rgba(58,42,22,0.06)]
          transition-all
          duration-200
          hover:-translate-y-1
          hover:shadow-[0_14px_34px_rgba(58,42,22,0.11)]
          active:scale-[0.99]
        "
      >
        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <p
              className="
                truncate
                text-[12px]
                font-bold
                text-[#756B5F]
              "
            >
              {title}
            </p>

            <p
              className="
                mt-3
                text-[30px]
                font-black
                tracking-tight
              "
              style={{
                color: COLORS.dark
              }}
            >
              {value}
            </p>

            <p
              className="
                mt-1
                truncate
                text-[10px]
                font-medium
                text-[#968C7F]
              "
            >
              {description}
            </p>

          </div>

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
            "
            style={{
              backgroundColor: iconBackground,
              color: iconColor
            }}
          >
            <Icon
              size={21}
              strokeWidth={2}
            />
          </div>

        </div>

        <div
          className="
            mt-3
            flex
            items-center
            gap-1
            text-[10px]
            font-bold
            opacity-0
            transition-opacity
            group-hover:opacity-100
          "
          style={{
            color: COLORS.gold
          }}
        >
          View details

          <ChevronRight size={12} />
        </div>

      </div>
    </button>
  );
};

/* =========================================================
   FOLLOW-UP ITEM
   ========================================================= */

const FollowUpItem = ({
  followUp,
  overdue = false,
  onClick
}) => {
  const hrName = getHRName(followUp);
  const companyName = getCompanyName(followUp);
  const date = getFollowUpDate(followUp);
  const time = getFollowUpTime(followUp);

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        text-left
        outline-none
      "
    >
      <div
        className="
          rounded-2xl
          border
          bg-white
          p-4
          transition-all
          hover:-translate-y-[1px]
          hover:shadow-md
        "
        style={{
          borderColor: overdue
            ? '#F0CCCC'
            : '#E8E1D0'
        }}
      >

        <div className="flex items-start gap-3">

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-sm
              font-black
            "
            style={{
              backgroundColor: overdue
                ? COLORS.dangerBg
                : COLORS.cream,
              color: overdue
                ? COLORS.danger
                : COLORS.dark
            }}
          >
            {hrName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">

            <div
              className="
                flex
                items-start
                justify-between
                gap-2
              "
            >

              <div className="min-w-0">

                <p
                  className="
                    truncate
                    text-sm
                    font-extrabold
                  "
                  style={{
                    color: COLORS.dark
                  }}
                >
                  {hrName}
                </p>

                <p
                  className="
                    mt-0.5
                    truncate
                    text-xs
                    font-semibold
                    text-[#7D7468]
                  "
                >
                  {companyName}
                </p>

              </div>

              <span
                className="
                  shrink-0
                  rounded-full
                  px-2.5
                  py-1
                  text-[9px]
                  font-extrabold
                "
                style={{
                  backgroundColor: overdue
                    ? COLORS.dangerBg
                    : COLORS.successBg,
                  color: overdue
                    ? COLORS.danger
                    : COLORS.success
                }}
              >
                {overdue
                  ? 'OVERDUE'
                  : 'TODAY'}
              </span>

            </div>

            <div
              className="
                mt-3
                flex
                flex-wrap
                items-center
                gap-x-4
                gap-y-2
              "
            >

              <span
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[11px]
                  font-semibold
                  text-[#766D62]
                "
              >
                <CalendarDays size={13} />

                {formatDate(date)}
              </span>

              {time && (
                <span
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-[11px]
                    font-semibold
                    text-[#766D62]
                  "
                >
                  <Clock3 size={13} />

                  {formatTime(time)}
                </span>
              )}

            </div>

          </div>

          <ChevronRight
            size={17}
            className="
              mt-3
              shrink-0
              text-[#B6AD9F]
            "
          />

        </div>

      </div>
    </button>
  );
};

/* =========================================================
   QUICK ACTION
   ========================================================= */

const QuickAction = ({
  icon: Icon,
  title,
  description,
  onClick
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        w-full
        items-center
        gap-3
        rounded-2xl
        border
        border-[#E7E0CF]
        bg-white
        p-3.5
        text-left
        transition-all
        hover:-translate-y-0.5
        hover:border-[#D4AF37]
        hover:shadow-md
      "
    >

      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
        "
        style={{
          backgroundColor: COLORS.cream,
          color: COLORS.dark
        }}
      >
        <Icon size={19} />
      </div>

      <div className="min-w-0 flex-1">

        <p
          className="
            text-sm
            font-extrabold
          "
          style={{
            color: COLORS.dark
          }}
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            truncate
            text-[10px]
            font-medium
            text-[#857B6F]
          "
        >
          {description}
        </p>

      </div>

      <ArrowRight
        size={15}
        className="
          shrink-0
          text-[#B9AF9E]
          transition-transform
          group-hover:translate-x-1
        "
      />

    </button>
  );
};

/* =========================================================
   DASHBOARD
   ========================================================= */

export const Dashboard = () => {

  const navigate = useNavigate();

  const {
    user,
    hrs = [],
    companies = [],
    interactions = [],
    followUps = [],
    loading,
    setIsQuickAddOpen
  } = useApp();

  /* =======================================================
     DATE
     ======================================================= */

  const today = getTodayString();

  const displayToday =
    new Date().toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    );

  /* =======================================================
     USER
     ======================================================= */

  const userName =
    user?.name?.trim() ||
    'Placement Officer';

  /* =======================================================
     FOLLOW-UP DATA
     ======================================================= */

  const pendingFollowUps = useMemo(() => {

    return followUps.filter(
      isPending
    );

  }, [followUps]);

  const todayFollowUps = useMemo(() => {

    return pendingFollowUps.filter(
      (item) => {

        return (
          normalizeDate(
            getFollowUpDate(item)
          ) === today
        );

      }
    );

  }, [
    pendingFollowUps,
    today
  ]);

  const overdueFollowUps = useMemo(() => {

    return pendingFollowUps.filter(
      (item) => {

        const date =
          normalizeDate(
            getFollowUpDate(item)
          );

        return (
          date &&
          date < today
        );

      }
    );

  }, [
    pendingFollowUps,
    today
  ]);

  const upcomingFollowUps = useMemo(() => {

    return pendingFollowUps.filter(
      (item) => {

        const date =
          normalizeDate(
            getFollowUpDate(item)
          );

        return (
          date &&
          date > today
        );

      }
    );

  }, [
    pendingFollowUps,
    today
  ]);

  /* =======================================================
     PENDING RESPONSES
     ======================================================= */

  const waitingForResponse =
    useMemo(() => {

      return hrs.filter((hr) => {

        const status =
          String(
            hr?.status || ''
          ).toLowerCase();

        return (
          status.includes('waiting') ||
          status.includes('response')
        );

      }).length;

    }, [hrs]);

  /* =======================================================
     COMPLETED ACTIVITIES
     ======================================================= */

  const completedActivities =
    useMemo(() => {

      return followUps.filter(
        (item) => {

          const status =
            String(
              item?.status || ''
            ).toLowerCase();

          return status === 'completed';

        }
      ).length;

    }, [followUps]);

  /* =======================================================
     RECENT INTERACTIONS
     ======================================================= */

  const recentInteractions =
    useMemo(() => {

      return [
        ...interactions
      ]
        .sort((a, b) => {

          const dateA =
            a?.date ||
            a?.interactionDate ||
            a?.createdAt ||
            '';

          const dateB =
            b?.date ||
            b?.interactionDate ||
            b?.createdAt ||
            '';

          return (
            new Date(dateB).getTime() -
            new Date(dateA).getTime()
          );

        })
        .slice(0, 5);

    }, [interactions]);

  /* =======================================================
     QUICK ADD
     ======================================================= */

  const openQuickAdd = () => {

    if (
      typeof setIsQuickAddOpen ===
      'function'
    ) {
      setIsQuickAddOpen(true);
    } else {
      navigate('/hr');
    }

  };

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading && !user) {

    return (
      <div
        className="
          flex
          min-h-[70vh]
          items-center
          justify-center
        "
        style={{
          backgroundColor:
            COLORS.cream
        }}
      >

        <div className="text-center">

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
            "
            style={{
              backgroundColor:
                COLORS.dark,
              color:
                COLORS.gold
            }}
          >
            <RefreshCw
              size={24}
              className="
                animate-spin
              "
            />
          </div>

          <p
            className="
              mt-4
              text-sm
              font-bold
            "
            style={{
              color:
                COLORS.dark
            }}
          >
            Loading PlaceSync...
          </p>

        </div>

      </div>
    );
  }

  /* =======================================================
     MAIN UI
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
        lg:pb-10
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
            WELCOME
            ================================================= */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[30px]
            border
            border-[#D7B943]
            bg-white
            p-6
            shadow-[0_12px_36px_rgba(58,42,22,0.07)]
            sm:p-8
          "
        >

          <div
            className="
              relative
              z-10
              max-w-3xl
            "
          >

            <div
              className="
                mb-3
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#FDFBD4]
                px-3
                py-1.5
              "
            >

              <span
                className="
                  h-2
                  w-2
                  rounded-full
                "
                style={{
                  backgroundColor:
                    COLORS.gold
                }}
              />

              <span
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                "
                style={{
                  color:
                    COLORS.dark
                }}
              >
                Today's Overview
              </span>

            </div>

            <h2
              className="
                text-2xl
                font-black
                leading-tight
                tracking-tight
                sm:text-4xl
              "
              style={{
                color:
                  COLORS.dark
              }}
            >
              {getGreeting()}, {userName} 👋
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-sm
                font-medium
                leading-6
                text-[#746A5D]
                sm:text-base
              "
            >
              Stay on top of every HR
              conversation, follow-up,
              and placement opportunity.
            </p>

            <div
              className="
                mt-3
                flex
                items-center
                gap-2
                text-xs
                font-bold
                text-[#8A7D6B]
              "
            >

              <CalendarDays size={15} />

              <span>
                {displayToday}
              </span>

            </div>

            <div
              className="
                mt-6
                flex
                flex-wrap
                gap-3
              "
            >

              <button
                type="button"
                onClick={openQuickAdd}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-2xl
                  px-5
                  py-3
                  text-sm
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

                <Plus size={19} />

                Add HR / Interaction

              </button>

              <button
                type="button"
                onClick={() =>
                  navigate('/follow-ups')
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-[#E5DDCA]
                  bg-[#FAF8F1]
                  px-5
                  py-3
                  text-sm
                  font-black
                  transition
                  hover:bg-[#F3EFD9]
                "
                style={{
                  color:
                    COLORS.dark
                }}
              >

                <CalendarClock
                  size={18}
                />

                View Follow-Ups

              </button>

            </div>

          </div>

          {/* Decorative circles */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-24
              hidden
              h-72
              w-72
              rounded-full
              opacity-20
              sm:block
            "
            style={{
              backgroundColor:
                COLORS.gold
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-28
              -right-10
              hidden
              h-56
              w-56
              rounded-full
              border-[35px]
              opacity-10
              sm:block
            "
            style={{
              borderColor:
                COLORS.orange
            }}
          />

        </section>

        {/* =================================================
            PLACEMENT NETWORK
            ================================================= */}

        <section className="mt-8">

          <div
            className="
              mb-4
              flex
              items-end
              justify-between
              gap-3
            "
          >

            <div>

              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.16em]
                "
                style={{
                  color:
                    COLORS.gold
                }}
              >
                At a glance
              </p>

              <h3
                className="
                  mt-1
                  text-xl
                  font-black
                "
                style={{
                  color:
                    COLORS.dark
                }}
              >
                Your placement network
              </h3>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate('/hr')
              }
              className="
                hidden
                items-center
                gap-1
                text-xs
                font-extrabold
                sm:flex
              "
              style={{
                color:
                  COLORS.dark
              }}
            >
              View HR

              <ArrowRight
                size={14}
              />

            </button>

          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-3
              md:grid-cols-4
            "
          >

            <StatCard
              title="Today's Follow-Ups"
              value={
                todayFollowUps.length
              }
              icon={Clock3}
              iconBackground={
                COLORS.cream
              }
              iconColor={
                COLORS.dark
              }
              description="Due today"
              onClick={() =>
                navigate(
                  '/follow-ups'
                )
              }
            />

            <StatCard
              title="Upcoming"
              value={
                upcomingFollowUps.length
              }
              icon={CalendarDays}
              iconBackground={
                COLORS.blueBg
              }
              iconColor={
                COLORS.blue
              }
              description="Future follow-ups"
              onClick={() =>
                navigate(
                  '/follow-ups'
                )
              }
            />

            <StatCard
              title="Missed Follow-Ups"
              value={
                overdueFollowUps.length
              }
              icon={AlertTriangle}
              iconBackground={
                COLORS.dangerBg
              }
              iconColor={
                COLORS.danger
              }
              description="Needs attention"
              onClick={() =>
                navigate(
                  '/follow-ups'
                )
              }
            />

            <StatCard
              title="Total HR Contacts"
              value={hrs.length}
              icon={Users}
              iconBackground="#F4EBDD"
              iconColor={
                COLORS.orange
              }
              description="Your HR network"
              onClick={() =>
                navigate('/hr')
              }
            />

            <StatCard
              title="Active Companies"
              value={
                companies.length
              }
              icon={Building2}
              iconBackground="#F0EFD8"
              iconColor="#777343"
              description="Company network"
              onClick={() =>
                navigate('/companies')
              }
            />

            <StatCard
              title="Pending Responses"
              value={
                waitingForResponse
              }
              icon={MessageSquare}
              iconBackground="#EEEFFC"
              iconColor="#5C6195"
              description="Waiting for HR"
              onClick={() =>
                navigate('/hr')
              }
            />

            <StatCard
              title="Completed Activities"
              value={
                completedActivities
              }
              icon={CheckCircle2}
              iconBackground={
                COLORS.successBg
              }
              iconColor={
                COLORS.success
              }
              description="Completed follow-ups"
              onClick={() =>
                navigate(
                  '/follow-ups'
                )
              }
            />

            <StatCard
              title="Recent Interactions"
              value={
                interactions.length
              }
              icon={Activity}
              iconBackground="#FCECEF"
              iconColor="#98506A"
              description="Recorded interactions"
              onClick={() =>
                navigate('/hr')
              }
            />

          </div>

        </section>

        {/* =================================================
            ACTION CENTER + QUICK ACTIONS
            ================================================= */}

        <section
          className="
            mt-8
            grid
            gap-5
            lg:grid-cols-[1.5fr_1fr]
          "
        >

          {/* ACTION CENTER */}

          <div
            className="
              rounded-[26px]
              border
              border-[#E5DDCA]
              bg-white
              p-5
              shadow-[0_8px_28px_rgba(58,42,22,0.05)]
              sm:p-6
            "
          >

            <div
              className="
                mb-5
                flex
                items-start
                justify-between
                gap-3
              "
            >

              <div>

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
                    <Clock3
                      size={18}
                    />
                  </div>

                  <h3
                    className="
                      text-lg
                      font-black
                    "
                    style={{
                      color:
                        COLORS.dark
                    }}
                  >
                    Today's Action Center
                  </h3>

                </div>

                <p
                  className="
                    mt-1
                    text-xs
                    font-medium
                    text-[#82786C]
                  "
                >
                  Follow-ups that need
                  your attention today.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/follow-ups'
                  )
                }
                className="
                  flex
                  shrink-0
                  items-center
                  gap-1
                  text-xs
                  font-black
                "
                style={{
                  color:
                    COLORS.dark
                }}
              >
                All

                <ArrowRight
                  size={14}
                />

              </button>

            </div>

            {todayFollowUps.length ===
            0 ? (

              <div
                className="
                  rounded-2xl
                  border
                  border-dashed
                  p-7
                  text-center
                "
                style={{
                  borderColor:
                    '#DDD5C3',
                  backgroundColor:
                    '#FCFBF6'
                }}
              >

                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                  "
                  style={{
                    backgroundColor:
                      COLORS.successBg,
                    color:
                      COLORS.success
                  }}
                >
                  <CheckCircle2
                    size={23}
                  />
                </div>

                <h4
                  className="
                    mt-3
                    text-sm
                    font-black
                  "
                  style={{
                    color:
                      COLORS.dark
                  }}
                >
                  No follow-ups today
                </h4>

                <p
                  className="
                    mt-1
                    text-xs
                    font-medium
                    text-[#8A8073]
                  "
                >
                  Your schedule is clear.
                  Great work!
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/follow-ups'
                    )
                  }
                  className="
                    mt-4
                    text-xs
                    font-black
                    underline
                    underline-offset-4
                  "
                  style={{
                    color:
                      COLORS.gold
                  }}
                >
                  View upcoming
                </button>

              </div>

            ) : (

              <div
                className="
                  space-y-3
                "
              >

                {todayFollowUps
                  .slice(0, 4)
                  .map(
                    (followUp) => (
                      <FollowUpItem
                        key={
                          followUp.id ||
                          `${getHRName(
                            followUp
                          )}-${getFollowUpDate(
                            followUp
                          )}`
                        }
                        followUp={
                          followUp
                        }
                        onClick={() =>
                          navigate(
                            '/follow-ups'
                          )
                        }
                      />
                    )
                  )}

              </div>

            )}

          </div>

          {/* QUICK ACTIONS */}

          <div
            className="
              rounded-[26px]
              border
              border-[#E5DDCA]
              bg-white
              p-5
              shadow-[0_8px_28px_rgba(58,42,22,0.05)]
              sm:p-6
            "
          >

            <div className="mb-5">

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
                  <BriefcaseBusiness
                    size={18}
                  />
                </div>

                <h3
                  className="
                    text-lg
                    font-black
                  "
                  style={{
                    color:
                      COLORS.dark
                  }}
                >
                  Quick Actions
                </h3>

              </div>

              <p
                className="
                  mt-1
                  text-xs
                  font-medium
                  text-[#82786C]
                "
              >
                Common placement
                activities.
              </p>

            </div>

            <div className="space-y-3">

              <QuickAction
                icon={Users}
                title="Add HR Contact"
                description="Build your HR network"
                onClick={
                  openQuickAdd
                }
              />

              <QuickAction
                icon={Phone}
                title="Record Interaction"
                description="Save an HR conversation"
                onClick={() =>
                  navigate('/hr')
                }
              />

              <QuickAction
                icon={CalendarClock}
                title="Schedule Follow-Up"
                description="Never miss a commitment"
                onClick={() =>
                  navigate(
                    '/follow-ups'
                  )
                }
              />

              <QuickAction
                icon={Building2}
                title="View Companies"
                description="Explore your company network"
                onClick={() =>
                  navigate(
                    '/companies'
                  )
                }
              />

            </div>

          </div>

        </section>

        {/* =================================================
            NEEDS ATTENTION
            ================================================= */}

        {overdueFollowUps.length >
          0 && (

          <section className="mt-5">

            <div
              className="
                rounded-[26px]
                border
                p-5
                shadow-[0_8px_28px_rgba(58,42,22,0.04)]
                sm:p-6
              "
              style={{
                backgroundColor:
                  '#FFF9F7',
                borderColor:
                  '#F0CCCC'
              }}
            >

              <div
                className="
                  mb-5
                  flex
                  items-start
                  justify-between
                  gap-3
                "
              >

                <div>

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
                          COLORS.dangerBg,
                        color:
                          COLORS.danger
                      }}
                    >
                      <AlertTriangle
                        size={18}
                      />
                    </div>

                    <h3
                      className="
                        text-lg
                        font-black
                      "
                      style={{
                        color:
                          COLORS.dark
                      }}
                    >
                      Needs Attention
                    </h3>

                  </div>

                  <p
                    className="
                      mt-1
                      text-xs
                      font-medium
                      text-[#8D756D]
                    "
                  >
                    These follow-ups have
                    passed their scheduled
                    date.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/follow-ups'
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-1
                    text-xs
                    font-black
                  "
                  style={{
                    color:
                      COLORS.danger
                  }}
                >
                  View all

                  <ArrowRight
                    size={14}
                  />

                </button>

              </div>

              <div
                className="
                  grid
                  gap-3
                  md:grid-cols-2
                "
              >

                {overdueFollowUps
                  .slice(0, 4)
                  .map(
                    (followUp) => {

                      const name =
                        getHRName(
                          followUp
                        );

                      const company =
                        getCompanyName(
                          followUp
                        );

                      const overdueDays =
                        getDaysOverdue(
                          getFollowUpDate(
                            followUp
                          )
                        );

                      return (
                        <div
                          key={
                            followUp.id ||
                            `${name}-${getFollowUpDate(
                              followUp
                            )}`
                          }
                          className="
                            rounded-2xl
                            border
                            border-[#F0D9D5]
                            bg-white
                            p-4
                          "
                        >

                          <div
                            className="
                              flex
                              items-start
                              gap-3
                            "
                          >

                            <div
                              className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                text-sm
                                font-black
                              "
                              style={{
                                backgroundColor:
                                  COLORS.dangerBg,
                                color:
                                  COLORS.danger
                              }}
                            >
                              {name
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div
                              className="
                                min-w-0
                                flex-1
                              "
                            >

                              <p
                                className="
                                  truncate
                                  text-sm
                                  font-black
                                "
                                style={{
                                  color:
                                    COLORS.dark
                                }}
                              >
                                {name}
                              </p>

                              <p
                                className="
                                  truncate
                                  text-xs
                                  font-semibold
                                  text-[#806F68]
                                "
                              >
                                {company}
                              </p>

                              <div
                                className="
                                  mt-2
                                  flex
                                  flex-wrap
                                  items-center
                                  gap-2
                                "
                              >

                                <span
                                  className="
                                    rounded-full
                                    px-2
                                    py-1
                                    text-[10px]
                                    font-black
                                  "
                                  style={{
                                    backgroundColor:
                                      COLORS.dangerBg,
                                    color:
                                      COLORS.danger
                                  }}
                                >
                                  {overdueDays}{' '}
                                  {overdueDays ===
                                  1
                                    ? 'day'
                                    : 'days'}{' '}
                                  overdue
                                </span>

                                <span
                                  className="
                                    text-[10px]
                                    font-semibold
                                    text-[#8B8177]
                                  "
                                >
                                  {formatShortDate(
                                    getFollowUpDate(
                                      followUp
                                    )
                                  )}
                                </span>

                              </div>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  '/follow-ups'
                                )
                              }
                              className="
                                shrink-0
                                rounded-xl
                                px-3
                                py-2
                                text-[10px]
                                font-black
                              "
                              style={{
                                backgroundColor:
                                  COLORS.dark,
                                color:
                                  COLORS.cream
                              }}
                            >
                              Follow Up
                            </button>

                          </div>

                        </div>
                      );
                    }
                  )}

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            RECENT INTERACTIONS + UPCOMING
            ================================================= */}

        <section
          className="
            mt-5
            grid
            gap-5
            lg:grid-cols-[1.4fr_1fr]
          "
        >

          {/* RECENT INTERACTIONS */}

          <div
            className="
              rounded-[26px]
              border
              border-[#E5DDCA]
              bg-white
              p-5
              shadow-[0_8px_28px_rgba(58,42,22,0.05)]
              sm:p-6
            "
          >

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                  "
                  style={{
                    color:
                      COLORS.gold
                  }}
                >
                  Communication history
                </p>

                <h3
                  className="
                    mt-1
                    text-lg
                    font-black
                  "
                  style={{
                    color:
                      COLORS.dark
                  }}
                >
                  Recent Interactions
                </h3>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate('/hr')
                }
                className="
                  flex
                  items-center
                  gap-1
                  text-xs
                  font-black
                "
                style={{
                  color:
                    COLORS.dark
                }}
              >
                View HR

                <ArrowRight
                  size={14}
                />

              </button>

            </div>

            {recentInteractions.length ===
            0 ? (

              <div
                className="
                  rounded-2xl
                  border
                  border-dashed
                  p-7
                  text-center
                "
                style={{
                  borderColor:
                    '#DDD5C3',
                  backgroundColor:
                    '#FCFBF6'
                }}
              >

                <div
                  className="
                    mx-auto
                    flex
                    h-12
                    w-12
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
                  <MessageSquare
                    size={21}
                  />
                </div>

                <h4
                  className="
                    mt-3
                    text-sm
                    font-black
                  "
                  style={{
                    color:
                      COLORS.dark
                  }}
                >
                  No interactions recorded yet
                </h4>

                <p
                  className="
                    mt-1
                    text-xs
                    font-medium
                    text-[#8A8073]
                  "
                >
                  Start recording your
                  HR conversations.
                </p>

              </div>

            ) : (

              <div className="space-y-2">

                {recentInteractions.map(
                  (
                    interaction,
                    index
                  ) => {

                    const name =
                      interaction?.hrName ||
                      interaction?.name ||
                      'HR Contact';

                    const company =
                      interaction?.companyName ||
                      interaction?.company ||
                      'Company';

                    const date =
                      interaction?.date ||
                      interaction?.interactionDate ||
                      interaction?.createdAt;

                    const type =
                      interaction?.type ||
                      interaction?.interactionType ||
                      'Interaction';

                    return (
                      <button
                        type="button"
                        key={
                          interaction?.id ||
                          `${name}-${index}`
                        }
                        onClick={() =>
                          navigate(
                            '/hr'
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-2xl
                          border
                          border-[#EEE8D9]
                          p-3
                          text-left
                          transition
                          hover:bg-[#FCFBF5]
                        "
                      >

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            text-xs
                            font-black
                          "
                          style={{
                            backgroundColor:
                              COLORS.cream,
                            color:
                              COLORS.dark
                          }}
                        >
                          {name
                            .charAt(
                              0
                            )
                            .toUpperCase()}
                        </div>

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <p
                            className="
                              truncate
                              text-sm
                              font-extrabold
                            "
                            style={{
                              color:
                                COLORS.dark
                            }}
                          >
                            {name}
                          </p>

                          <p
                            className="
                              truncate
                              text-[11px]
                              font-semibold
                              text-[#81776B]
                            "
                          >
                            {company}
                            {' · '}
                            {type}
                          </p>

                        </div>

                        <div
                          className="
                            hidden
                            text-right
                            sm:block
                          "
                        >

                          <p
                            className="
                              text-[10px]
                              font-bold
                              text-[#8A8073]
                            "
                          >
                            {formatShortDate(
                              date
                            )}
                          </p>

                        </div>

                        <ChevronRight
                          size={15}
                          className="
                            shrink-0
                            text-[#B7AE9F]
                          "
                        />

                      </button>
                    );
                  }
                )}

              </div>
            )}

          </div>

          {/* UPCOMING */}

          <div
            className="
              rounded-[26px]
              border
              border-[#E5DDCA]
              bg-white
              p-5
              shadow-[0_8px_28px_rgba(58,42,22,0.05)]
              sm:p-6
            "
          >

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                  "
                  style={{
                    color:
                      COLORS.gold
                  }}
                >
                  Next actions
                </p>

                <h3
                  className="
                    mt-1
                    text-lg
                    font-black
                  "
                  style={{
                    color:
                      COLORS.dark
                  }}
                >
                  Upcoming Follow-Ups
                </h3>

              </div>

              <CalendarDays
                size={20}
                style={{
                  color:
                    COLORS.gold
                }}
              />

            </div>

            {upcomingFollowUps.length ===
            0 ? (

              <div
                className="
                  rounded-2xl
                  border
                  border-dashed
                  p-7
                  text-center
                "
                style={{
                  borderColor:
                    '#DDD5C3',
                  backgroundColor:
                    '#FCFBF6'
                }}
              >

                <CalendarDays
                  size={24}
                  className="
                    mx-auto
                    text-[#B7AD9E]
                  "
                />

                <p
                  className="
                    mt-3
                    text-sm
                    font-black
                  "
                  style={{
                    color:
                      COLORS.dark
                  }}
                >
                  No upcoming follow-ups
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/follow-ups'
                    )
                  }
                  className="
                    mt-2
                    text-xs
                    font-black
                    underline
                  "
                  style={{
                    color:
                      COLORS.gold
                  }}
                >
                  Schedule one
                </button>

              </div>

            ) : (

              <div className="space-y-3">

                {upcomingFollowUps
                  .slice(0, 4)
                  .map(
                    (followUp) => (

                      <button
                        type="button"
                        key={
                          followUp.id ||
                          `${getHRName(
                            followUp
                          )}-${getFollowUpDate(
                            followUp
                          )}`
                        }
                        onClick={() =>
                          navigate(
                            '/follow-ups'
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-2xl
                          border
                          border-[#EEE8D9]
                          p-3
                          text-left
                          transition
                          hover:bg-[#FCFBF5]
                        "
                      >

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                          "
                          style={{
                            backgroundColor:
                              COLORS.blueBg,
                            color:
                              COLORS.blue
                          }}
                        >
                          <CalendarDays
                            size={16}
                          />
                        </div>

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <p
                            className="
                              truncate
                              text-sm
                              font-extrabold
                            "
                            style={{
                              color:
                                COLORS.dark
                            }}
                          >
                            {getHRName(
                              followUp
                            )}
                          </p>

                          <p
                            className="
                              truncate
                              text-[11px]
                              font-semibold
                              text-[#81776B]
                            "
                          >
                            {getCompanyName(
                              followUp
                            )}
                          </p>

                        </div>

                        <div
                          className="
                            shrink-0
                            text-right
                          "
                        >

                          <p
                            className="
                              text-[11px]
                              font-black
                            "
                            style={{
                              color:
                                COLORS.dark
                            }}
                          >
                            {formatShortDate(
                              getFollowUpDate(
                                followUp
                              )
                            )}
                          </p>

                          {getFollowUpTime(
                            followUp
                          ) && (
                            <p
                              className="
                                mt-0.5
                                text-[10px]
                                font-semibold
                                text-[#8C8275]
                              "
                            >
                              {formatTime(
                                getFollowUpTime(
                                  followUp
                                )
                              )}
                            </p>
                          )}

                        </div>

                      </button>

                    )
                  )}

              </div>

            )}

          </div>

        </section>

      </div>

    </main>
  );
};