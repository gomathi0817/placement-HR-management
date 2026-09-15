import React, { useMemo, useState } from 'react';
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  X,
  Phone,
  Mail,
  MessageCircle,
  Building2,
  UserRound,
  ArrowRight,
  ListChecks
} from 'lucide-react';

import { useApp } from '../context/AppContext';

const COLORS = {
  dark: '#3A2A16',
  gold: '#D4AF37',
  olive: '#BDB76B',
  cream: '#FDFBD4',
  orange: '#CE8946',
  muted: '#756B5F'
};

const formatNiceDate = (dateString) => {
  if (!dateString) return 'No date';

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getTodayDateString = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getHRInitial = (name) => {
  const trimmedName = String(name || '').trim();

  if (!trimmedName) {
    return '?';
  }

  return trimmedName.charAt(0).toUpperCase();
};

const normalizeStatus = (status) =>
  String(status || '').trim().toLowerCase();

const isCompleted = (status) => {
  const value = normalizeStatus(status);

  return value === 'completed' || value === 'complete';
};

const isMissed = (status) => {
  const value = normalizeStatus(status);

  return value === 'missed' || value === 'overdue';
};

const isUpcoming = (status) => {
  const value = normalizeStatus(status);

  return (
    value === 'upcoming' ||
    value === 'pending' ||
    value === 'follow-up due' ||
    value === 'due'
  );
};

const getStatusConfig = (status) => {
  if (isCompleted(status)) {
    return {
      label: 'Completed',
      background: '#EAF5EC',
      color: '#3E7650',
      border: '#BFD9C6'
    };
  }

  if (isMissed(status)) {
    return {
      label: 'Missed',
      background: '#FFF1F1',
      color: '#A33D3D',
      border: '#EBCACA'
    };
  }

  if (normalizeStatus(status) === 'due') {
    return {
      label: 'Follow-Up Due',
      background: '#FFF4E8',
      color: '#A65D20',
      border: '#E8C49F'
    };
  }

  return {
    label: 'Upcoming',
    background: '#FDFBD4',
    color: '#5D4D25',
    border: '#DDD29B'
  };
};

const getPriorityConfig = (priority) => {
  const value = String(priority || 'Medium').toLowerCase();

  if (value === 'high') {
    return {
      label: 'High Priority',
      background: '#FFF1F1',
      color: '#A33D3D',
      border: '#EBCACA'
    };
  }

  if (value === 'low') {
    return {
      label: 'Low Priority',
      background: '#EAF5EC',
      color: '#3E7650',
      border: '#BFD9C6'
    };
  }

  return {
    label: 'Medium Priority',
    background: '#FFF4E8',
    color: '#A65D20',
    border: '#E8C49F'
  };
};

const convertToTimeInput = (value) => {
  if (!value) {
    return '10:30';
  }

  const text = String(value).trim();

  if (!text.includes('AM') && !text.includes('PM')) {
    return text.slice(0, 5);
  }

  const parts = text.split(' ');
  const clock = parts[0];
  const period = String(parts[1] || '').toUpperCase();

  const [hours, minutes] = clock.split(':');

  let hour = Number(hours);

  if (Number.isNaN(hour)) {
    return '10:30';
  }

  if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  if (period === 'PM' && hour !== 12) {
    hour += 12;
  }

  return `${String(hour).padStart(2, '0')}:${minutes || '00'}`;
};

const formatTimeDisplay = (value) => {
  if (!value) {
    return '10:30 AM';
  }

  const text = String(value).trim();

  if (text.includes('AM') || text.includes('PM')) {
    return text;
  }

  const [hours, minutes] = text.split(':');

  let hour = Number(hours);

  if (Number.isNaN(hour)) {
    return text;
  }

  const period = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12 || 12;

  return `${hour}:${minutes || '00'} ${period}`;
};

export const FollowUps = () => {
  const {
    followUps = [],
    hrs = [],
    markFollowUpComplete,
    rescheduleFollowUp,
    loading
  } = useApp();

  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [saving, setSaving] = useState(false);

  const todayStr = getTodayDateString();

  const normalizedFollowUps = useMemo(() => {
    return (followUps || []).map((item) => {
      const hr =
        hrs.find(
          (hrItem) =>
            String(hrItem.id) === String(item.hrId)
        ) ||
        hrs.find(
          (hrItem) =>
            String(hrItem.id) === String(item.id)
        );

      return {
        ...item,

        hrId: item.hrId || item.id,

        hrName:
          item.hrName ||
          hr?.name ||
          'Unknown HR',

        companyName:
          item.companyName ||
          hr?.company_name ||
          hr?.companyName ||
          'Unknown Company',

        phone:
          item.phone ||
          hr?.phone ||
          '',

        email:
          item.email ||
          hr?.email ||
          '',

        date:
          item.date ||
          hr?.next_follow_up_date ||
          '',

        time:
          item.time ||
          hr?.next_follow_up_time ||
          '10:30 AM',

        status:
          item.status ||
          'Upcoming',

        purpose:
          item.purpose ||
          'Placement follow-up',

        priority:
          item.priority ||
          'Medium'
      };
    });
  }, [followUps, hrs]);

  const counts = useMemo(() => {
    let today = 0;
    let upcoming = 0;
    let missed = 0;
    let completed = 0;

    normalizedFollowUps.forEach((item) => {
      const status = normalizeStatus(item.status);

      if (
        item.date === todayStr &&
        !isMissed(status) &&
        !isCompleted(status)
      ) {
        today++;
      }

      if (isUpcoming(status)) {
        upcoming++;
      }

      if (isMissed(status)) {
        missed++;
      }

      if (isCompleted(status)) {
        completed++;
      }
    });

    return {
      all: normalizedFollowUps.length,
      today,
      upcoming,
      missed,
      completed
    };
  }, [normalizedFollowUps, todayStr]);

  const filteredFollowUps = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return normalizedFollowUps.filter((item) => {
      const status = normalizeStatus(item.status);

      let matchesTab = true;

      if (activeTab === 'Today') {
        matchesTab =
          item.date === todayStr &&
          !isMissed(status) &&
          !isCompleted(status);
      }

      if (activeTab === 'Upcoming') {
        matchesTab = isUpcoming(status);
      }

      if (activeTab === 'Missed') {
        matchesTab = isMissed(status);
      }

      if (activeTab === 'Completed') {
        matchesTab = isCompleted(status);
      }

      if (!matchesTab) {
        return false;
      }

      if (!search) {
        return true;
      }

      const searchableText = [
        item.hrName,
        item.companyName,
        item.phone,
        item.email,
        item.purpose,
        item.status,
        item.priority,
        item.date
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(search);
    });
  }, [
    normalizedFollowUps,
    activeTab,
    searchTerm,
    todayStr
  ]);

  const tabs = [
    {
      label: 'All',
      count: counts.all,
      icon: ListChecks
    },
    {
      label: 'Today',
      count: counts.today,
      icon: CalendarDays
    },
    {
      label: 'Upcoming',
      count: counts.upcoming,
      icon: Clock3
    },
    {
      label: 'Missed',
      count: counts.missed,
      icon: AlertTriangle
    },
    {
      label: 'Completed',
      count: counts.completed,
      icon: CheckCircle2
    }
  ];

  const openReschedule = (item) => {
    setRescheduleTarget(item);
    setNewDate(item.date || todayStr);
    setNewTime(convertToTimeInput(item.time));
  };

  const closeReschedule = () => {
    if (saving) {
      return;
    }

    setRescheduleTarget(null);
    setNewDate('');
    setNewTime('');
  };

  const handleComplete = async (item) => {
    if (!item?.id || !markFollowUpComplete) {
      return;
    }

    try {
      await markFollowUpComplete(item.id);
    } catch (error) {
      console.error(
        'Failed to complete follow-up:',
        error
      );
    }
  };

  const handleReschedule = async (event) => {
    event.preventDefault();

    if (!rescheduleTarget?.id || !newDate) {
      return;
    }

    try {
      setSaving(true);

      await rescheduleFollowUp(
        rescheduleTarget.id,
        newDate,
        newTime
      );

      closeReschedule();
    } catch (error) {
      console.error(
        'Failed to reschedule follow-up:',
        error
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-full w-full bg-[#FDFBD4] px-4 pb-24 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-12">
      <div className="mx-auto w-full max-w-7xl">

        {/* HEADER */}
        <section className="relative overflow-hidden rounded-[30px] border border-[#D7B943] bg-white p-5 shadow-[0_12px_35px_rgba(58,42,22,0.07)] sm:p-7">

          <div
            className="absolute left-0 top-0 h-1 w-full"
            style={{ backgroundColor: COLORS.gold }}
          />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#3A2A16]">
                  <CalendarDays size={20} />
                </div>

                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#A65D20]">
                  PlaceSync
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-[#3A2A16] sm:text-3xl">
                Follow-Ups
              </h1>

              <p className="mt-1 max-w-xl text-[11px] font-medium leading-5 text-[#81776B] sm:text-xs">
                Stay on top of every HR conversation and never miss an important follow-up.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#D7C993] bg-[#FDFBD4] px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3A2A16] text-[#D4AF37]">
                <ListChecks size={19} />
              </div>

              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#8D806C]">
                  Total Follow-Ups
                </p>

                <p className="mt-0.5 text-2xl font-black text-[#3A2A16]">
                  {counts.all}
                </p>
              </div>
            </div>

          </div>

          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#D4AF37] opacity-10" />

        </section>

        {/* SUMMARY */}
        <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <div className="rounded-2xl border border-[#E5DECF] bg-white p-4 shadow-[0_6px_20px_rgba(58,42,22,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.13em] text-[#958A7D]">
                  Today
                </p>

                <p className="mt-1 text-2xl font-black text-[#3A2A16]">
                  {counts.today}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#3A2A16]">
                <CalendarDays size={18} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5DECF] bg-white p-4 shadow-[0_6px_20px_rgba(58,42,22,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.13em] text-[#958A7D]">
                  Upcoming
                </p>

                <p className="mt-1 text-2xl font-black text-[#3A2A16]">
                  {counts.upcoming}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF4E8] text-[#A65D20]">
                <Clock3 size={18} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EBCACA] bg-[#FFF7F7] p-4 shadow-[0_6px_20px_rgba(58,42,22,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.13em] text-[#A78D8D]">
                  Missed
                </p>

                <p className="mt-1 text-2xl font-black text-[#A33D3D]">
                  {counts.missed}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE7E7] text-[#A33D3D]">
                <AlertTriangle size={18} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#BFD9C6] bg-[#F7FBF8] p-4 shadow-[0_6px_20px_rgba(58,42,22,0.04)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.13em] text-[#819989]">
                  Completed
                </p>

                <p className="mt-1 text-2xl font-black text-[#3E7650]">
                  {counts.completed}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF5EC] text-[#3E7650]">
                <CheckCircle2 size={18} />
              </div>
            </div>
          </div>

        </section>

        {/* SEARCH */}
        <section className="mt-5 rounded-2xl border border-[#E5DECF] bg-white p-3 shadow-[0_6px_20px_rgba(58,42,22,0.04)]">

          <div className="flex items-center gap-3 rounded-xl border border-[#E0D8C8] bg-[#FCFBF7] px-3.5 py-2.5 focus-within:border-[#D4AF37] focus-within:ring-4 focus-within:ring-[#D4AF37]/10">

            <Search size={17} className="shrink-0 text-[#9A8D7B]" />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search HR, company, phone, purpose..."
              className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-[#3A2A16] outline-none placeholder:text-[#A79A88]"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[#766B5D] transition hover:bg-[#FDFBD4]"
              >
                <X size={15} />
              </button>
            )}

          </div>

        </section>

        {/* TABS */}
        <section className="mt-4 overflow-x-auto pb-1">

          <div className="flex min-w-max gap-2">

            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.label;

              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(tab.label)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[10px] font-black transition ${
                    active
                      ? 'border-[#3A2A16] bg-[#3A2A16] text-[#FDFBD4]'
                      : 'border-[#DDD5C5] bg-white text-[#665A4B] hover:border-[#D4AF37] hover:bg-[#FDFBD4]'
                  }`}
                >
                  <Icon size={13} />

                  <span>{tab.label}</span>

                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[9px] ${
                      active
                        ? 'bg-[#D4AF37] text-[#3A2A16]'
                        : 'bg-[#F3EFE3] text-[#675A49]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}

          </div>

        </section>

        {/* RESULT HEADER */}
        <div className="mt-5 flex items-center justify-between gap-3">

          <div>
            <h2 className="text-sm font-black text-[#3A2A16] sm:text-base">
              {activeTab} Follow-Ups
            </h2>

            <p className="mt-0.5 text-[10px] font-medium text-[#958A7D]">
              Showing {filteredFollowUps.length} of {counts.all} follow-ups
            </p>
          </div>

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-[10px] font-black text-[#A65D20] hover:underline"
            >
              Clear Search
            </button>
          )}

        </div>

        {/* CONTENT */}
        <section className="mt-3">

          {loading && normalizedFollowUps.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[26px] border border-[#E5DECF] bg-white text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDFBD4] text-[#3A2A16]">
                <RefreshCw
                  size={25}
                  className="animate-spin"
                />
              </div>

              <h3 className="mt-4 text-base font-black text-[#3A2A16]">
                Loading follow-ups...
              </h3>

              <p className="mt-1 text-[10px] font-medium text-[#958A7D]">
                Please wait while your follow-ups are loaded.
              </p>

            </div>
          ) : filteredFollowUps.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[26px] border border-dashed border-[#D8CEBA] bg-white px-6 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FDFBD4] text-[#3A2A16]">
                <CalendarDays size={28} />
              </div>

              <h3 className="mt-4 text-base font-black text-[#3A2A16]">
                No follow-ups found
              </h3>

              <p className="mt-1 max-w-md text-[10px] font-medium leading-5 text-[#958A7D]">
                {searchTerm
                  ? 'No follow-ups match your current search.'
                  : activeTab === 'All'
                    ? 'You have no scheduled follow-ups yet.'
                    : `There are no ${activeTab.toLowerCase()} follow-ups.`}
              </p>

            </div>
          ) : (
            <div className="space-y-3">

              {filteredFollowUps.map((item) => {
                const status = getStatusConfig(item.status);
                const priority = getPriorityConfig(item.priority);
                const completed = isCompleted(item.status);
                const missed = isMissed(item.status);

                return (
                  <article
                    key={item.id}
                    className={`overflow-hidden rounded-[24px] border bg-white shadow-[0_7px_24px_rgba(58,42,22,0.045)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(58,42,22,0.08)] ${
                      missed
                        ? 'border-[#EBCACA]'
                        : 'border-[#E5DECF]'
                    }`}
                  >

                    {/* TOP ACCENT */}
                    <div
                      className="h-1 w-full"
                      style={{
                        backgroundColor: missed
                          ? '#C56A5B'
                          : completed
                            ? '#6A9A73'
                            : COLORS.gold
                      }}
                    />

                    <div className="p-4 sm:p-5">

                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">

                        {/* AVATAR */}
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 text-xl font-black"
                          style={{
                            backgroundColor: COLORS.dark,
                            color: COLORS.cream,
                            borderColor: COLORS.gold
                          }}
                        >
                          {getHRInitial(item.hrName)}
                        </div>

                        {/* MAIN */}
                        <div className="min-w-0 flex-1">

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                            <div className="min-w-0">

                              <div className="flex flex-wrap items-center gap-2">

                                <h3 className="text-base font-black text-[#3A2A16] sm:text-lg">
                                  {item.hrName}
                                </h3>

                                <span
                                  className="rounded-full border px-2.5 py-1 text-[8px] font-black"
                                  style={{
                                    backgroundColor: status.background,
                                    color: status.color,
                                    borderColor: status.border
                                  }}
                                >
                                  {status.label}
                                </span>

                              </div>

                              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-[#766D61]">

                                <span className="inline-flex items-center gap-1.5">
                                  <Building2 size={12} />
                                  {item.companyName}
                                </span>

                                <span className="hidden text-[#C9BEAE] sm:inline">
                                  •
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                  <UserRound size={12} />
                                  HR Contact
                                </span>

                              </div>

                            </div>

                            <span
                              className="w-fit rounded-lg border px-2.5 py-1.5 text-[8px] font-black"
                              style={{
                                backgroundColor: priority.background,
                                color: priority.color,
                                borderColor: priority.border
                              }}
                            >
                              {priority.label}
                            </span>

                          </div>

                          {/* DETAILS */}
                          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">

                            <div className="rounded-xl border border-[#ECE5D8] bg-[#FCFBF7] p-3">

                              <div className="flex items-center gap-2">

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FDFBD4] text-[#3A2A16]">
                                  <CalendarDays size={14} />
                                </div>

                                <div>
                                  <p className="text-[7px] font-black uppercase tracking-[0.12em] text-[#A09689]">
                                    Date
                                  </p>

                                  <p className="mt-0.5 text-[10px] font-black text-[#4B3E2E]">
                                    {formatNiceDate(item.date)}
                                  </p>
                                </div>

                              </div>

                            </div>

                            <div className="rounded-xl border border-[#ECE5D8] bg-[#FCFBF7] p-3">

                              <div className="flex items-center gap-2">

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF4E8] text-[#A65D20]">
                                  <Clock3 size={14} />
                                </div>

                                <div>
                                  <p className="text-[7px] font-black uppercase tracking-[0.12em] text-[#A09689]">
                                    Time
                                  </p>

                                  <p className="mt-0.5 text-[10px] font-black text-[#4B3E2E]">
                                    {formatTimeDisplay(item.time)}
                                  </p>
                                </div>

                              </div>

                            </div>

                            <div className="rounded-xl border border-[#ECE5D8] bg-[#FCFBF7] p-3">

                              <div className="flex items-center gap-2">

                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF5EC] text-[#3E7650]">
                                  <Phone size={14} />
                                </div>

                                <div className="min-w-0">
                                  <p className="text-[7px] font-black uppercase tracking-[0.12em] text-[#A09689]">
                                    Phone
                                  </p>

                                  <p className="mt-0.5 truncate text-[10px] font-black text-[#4B3E2E]">
                                    {item.phone || 'Not available'}
                                  </p>
                                </div>

                              </div>

                            </div>

                          </div>

                          {/* PURPOSE */}
                          <div className="mt-3 rounded-xl border border-[#E5DDBF] bg-[#FDFBD4] px-3.5 py-3">

                            <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#9A8B62]">
                              Follow-Up Purpose
                            </p>

                            <p className="mt-1 text-[10px] font-bold leading-5 text-[#4D4131]">
                              {item.purpose}
                            </p>

                          </div>

                          {/* ACTIONS */}
                          <div className="mt-4 flex flex-col gap-3 border-t border-[#EEE8D9] pt-4 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex flex-wrap gap-2">

                              {item.phone && (
                                <a
                                  href={`tel:${item.phone}`}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9D0BF] bg-white px-3 py-2 text-[9px] font-black text-[#4D4131] transition hover:border-[#D4AF37] hover:bg-[#FDFBD4]"
                                >
                                  <Phone size={13} />
                                  Call
                                </a>
                              )}

                              {item.phone && (
                                <a
                                  href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#BFD9C6] bg-[#F7FBF8] px-3 py-2 text-[9px] font-black text-[#3E7650] transition hover:bg-[#EAF5EC]"
                                >
                                  <MessageCircle size={13} />
                                  WhatsApp
                                </a>
                              )}

                              {item.email && (
                                <a
                                  href={`mailto:${item.email}`}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#E8C49F] bg-[#FFF9F2] px-3 py-2 text-[9px] font-black text-[#A65D20] transition hover:bg-[#FFF4E8]"
                                >
                                  <Mail size={13} />
                                  Email
                                </a>
                              )}

                            </div>

                            {!completed && (
                              <div className="flex flex-col gap-2 sm:flex-row">

                                <button
                                  type="button"
                                  onClick={() =>
                                    openReschedule(item)
                                  }
                                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#D8CFBA] bg-white px-3.5 py-2.5 text-[9px] font-black text-[#5D5041] transition hover:border-[#D4AF37] hover:bg-[#FDFBD4]"
                                >
                                  <RefreshCw size={13} />
                                  Reschedule
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleComplete(item)
                                  }
                                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#3A2A16] px-3.5 py-2.5 text-[9px] font-black text-[#FDFBD4] transition hover:bg-[#CE8946]"
                                >
                                  <CheckCircle2 size={13} />
                                  Complete
                                </button>

                              </div>
                            )}

                            {completed && (
                              <div className="inline-flex items-center gap-1.5 rounded-xl border border-[#BFD9C6] bg-[#EAF5EC] px-3.5 py-2.5 text-[9px] font-black text-[#3E7650]">
                                <CheckCircle2 size={13} />
                                Follow-Up Completed
                              </div>
                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </section>

        {/* RESCHEDULE MODAL */}
        {rescheduleTarget && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#3A2A16]/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeReschedule();
              }
            }}
          >

            <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#D8CFBA] bg-white shadow-[0_25px_70px_rgba(58,42,22,0.25)]">

              {/* MODAL HEADER */}
              <div className="border-b border-[#EEE8D9] p-5 sm:p-6">

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <div className="flex items-center gap-2">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#3A2A16]">
                        <RefreshCw size={18} />
                      </div>

                      <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#A65D20]">
                          PlaceSync
                        </p>

                        <h2 className="text-base font-black text-[#3A2A16]">
                          Reschedule Follow-Up
                        </h2>
                      </div>

                    </div>

                    <p className="mt-3 text-[10px] font-medium text-[#81776B]">
                      {rescheduleTarget.hrName}
                      {' · '}
                      {rescheduleTarget.companyName}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeReschedule}
                    disabled={saving}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F1E8] text-[#5D5041] transition hover:bg-[#FDFBD4] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={17} />
                  </button>

                </div>

              </div>

              {/* FORM */}
              <form
                onSubmit={handleReschedule}
                className="p-5 sm:p-6"
              >

                <div className="space-y-4">

                  <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.1em] text-[#5D5041]">
                      Follow-Up Date
                    </label>

                    <div className="flex items-center gap-2 rounded-xl border border-[#D9D0BF] bg-[#FCFBF7] px-3 py-3 focus-within:border-[#D4AF37] focus-within:ring-4 focus-within:ring-[#D4AF37]/10">

                      <CalendarDays
                        size={16}
                        className="text-[#A65D20]"
                      />

                      <input
                        type="date"
                        value={newDate}
                        min={todayStr}
                        onChange={(event) =>
                          setNewDate(event.target.value)
                        }
                        required
                        className="w-full bg-transparent text-xs font-bold text-[#3A2A16] outline-none"
                      />

                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.1em] text-[#5D5041]">
                      Follow-Up Time
                    </label>

                    <div className="flex items-center gap-2 rounded-xl border border-[#D9D0BF] bg-[#FCFBF7] px-3 py-3 focus-within:border-[#D4AF37] focus-within:ring-4 focus-within:ring-[#D4AF37]/10">

                      <Clock3
                        size={16}
                        className="text-[#A65D20]"
                      />

                      <input
                        type="time"
                        value={newTime}
                        onChange={(event) =>
                          setNewTime(event.target.value)
                        }
                        className="w-full bg-transparent text-xs font-bold text-[#3A2A16] outline-none"
                      />

                    </div>
                  </div>

                </div>

                <div className="mt-5 flex items-start gap-2 rounded-xl border border-[#E5DDBF] bg-[#FDFBD4] p-3">

                  <AlertTriangle
                    size={15}
                    className="mt-0.5 shrink-0 text-[#A65D20]"
                  />

                  <p className="text-[9px] font-semibold leading-5 text-[#6B5B49]">
                    The new date and time will be saved to this HR contact's follow-up record.
                  </p>

                </div>

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={closeReschedule}
                    disabled={saving}
                    className="rounded-xl border border-[#D9D0BF] bg-white px-4 py-2.5 text-[10px] font-black text-[#5D5041] transition hover:bg-[#F8F5ED] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3A2A16] px-4 py-2.5 text-[10px] font-black text-[#FDFBD4] transition hover:bg-[#CE8946] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <RefreshCw
                          size={14}
                          className="animate-spin"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CalendarDays size={14} />
                        Save Follow-Up
                      </>
                    )}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    </main>
  );
};

export default FollowUps;