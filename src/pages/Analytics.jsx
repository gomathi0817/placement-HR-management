import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Phone,
  MessageCircle,
  Mail,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Building2,
  BarChart3,
  UserRound,
  Target,
  TrendingUp,
  CalendarDays,
  Activity,
  BriefcaseBusiness
} from 'lucide-react';

const getStatus = (value) =>
  String(value || '').trim().toLowerCase();

const isCompleted = (value) => {
  const status = getStatus(value);

  return (
    status === 'completed' ||
    status === 'complete' ||
    status === 'done'
  );
};

const isMissed = (value) => {
  const status = getStatus(value);

  return (
    status === 'missed' ||
    status === 'overdue'
  );
};

const isWaiting = (value) => {
  const status = getStatus(value);

  return (
    status.includes('waiting') ||
    status.includes('response')
  );
};

const getInitial = (name) => {
  const value = String(name || '').trim();

  return value
    ? value.charAt(0).toUpperCase()
    : '?';
};

export const Analytics = () => {
  const {
    hrs = [],
    companies = [],
    followUps = [],
    interactions = []
  } = useApp();

  const analytics = useMemo(() => {
    const today = new Date();

    const todayStr =
      `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, '0')}-${String(
        today.getDate()
      ).padStart(2, '0')}`;

    const totalHRContacts = hrs.length;
    const totalCompanies = companies.length;
    const totalFollowUps = followUps.length;
    const totalInteractions = interactions.length;

    const completedFollowUps =
      followUps.filter((item) =>
        isCompleted(item.status)
      ).length;

    const missedFollowUps =
      followUps.filter((item) =>
        isMissed(item.status)
      ).length;

    const waitingFollowUps =
      followUps.filter((item) =>
        isWaiting(item.status)
      ).length;

    const todayFollowUps =
      followUps.filter(
        (item) =>
          item.date === todayStr &&
          !isCompleted(item.status)
      ).length;

    const upcomingFollowUps =
      followUps.filter((item) => {
        if (!item.date) return false;

        return (
          item.date > todayStr &&
          !isCompleted(item.status)
        );
      }).length;

    const pendingFollowUps =
      followUps.filter((item) => {
        const status = getStatus(item.status);

        return (
          !isCompleted(status) &&
          !isMissed(status) &&
          !isWaiting(status) &&
          item.date !== todayStr
        );
      }).length;

    const studentsRequired =
      hrs.reduce((total, hr) => {
        const value = Number(
          hr.studentsRequired
        );

        return (
          total +
          (Number.isFinite(value) ? value : 0)
        );
      }, 0);

    const companyStudentsRequired =
      companies.reduce((total, company) => {
        const value = Number(
          company.studentsRequired
        );

        return (
          total +
          (Number.isFinite(value) ? value : 0)
        );
      }, 0);

    const activeCompanies =
      companies.filter((company) => {
        const status = getStatus(
          company.status
        );

        return (
          status.includes('active') ||
          status.includes('ongoing') ||
          status.includes('open')
        );
      }).length;

    const statusCounts = {
      completed: completedFollowUps,
      upcoming: upcomingFollowUps,
      waiting: waitingFollowUps,
      pending: pendingFollowUps,
      missed: missedFollowUps
    };

    const interactionTypes = {
      phone: 0,
      whatsapp: 0,
      email: 0,
      meeting: 0
    };

    interactions.forEach((interaction) => {
      const text = [
        interaction.type,
        interaction.mode,
        interaction.channel,
        interaction.method,
        interaction.purpose,
        interaction.summary
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (
        text.includes('whatsapp') ||
        text.includes('whats app')
      ) {
        interactionTypes.whatsapp++;
      } else if (
        text.includes('email') ||
        text.includes('mail')
      ) {
        interactionTypes.email++;
      } else if (
        text.includes('meeting') ||
        text.includes('meet')
      ) {
        interactionTypes.meeting++;
      } else if (
        text.includes('call') ||
        text.includes('phone')
      ) {
        interactionTypes.phone++;
      }
    });

    /*
      If interaction records do not contain a channel/type,
      count them as general interactions instead of inventing
      a communication channel.
    */
    const categorizedInteractions =
      Object.values(interactionTypes).reduce(
        (sum, value) => sum + value,
        0
      );

    const uncategorizedInteractions =
      Math.max(
        0,
        totalInteractions -
          categorizedInteractions
      );

    const interactionChannelData = [
      {
        label: 'Phone Calls',
        count: interactionTypes.phone,
        icon: Phone
      },
      {
        label: 'WhatsApp',
        count: interactionTypes.whatsapp,
        icon: MessageCircle
      },
      {
        label: 'Official Emails',
        count: interactionTypes.email,
        icon: Mail
      },
      {
        label: 'Meetings',
        count: interactionTypes.meeting,
        icon: Users
      }
    ];

    const interactionPercentages =
      interactionChannelData.map((item) => ({
        ...item,
        percentage:
          totalInteractions > 0
            ? Math.round(
                (item.count /
                  totalInteractions) *
                  100
              )
            : 0
      }));

    const recentInteractions =
      [...interactions]
        .sort((a, b) =>
          String(b.date || '').localeCompare(
            String(a.date || '')
          )
        )
        .slice(0, 5);

    const topCompanies =
      [...companies]
        .sort((a, b) => {
          const aStudents =
            Number(a.studentsRequired) || 0;

          const bStudents =
            Number(b.studentsRequired) || 0;

          return bStudents - aStudents;
        })
        .slice(0, 5);

    return {
      todayStr,
      totalHRContacts,
      totalCompanies,
      totalFollowUps,
      totalInteractions,
      completedFollowUps,
      missedFollowUps,
      waitingFollowUps,
      todayFollowUps,
      upcomingFollowUps,
      pendingFollowUps,
      studentsRequired,
      companyStudentsRequired,
      activeCompanies,
      statusCounts,
      interactionPercentages,
      uncategorizedInteractions,
      recentInteractions,
      topCompanies
    };
  }, [
    hrs,
    companies,
    followUps,
    interactions
  ]);

  const completionRate =
    analytics.totalFollowUps > 0
      ? Math.round(
          (analytics.completedFollowUps /
            analytics.totalFollowUps) *
            100
        )
      : 0;

  const followUpResolutionRate =
    analytics.totalFollowUps > 0
      ? Math.round(
          ((analytics.completedFollowUps) /
            analytics.totalFollowUps) *
            100
        )
      : 0;

  return (
    <main className="min-h-full w-full bg-[#FDFBD4] px-4 pb-24 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-12">

      <div className="mx-auto w-full max-w-7xl">

        {/* HEADER */}
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
                  <BarChart3 size={20} />
                </div>

                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#A65D20]">
                  PlaceSync
                </span>

              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-[#3A2A16] sm:text-3xl">
                Placement Analytics
              </h1>

              <p className="mt-1 max-w-2xl text-[11px] font-medium leading-5 text-[#81776B] sm:text-xs">
                Understand HR communication, follow-up performance and recruiting activity using your actual records.
              </p>

            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-xl border border-[#DDD4C2] bg-[#FCFBF7] px-4 py-2.5">

              <CalendarDays
                size={14}
                className="text-[#A65D20]"
              />

              <span className="text-[9px] font-black text-[#5D5041]">
                Academic Year 2026–27
              </span>

            </div>

          </div>

          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#D4AF37] opacity-10" />

        </section>

        {/* OVERVIEW CARDS */}
        <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <div className="rounded-2xl border border-[#E5DECF] bg-white p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.13em] text-[#958A7D]">
                  HR Contacts
                </p>

                <p className="mt-1 text-2xl font-black text-[#3A2A16]">
                  {analytics.totalHRContacts}
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#3A2A16]">
                <UserRound size={17} />
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-[#E5DECF] bg-white p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.13em] text-[#958A7D]">
                  Companies
                </p>

                <p className="mt-1 text-2xl font-black text-[#3A2A16]">
                  {analytics.totalCompanies}
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF9F2] text-[#A65D20]">
                <Building2 size={17} />
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-[#E5DECF] bg-white p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.13em] text-[#958A7D]">
                  Interactions
                </p>

                <p className="mt-1 text-2xl font-black text-[#3A2A16]">
                  {analytics.totalInteractions}
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7FBF8] text-[#3E7650]">
                <Activity size={17} />
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-[#E8C49F] bg-[#FFF9F2] p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.13em] text-[#A09689]">
                  Follow-Ups
                </p>

                <p className="mt-1 text-2xl font-black text-[#A65D20]">
                  {analytics.totalFollowUps}
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#A65D20]">
                <Target size={17} />
              </div>

            </div>

          </div>

        </section>

        {/* MAIN ANALYTICS */}
        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">

          {/* COMMUNICATION */}
          <div className="rounded-[28px] border border-[#E3DAC6] bg-white p-5 shadow-[0_8px_26px_rgba(58,42,22,0.04)] sm:p-6">

            <div className="flex items-start justify-between border-b border-[#EEE8D9] pb-4">

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#A65D20]">
                  Communication
                </p>

                <h2 className="mt-1 text-base font-black text-[#3A2A16]">
                  HR Communication Channels
                </h2>

                <p className="mt-1 text-[9px] font-medium text-[#958A7D]">
                  {analytics.totalInteractions} recorded interactions
                </p>

              </div>

              <MessageCircle
                size={20}
                className="text-[#D4AF37]"
              />

            </div>

            <div className="mt-5 space-y-4">

              {analytics.interactionPercentages.map(
                (item) => {

                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="space-y-2"
                    >

                      <div className="flex items-center justify-between">

                        <span className="flex items-center gap-2 text-[10px] font-black text-[#4D4131]">

                          <Icon
                            size={14}
                            className="text-[#A65D20]"
                          />

                          {item.label}

                        </span>

                        <span className="text-[9px] font-black text-[#81776B]">
                          {item.count} · {item.percentage}%
                        </span>

                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-[#F2EEE4]">

                        <div
                          className="h-full rounded-full bg-[#D4AF37] transition-all duration-500"
                          style={{
                            width: `${item.percentage}%`
                          }}
                        />

                      </div>

                    </div>
                  );
                }
              )}

              {analytics.uncategorizedInteractions > 0 && (

                <div className="rounded-xl border border-[#E5DECF] bg-[#FCFBF7] p-3">

                  <div className="flex items-center justify-between">

                    <span className="text-[8px] font-black uppercase tracking-wider text-[#958A7D]">
                      Other / Unspecified
                    </span>

                    <span className="text-[9px] font-black text-[#5D5041]">
                      {analytics.uncategorizedInteractions}
                    </span>

                  </div>

                  <p className="mt-1 text-[8px] font-medium text-[#958A7D]">
                    These interactions do not contain a recognized communication channel.
                  </p>

                </div>

              )}

            </div>

          </div>

          {/* FOLLOW-UP PERFORMANCE */}
          <div className="rounded-[28px] border border-[#E3DAC6] bg-white p-5 shadow-[0_8px_26px_rgba(58,42,22,0.04)] sm:p-6">

            <div className="flex items-start justify-between border-b border-[#EEE8D9] pb-4">

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#A65D20]">
                  Follow-Up Performance
                </p>

                <h2 className="mt-1 text-base font-black text-[#3A2A16]">
                  Resolution Overview
                </h2>

                <p className="mt-1 text-[9px] font-medium text-[#958A7D]">
                  Current status of recorded follow-ups
                </p>

              </div>

              <CheckCircle2
                size={20}
                className="text-[#3E7650]"
              />

            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-[#BFD9C6] bg-[#F7FBF8] p-4">

                <CheckCircle2
                  size={16}
                  className="text-[#3E7650]"
                />

                <p className="mt-3 text-2xl font-black text-[#3E7650]">
                  {analytics.completedFollowUps}
                </p>

                <p className="mt-1 text-[8px] font-black uppercase tracking-wider text-[#819989]">
                  Completed
                </p>

              </div>

              <div className="rounded-2xl border border-[#E8C49F] bg-[#FFF9F2] p-4">

                <Clock3
                  size={16}
                  className="text-[#A65D20]"
                />

                <p className="mt-3 text-2xl font-black text-[#A65D20]">
                  {analytics.upcomingFollowUps}
                </p>

                <p className="mt-1 text-[8px] font-black uppercase tracking-wider text-[#A09689]">
                  Upcoming
                </p>

              </div>

              <div className="rounded-2xl border border-[#DDD4C2] bg-[#FCFBF7] p-4">

                <TrendingUp
                  size={16}
                  className="text-[#69591F]"
                />

                <p className="mt-3 text-2xl font-black text-[#5D5041]">
                  {analytics.waitingFollowUps}
                </p>

                <p className="mt-1 text-[8px] font-black uppercase tracking-wider text-[#958A7D]">
                  Waiting
                </p>

              </div>

              <div className="rounded-2xl border border-[#EBCACA] bg-[#FFF7F7] p-4">

                <AlertTriangle
                  size={16}
                  className="text-[#A33D3D]"
                />

                <p className="mt-3 text-2xl font-black text-[#A33D3D]">
                  {analytics.missedFollowUps}
                </p>

                <p className="mt-1 text-[8px] font-black uppercase tracking-wider text-[#A78D8D]">
                  Missed
                </p>

              </div>

            </div>

            {/* RESOLUTION BAR */}
            <div className="mt-5 rounded-2xl border border-[#E5DECF] bg-[#FCFBF7] p-4">

              <div className="flex items-center justify-between">

                <span className="text-[9px] font-black text-[#4D4131]">
                  Follow-Up Completion Rate
                </span>

                <span className="text-[11px] font-black text-[#3A2A16]">
                  {completionRate}%
                </span>

              </div>

              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#EAE5D9]">

                <div
                  className="h-full rounded-full bg-[#3E7650] transition-all duration-500"
                  style={{
                    width: `${completionRate}%`
                  }}
                />

              </div>

            </div>

          </div>

        </section>

        {/* IMPACT */}
        <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* PLACEMENT ACTIVITY */}
          <div className="rounded-[28px] bg-[#3A2A16] p-5 text-[#FDFBD4] shadow-[0_10px_30px_rgba(58,42,22,0.12)] sm:p-6">

            <div className="flex items-start justify-between border-b border-[#FDFBD4]/15 pb-4">

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#D4AF37]">
                  Recruitment Activity
                </p>

                <h2 className="mt-1 text-base font-black">
                  Campus Drive Overview
                </h2>

              </div>

              <BriefcaseBusiness
                size={20}
                className="text-[#D4AF37]"
              />

            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-[#FDFBD4]/10 bg-[#FDFBD4]/5 p-4">

                <Building2
                  size={15}
                  className="text-[#D4AF37]"
                />

                <p className="mt-3 text-2xl font-black">
                  {analytics.activeCompanies}
                </p>

                <p className="mt-1 text-[8px] font-bold uppercase text-[#FDFBD4]/60">
                  Active Companies
                </p>

              </div>

              <div className="rounded-2xl border border-[#FDFBD4]/10 bg-[#FDFBD4]/5 p-4">

                <Users
                  size={15}
                  className="text-[#D4AF37]"
                />

                <p className="mt-3 text-2xl font-black">
                  {analytics.companyStudentsRequired}
                </p>

                <p className="mt-1 text-[8px] font-bold uppercase text-[#FDFBD4]/60">
                  Students Required
                </p>

              </div>

            </div>

            <div className="mt-4 space-y-2">

              <div className="flex items-center justify-between border-b border-[#FDFBD4]/10 py-2">

                <span className="text-[9px] font-semibold text-[#FDFBD4]/65">
                  Total HR Contacts
                </span>

                <span className="text-[10px] font-black">
                  {analytics.totalHRContacts}
                </span>

              </div>

              <div className="flex items-center justify-between border-b border-[#FDFBD4]/10 py-2">

                <span className="text-[9px] font-semibold text-[#FDFBD4]/65">
                  Total Interactions
                </span>

                <span className="text-[10px] font-black">
                  {analytics.totalInteractions}
                </span>

              </div>

              <div className="flex items-center justify-between py-2">

                <span className="text-[9px] font-semibold text-[#FDFBD4]/65">
                  Today's Follow-Ups
                </span>

                <span className="text-[10px] font-black text-[#D4AF37]">
                  {analytics.todayFollowUps}
                </span>

              </div>

            </div>

          </div>

          {/* STATUS DISTRIBUTION */}
          <div className="rounded-[28px] border border-[#E3DAC6] bg-white p-5 shadow-[0_8px_26px_rgba(58,42,22,0.04)] sm:p-6">

            <div className="flex items-start justify-between border-b border-[#EEE8D9] pb-4">

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#A65D20]">
                  Status Distribution
                </p>

                <h2 className="mt-1 text-base font-black text-[#3A2A16]">
                  Follow-Up Pipeline
                </h2>

              </div>

              <BarChart3
                size={20}
                className="text-[#D4AF37]"
              />

            </div>

            <div className="mt-5 space-y-3">

              {[
                {
                  label: 'Completed',
                  value: analytics.statusCounts.completed,
                  icon: CheckCircle2,
                  bg: '#EAF5EC',
                  text: '#3E7650'
                },
                {
                  label: 'Upcoming',
                  value: analytics.statusCounts.upcoming,
                  icon: Clock3,
                  bg: '#FFF9F2',
                  text: '#A65D20'
                },
                {
                  label: 'Waiting for Response',
                  value: analytics.statusCounts.waiting,
                  icon: MessageCircle,
                  bg: '#FDFBD4',
                  text: '#69591F'
                },
                {
                  label: 'Pending Action',
                  value: analytics.statusCounts.pending,
                  icon: Activity,
                  bg: '#FCFBF7',
                  text: '#5D5041'
                },
                {
                  label: 'Missed / Overdue',
                  value: analytics.statusCounts.missed,
                  icon: AlertTriangle,
                  bg: '#FFF1F1',
                  text: '#A33D3D'
                }
              ].map((item) => {

                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl border border-[#E9E2D3] p-3"
                    style={{
                      backgroundColor: item.bg
                    }}
                  >

                    <div className="flex items-center gap-2">

                      <Icon
                        size={13}
                        style={{
                          color: item.text
                        }}
                      />

                      <span className="text-[9px] font-black text-[#4D4131]">
                        {item.label}
                      </span>

                    </div>

                    <span
                      className="rounded-lg bg-white px-2 py-1 text-[9px] font-black"
                      style={{
                        color: item.text
                      }}
                    >
                      {item.value}
                    </span>

                  </div>
                );
              })}

            </div>

          </div>

          {/* QUICK METRICS */}
          <div className="rounded-[28px] border border-[#E3DAC6] bg-white p-5 shadow-[0_8px_26px_rgba(58,42,22,0.04)] sm:p-6">

            <div className="border-b border-[#EEE8D9] pb-4">

              <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#A65D20]">
                Quick Metrics
              </p>

              <h2 className="mt-1 text-base font-black text-[#3A2A16]">
                Current Workload
              </h2>

            </div>

            <div className="mt-5 space-y-3">

              <div className="rounded-2xl border border-[#E9E2D3] bg-[#FCFBF7] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#3A2A16]">
                    <CalendarDays size={15} />
                  </div>

                  <div>

                    <p className="text-[8px] font-black uppercase tracking-wider text-[#958A7D]">
                      Today's Workload
                    </p>

                    <p className="mt-1 text-sm font-black text-[#3A2A16]">
                      {analytics.todayFollowUps}
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl border border-[#E9E2D3] bg-[#FCFBF7] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF9F2] text-[#A65D20]">
                    <Clock3 size={15} />
                  </div>

                  <div>

                    <p className="text-[8px] font-black uppercase tracking-wider text-[#958A7D]">
                      Upcoming
                    </p>

                    <p className="mt-1 text-sm font-black text-[#A65D20]">
                      {analytics.upcomingFollowUps}
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl border border-[#EBCACA] bg-[#FFF7F7] p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#A33D3D]">
                    <AlertTriangle size={15} />
                  </div>

                  <div>

                    <p className="text-[8px] font-black uppercase tracking-wider text-[#A78D8D]">
                      Needs Attention
                    </p>

                    <p className="mt-1 text-sm font-black text-[#A33D3D]">
                      {analytics.missedFollowUps}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* TOP COMPANIES */}
        <section className="mt-5 rounded-[28px] border border-[#E3DAC6] bg-white p-5 shadow-[0_8px_26px_rgba(58,42,22,0.04)] sm:p-6">

          <div className="flex items-start justify-between border-b border-[#EEE8D9] pb-4">

            <div>

              <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#A65D20]">
                Hiring Demand
              </p>

              <h2 className="mt-1 text-base font-black text-[#3A2A16]">
                Companies by Student Requirement
              </h2>

              <p className="mt-1 text-[9px] font-medium text-[#958A7D]">
                Based only on student requirements recorded in your company data.
              </p>

            </div>

            <Users
              size={20}
              className="text-[#D4AF37]"
            />

          </div>

          {analytics.topCompanies.length === 0 ? (

            <div className="py-10 text-center">

              <Building2
                size={30}
                className="mx-auto text-[#D4AF37]"
              />

              <p className="mt-3 text-[10px] font-black text-[#3A2A16]">
                No company data available
              </p>

            </div>

          ) : (

            <div className="mt-5 space-y-3">

              {analytics.topCompanies.map(
                (company, index) => {

                  const required =
                    Number(
                      company.studentsRequired
                    ) || 0;

                  const maxRequired =
                    Math.max(
                      1,
                      Number(
                        analytics.topCompanies[0]
                          ?.studentsRequired
                      ) || 1
                    );

                  const width = Math.min(
                    100,
                    Math.round(
                      (required /
                        maxRequired) *
                        100
                    )
                  );

                  return (
                    <div
                      key={
                        company.id ||
                        `${company.name}-${index}`
                      }
                      className="flex items-center gap-3 rounded-2xl border border-[#ECE6D9] bg-[#FCFBF7] p-3"
                    >

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3A2A16] text-[11px] font-black text-[#FDFBD4]">
                        {getInitial(
                          company.name
                        )}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center justify-between gap-3">

                          <p className="truncate text-[9px] font-black text-[#4D4131]">
                            {company.name ||
                              'Company'}
                          </p>

                          <span className="shrink-0 text-[9px] font-black text-[#A65D20]">
                            {required} students
                          </span>

                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EEE9DE]">

                          <div
                            className="h-full rounded-full bg-[#D4AF37]"
                            style={{
                              width: `${width}%`
                            }}
                          />

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>

        {/* FOOTER NOTE */}
        <div className="mt-5 flex items-center justify-center gap-2 px-4 text-center">

          <Activity
            size={12}
            className="text-[#958A7D]"
          />

          <p className="text-[8px] font-semibold leading-4 text-[#958A7D]">
            Analytics are calculated from your current HR contacts, companies, follow-ups and interaction records.
          </p>

        </div>

      </div>

    </main>
  );
};

export default Analytics;