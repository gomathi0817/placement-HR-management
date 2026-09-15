import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ListChecks,
  Building2,
  UserRound
} from 'lucide-react';
import {
  getTodayDateString,
  isDateInPast,
  formatNiceDate
} from '../utils/dateUtils';

const COLORS = {
  dark: '#3A2A16',
  gold: '#D4AF37',
  olive: '#BDB76B',
  cream: '#FDFBD4',
  orange: '#CE8946'
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const WEEK_DAYS = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
];

const normalizeStatus = (status) =>
  String(status || '').trim().toLowerCase();

const isMissed = (status) => {
  const value = normalizeStatus(status);
  return value === 'missed' || value === 'overdue';
};

const isCompleted = (status) => {
  const value = normalizeStatus(status);
  return value === 'completed' || value === 'complete';
};

const getEventLabel = (event) => {
  return (
    event.hrName ||
    event.companyName ||
    event.purpose ||
    event.summary ||
    'Activity'
  );
};

const getEventStatusStyle = (status) => {
  if (isMissed(status)) {
    return {
      background: '#FFF1F1',
      color: '#A33D3D',
      border: '#EBCACA'
    };
  }

  if (isCompleted(status)) {
    return {
      background: '#EAF5EC',
      color: '#3E7650',
      border: '#BFD9C6'
    };
  }

  return {
    background: '#FDFBD4',
    color: '#5D4D25',
    border: '#DDD29B'
  };
};

const formatTime = (value) => {
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

const getTodayDate = () => {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
};

export const CalendarView = () => {
  const {
    followUps = [],
    interactions = []
  } = useApp();

  const todayStr = getTodayDateString();
  const todayDate = getTodayDate();

  const [selectedDate, setSelectedDate] =
    useState(todayStr);

  const [currentYear, setCurrentYear] =
    useState(todayDate.getFullYear());

  const [currentMonthIndex, setCurrentMonthIndex] =
    useState(todayDate.getMonth());

  const getEventsForDate = (dateStr) => {
    const matchedFollowUps = (followUps || [])
      .filter((item) => item.date === dateStr)
      .map((item) => ({
        ...item,
        eventType: 'follow-up'
      }));

    const matchedInteractions = (interactions || [])
      .filter((item) => item.date === dateStr)
      .map((item) => ({
        ...item,
        eventType: 'interaction'
      }));

    return [
      ...matchedFollowUps,
      ...matchedInteractions
    ].sort((a, b) => {
      return String(a.time || '').localeCompare(
        String(b.time || '')
      );
    });
  };

  const selectedDayEvents = useMemo(
    () => getEventsForDate(selectedDate),
    [selectedDate, followUps, interactions]
  );

  const monthStats = useMemo(() => {
    let followUpCount = 0;
    let interactionCount = 0;
    let missedCount = 0;
    let completedCount = 0;

    const monthPrefix =
      `${currentYear}-${String(
        currentMonthIndex + 1
      ).padStart(2, '0')}`;

    (followUps || []).forEach((item) => {
      if (String(item.date || '').startsWith(monthPrefix)) {
        followUpCount++;

        if (isMissed(item.status)) {
          missedCount++;
        }

        if (isCompleted(item.status)) {
          completedCount++;
        }
      }
    });

    (interactions || []).forEach((item) => {
      if (String(item.date || '').startsWith(monthPrefix)) {
        interactionCount++;
      }
    });

    return {
      followUpCount,
      interactionCount,
      missedCount,
      completedCount,
      total:
        followUpCount + interactionCount
    };
  }, [
    currentYear,
    currentMonthIndex,
    followUps,
    interactions
  ]);

  const isPrevMonthDisabled = () => {
    const previousMonthLastDay = new Date(
      currentYear,
      currentMonthIndex,
      0
    );

    return previousMonthLastDay < todayDate;
  };

  const handlePrevMonth = () => {
    if (isPrevMonthDisabled()) {
      return;
    }

    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((year) => year - 1);
    } else {
      setCurrentMonthIndex(
        (month) => month - 1
      );
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((year) => year + 1);
    } else {
      setCurrentMonthIndex(
        (month) => month + 1
      );
    }
  };

  const totalDaysInMonth = new Date(
    currentYear,
    currentMonthIndex + 1,
    0
  ).getDate();

  const firstDayOfWeek = new Date(
    currentYear,
    currentMonthIndex,
    1
  ).getDay();

  const daysInMonth = Array.from(
    { length: totalDaysInMonth },
    (_, index) => {
      const day = index + 1;

      return `${currentYear}-${String(
        currentMonthIndex + 1
      ).padStart(2, '0')}-${String(day).padStart(
        2,
        '0'
      )}`;
    }
  );

  const goToToday = () => {
    setCurrentYear(todayDate.getFullYear());
    setCurrentMonthIndex(todayDate.getMonth());
    setSelectedDate(todayStr);
  };

  return (
    <main className="min-h-full w-full bg-[#FDFBD4] px-4 pb-24 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-12">

      <div className="mx-auto w-full max-w-7xl">

        {/* HEADER */}
        <section className="relative overflow-hidden rounded-[30px] border border-[#D7B943] bg-white p-5 shadow-[0_12px_35px_rgba(58,42,22,0.07)] sm:p-7">

          <div
            className="absolute left-0 top-0 h-1 w-full"
            style={{
              backgroundColor: COLORS.gold
            }}
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
                Recruitment Calendar
              </h1>

              <p className="mt-1 max-w-xl text-[11px] font-medium leading-5 text-[#81776B] sm:text-xs">
                Plan HR follow-ups, interactions and placement activities from one calendar.
              </p>

            </div>

            <div className="flex flex-wrap items-center gap-2">

              <button
                type="button"
                onClick={goToToday}
                className="rounded-xl border border-[#D9D0BF] bg-white px-4 py-2.5 text-[10px] font-black text-[#4D4131] transition hover:border-[#D4AF37] hover:bg-[#FDFBD4]"
              >
                Today
              </button>

              <div className="flex items-center gap-2 rounded-xl border border-[#D7C993] bg-[#FDFBD4] p-1.5">

                <button
                  type="button"
                  onClick={handlePrevMonth}
                  disabled={isPrevMonthDisabled()}
                  title={
                    isPrevMonthDisabled()
                      ? 'Past months are not accessible'
                      : 'Previous month'
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#3A2A16] transition hover:bg-[#BDB76B]/30 disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <ChevronLeft size={17} />
                </button>

                <div className="min-w-[125px] text-center">
                  <p className="text-[11px] font-black text-[#3A2A16]">
                    {MONTH_NAMES[currentMonthIndex]}
                  </p>

                  <p className="text-[9px] font-bold text-[#81776B]">
                    {currentYear}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  title="Next month"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#3A2A16] transition hover:bg-[#BDB76B]/30"
                >
                  <ChevronRight size={17} />
                </button>

              </div>

            </div>

          </div>

          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#D4AF37] opacity-10" />

        </section>

        {/* MONTH SUMMARY */}
        <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">

          <div className="rounded-2xl border border-[#E5DECF] bg-white p-4">
            <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#958A7D]">
              Month Total
            </p>

            <p className="mt-1 text-2xl font-black text-[#3A2A16]">
              {monthStats.total}
            </p>

            <p className="mt-1 text-[9px] font-semibold text-[#958A7D]">
              All activities
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5DECF] bg-white p-4">
            <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#958A7D]">
              Follow-Ups
            </p>

            <p className="mt-1 text-2xl font-black text-[#3A2A16]">
              {monthStats.followUpCount}
            </p>

            <p className="mt-1 text-[9px] font-semibold text-[#958A7D]">
              Scheduled
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5DECF] bg-white p-4">
            <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#958A7D]">
              Interactions
            </p>

            <p className="mt-1 text-2xl font-black text-[#3A2A16]">
              {monthStats.interactionCount}
            </p>

            <p className="mt-1 text-[9px] font-semibold text-[#958A7D]">
              Recorded
            </p>
          </div>

          <div className="rounded-2xl border border-[#EBCACA] bg-[#FFF7F7] p-4">
            <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#A78D8D]">
              Missed
            </p>

            <p className="mt-1 text-2xl font-black text-[#A33D3D]">
              {monthStats.missedCount}
            </p>

            <p className="mt-1 text-[9px] font-semibold text-[#A78D8D]">
              Needs attention
            </p>
          </div>

          <div className="rounded-2xl border border-[#BFD9C6] bg-[#F7FBF8] p-4">
            <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#819989]">
              Completed
            </p>

            <p className="mt-1 text-2xl font-black text-[#3E7650]">
              {monthStats.completedCount}
            </p>

            <p className="mt-1 text-[9px] font-semibold text-[#819989]">
              Follow-ups done
            </p>
          </div>

        </section>

        {/* MAIN */}
        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.7fr_0.9fr]">

          {/* CALENDAR */}
          <div className="overflow-hidden rounded-[28px] border border-[#E3DAC6] bg-white shadow-[0_8px_26px_rgba(58,42,22,0.04)]">

            <div className="border-b border-[#EEE8D9] px-5 py-4 sm:px-6">

              <div className="flex items-center justify-between gap-3">

                <div>
                  <h2 className="text-sm font-black text-[#3A2A16] sm:text-base">
                    {MONTH_NAMES[currentMonthIndex]} {currentYear}
                  </h2>

                  <p className="mt-0.5 text-[9px] font-medium text-[#958A7D]">
                    Select an active date to view scheduled activities.
                  </p>
                </div>

                <div className="hidden items-center gap-3 sm:flex">

                  <span className="inline-flex items-center gap-1.5 text-[8px] font-black text-[#958A7D]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D4AF37]" />
                    Today
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-[8px] font-black text-[#958A7D]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#CE8946]" />
                    Activity
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-[8px] font-black text-[#958A7D]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#A33D3D]" />
                    Missed
                  </span>

                </div>

              </div>

            </div>

            <div className="p-3 sm:p-5">

              {/* WEEKDAYS */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">

                {WEEK_DAYS.map((day) => (
                  <div
                    key={day}
                    className="py-2 text-center text-[8px] font-black uppercase tracking-wider text-[#8D8274] sm:text-[9px]"
                  >
                    {day}
                  </div>
                ))}

              </div>

              {/* DAYS */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">

                {Array.from({
                  length: firstDayOfWeek
                }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[76px] rounded-xl bg-[#F7F3E8]/50 sm:min-h-[94px]"
                  />
                ))}

                {daysInMonth.map((dateStr) => {

                  const dayNumber = Number(
                    dateStr.split('-')[2]
                  );

                  const events =
                    getEventsForDate(dateStr);

                  const isSelected =
                    selectedDate === dateStr;

                  const isPast =
                    isDateInPast(dateStr);

                  const isToday =
                    dateStr === todayStr;

                  const hasMissed =
                    events.some((event) =>
                      isMissed(event.status)
                    );

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      disabled={isPast}
                      onClick={() => {
                        if (!isPast) {
                          setSelectedDate(dateStr);
                        }
                      }}
                      className={`group relative min-h-[76px] overflow-hidden rounded-xl border p-1.5 text-left transition-all sm:min-h-[94px] sm:p-2 ${
                        isPast
                          ? 'cursor-not-allowed border-[#E6E3DC] bg-[#F0EFEC] opacity-45'
                          : isSelected
                            ? 'border-[#3A2A16] bg-[#FDFBD4] ring-2 ring-[#D4AF37]'
                            : isToday
                              ? 'border-[#D4AF37] bg-[#FFFBEA] shadow-sm'
                              : events.length > 0
                                ? 'border-[#E1D7BE] bg-[#FCFBF7] hover:border-[#D4AF37] hover:bg-[#FDFBD4]'
                                : 'border-[#EEE9DE] bg-white hover:border-[#D4AF37] hover:bg-[#FCFBF7]'
                      }`}
                    >

                      {/* DAY NUMBER */}
                      <div className="flex items-center justify-between">

                        <span
                          className={`flex h-6 min-w-6 items-center justify-center rounded-lg px-1 text-[10px] font-black ${
                            isPast
                              ? 'bg-[#E1DFDB] text-[#98928A] line-through'
                              : isSelected
                                ? 'bg-[#3A2A16] text-[#FDFBD4]'
                                : isToday
                                  ? 'bg-[#D4AF37] text-[#3A2A16]'
                                  : 'bg-[#F4F0E6] text-[#5D5041]'
                          }`}
                        >
                          {dayNumber}
                        </span>

                        {isPast && (
                          <Lock
                            size={11}
                            className="text-[#9C968D]"
                          />
                        )}

                      </div>

                      {/* EVENT INDICATORS */}
                      {!isPast && events.length > 0 && (
                        <div className="mt-2 space-y-1">

                          {events.slice(0, 2).map(
                            (event, index) => (
                              <div
                                key={`${event.id || 'event'}-${index}`}
                                className={`truncate rounded-md px-1.5 py-1 text-[7px] font-black leading-none ${
                                  isMissed(event.status)
                                    ? 'bg-[#FFE7E7] text-[#A33D3D]'
                                    : isCompleted(event.status)
                                      ? 'bg-[#EAF5EC] text-[#3E7650]'
                                      : 'bg-[#FDFBD4] text-[#66551F]'
                                }`}
                              >
                                {getEventLabel(event)}
                              </div>
                            )
                          )}

                          {events.length > 2 && (
                            <p className="text-center text-[7px] font-black text-[#958A7D]">
                              +{events.length - 2} more
                            </p>
                          )}

                        </div>
                      )}

                    </button>
                  );
                })}

              </div>

            </div>

            {/* RESTRICTION NOTE */}
            <div className="flex items-center gap-2 border-t border-[#EEE8D9] bg-[#FCFBF7] px-5 py-3">

              <Lock
                size={13}
                className="text-[#958A7D]"
              />

              <p className="text-[9px] font-semibold text-[#81776B]">
                Previous dates are locked. Today and future dates are available.
              </p>

            </div>

          </div>

          {/* DAY INSPECTOR */}
          <aside className="overflow-hidden rounded-[28px] border border-[#E3DAC6] bg-white shadow-[0_8px_26px_rgba(58,42,22,0.04)]">

            <div className="border-b border-[#EEE8D9] p-5">

              <div className="flex items-start justify-between gap-3">

                <div>

                  <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#A65D20]">
                    Day Schedule
                  </p>

                  <h2 className="mt-1 text-base font-black text-[#3A2A16]">
                    {formatNiceDate(selectedDate)}
                  </h2>

                  {selectedDate === todayStr && (
                    <span className="mt-1 inline-flex rounded-full bg-[#FDFBD4] px-2 py-1 text-[8px] font-black text-[#5D4D25]">
                      Today
                    </span>
                  )}

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#3A2A16]">
                  <CalendarDays size={18} />
                </div>

              </div>

            </div>

            <div className="p-4 sm:p-5">

              <div className="mb-4 flex items-center justify-between">

                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#958A7D]">
                  Activities
                </p>

                <span className="rounded-full border border-[#DDD4C2] bg-[#FCFBF7] px-2.5 py-1 text-[8px] font-black text-[#5D5041]">
                  {selectedDayEvents.length}
                </span>

              </div>

              {selectedDayEvents.length === 0 ? (

                <div className="flex min-h-[310px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#DDD4C2] bg-[#FCFBF7] px-5 text-center">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDFBD4] text-[#3A2A16]">
                    <CalendarDays size={25} />
                  </div>

                  <h3 className="mt-4 text-sm font-black text-[#3A2A16]">
                    No activities scheduled
                  </h3>

                  <p className="mt-1 text-[9px] font-medium leading-5 text-[#958A7D]">
                    There are no HR follow-ups or interactions scheduled for this date.
                  </p>

                </div>

              ) : (

                <div className="max-h-[500px] space-y-3 overflow-y-auto pr-1">

                  {selectedDayEvents.map(
                    (item, index) => {

                      const statusStyle =
                        getEventStatusStyle(
                          item.status
                        );

                      return (
                        <div
                          key={`${item.id || 'event'}-${index}`}
                          className="rounded-2xl border border-[#E5DECF] bg-[#FCFBF7] p-3.5"
                        >

                          {/* EVENT HEADER */}
                          <div className="flex items-start gap-3">

                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black"
                              style={{
                                backgroundColor:
                                  COLORS.dark,
                                color:
                                  COLORS.cream,
                                border:
                                  `1px solid ${COLORS.gold}`
                              }}
                            >
                              {item.eventType ===
                              'interaction'
                                ? 'I'
                                : 'F'}
                            </div>

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-2">

                                <div className="min-w-0">

                                  <h3 className="truncate text-[11px] font-black text-[#3A2A16]">
                                    {item.hrName ||
                                      'HR Contact'}
                                  </h3>

                                  <p className="mt-0.5 flex items-center gap-1 text-[8px] font-bold text-[#81776B]">
                                    <Building2 size={10} />
                                    {item.companyName ||
                                      'Company'}
                                  </p>

                                </div>

                                <span
                                  className="shrink-0 rounded-lg border px-2 py-1 text-[7px] font-black"
                                  style={{
                                    backgroundColor:
                                      statusStyle.background,
                                    color:
                                      statusStyle.color,
                                    borderColor:
                                      statusStyle.border
                                  }}
                                >
                                  {isMissed(
                                    item.status
                                  )
                                    ? 'Missed'
                                    : isCompleted(
                                        item.status
                                      )
                                      ? 'Completed'
                                      : 'Scheduled'}
                                </span>

                              </div>

                            </div>

                          </div>

                          {/* EVENT DETAILS */}
                          <div className="mt-3 grid grid-cols-2 gap-2">

                            <div className="rounded-xl border border-[#E9E2D3] bg-white p-2.5">

                              <div className="flex items-center gap-1.5">

                                <Clock3
                                  size={12}
                                  className="text-[#A65D20]"
                                />

                                <div>
                                  <p className="text-[7px] font-black uppercase tracking-wider text-[#A09689]">
                                    Time
                                  </p>

                                  <p className="mt-0.5 text-[9px] font-black text-[#4B3E2E]">
                                    {formatTime(
                                      item.time
                                    )}
                                  </p>
                                </div>

                              </div>

                            </div>

                            <div className="rounded-xl border border-[#E9E2D3] bg-white p-2.5">

                              <div className="flex items-center gap-1.5">

                                <ListChecks
                                  size={12}
                                  className="text-[#3E7650]"
                                />

                                <div>
                                  <p className="text-[7px] font-black uppercase tracking-wider text-[#A09689]">
                                    Type
                                  </p>

                                  <p className="mt-0.5 text-[9px] font-black text-[#4B3E2E]">
                                    {item.eventType ===
                                    'interaction'
                                      ? 'Interaction'
                                      : 'Follow-Up'}
                                  </p>
                                </div>

                              </div>

                            </div>

                          </div>

                          {/* PURPOSE */}
                          <div className="mt-2 rounded-xl border border-[#E5DDBF] bg-[#FDFBD4] p-2.5">

                            <p className="text-[7px] font-black uppercase tracking-[0.12em] text-[#9A8B62]">
                              Purpose
                            </p>

                            <p className="mt-1 text-[9px] font-semibold leading-4 text-[#4D4131]">
                              {item.purpose ||
                                item.summary ||
                                'Placement follow-up activity'}
                            </p>

                          </div>

                          {/* CONTACT ACTIONS */}
                          {(item.phone ||
                            item.email) && (
                            <div className="mt-3 flex flex-wrap gap-1.5">

                              {item.phone && (
                                <a
                                  href={`tel:${item.phone}`}
                                  className="inline-flex items-center gap-1 rounded-lg border border-[#D9D0BF] bg-white px-2.5 py-1.5 text-[8px] font-black text-[#4D4131]"
                                >
                                  <Phone size={11} />
                                  Call
                                </a>
                              )}

                              {item.phone && (
                                <a
                                  href={`https://wa.me/${item.phone.replace(
                                    /[^0-9]/g,
                                    ''
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 rounded-lg border border-[#BFD9C6] bg-[#F7FBF8] px-2.5 py-1.5 text-[8px] font-black text-[#3E7650]"
                                >
                                  <MessageCircle
                                    size={11}
                                  />
                                  WhatsApp
                                </a>
                              )}

                              {item.email && (
                                <a
                                  href={`mailto:${item.email}`}
                                  className="inline-flex items-center gap-1 rounded-lg border border-[#E8C49F] bg-[#FFF9F2] px-2.5 py-1.5 text-[8px] font-black text-[#A65D20]"
                                >
                                  <Mail size={11} />
                                  Email
                                </a>
                              )}

                            </div>
                          )}

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </div>

            {/* FOOTER */}
            <div className="border-t border-[#EEE8D9] bg-[#3A2A16] px-5 py-4">

              <div className="flex items-center gap-2">

                <CheckCircle2
                  size={14}
                  className="text-[#D4AF37]"
                />

                <p className="text-[8px] font-bold leading-4 text-[#FDFBD4]">
                  Calendar is synced with your HR follow-ups and interactions.
                </p>

              </div>

            </div>

          </aside>

        </section>

      </div>
    </main>
  );
};

export default CalendarView;