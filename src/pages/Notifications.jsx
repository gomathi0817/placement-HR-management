import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  AlertTriangle,
  Clock3,
  CheckCircle2,
  Phone,
  ArrowRight,
  CalendarDays,
  Building2,
  UserRound,
  Activity,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getInitial = (name) => {
  const value = String(name || '').trim();
  return value ? value.charAt(0).toUpperCase() : '?';
};

export const Notifications = () => {
  const {
    notifications = [],
    followUps = [],
    hrs = [],
    setActiveReminder
  } = useApp();

  const navigate = useNavigate();

  const alertSummary = useMemo(() => {
    const overdue = notifications.filter(
      (item) =>
        String(item.type || '').toLowerCase() === 'overdue'
    ).length;

    const scheduled = notifications.filter(
      (item) =>
        String(item.type || '').toLowerCase() !== 'overdue'
    ).length;

    return {
      overdue,
      scheduled,
      total: notifications.length
    };
  }, [notifications]);

  const findRelatedFollowUp = (notif) => {
    if (!notif) return null;

    return (
      followUps.find(
        (followUp) =>
          String(followUp.hrName || '').toLowerCase() ===
          String(notif.hrName || '').toLowerCase()
      ) ||
      followUps.find(
        (followUp) =>
          String(followUp.companyName || '').toLowerCase() ===
          String(notif.companyName || '').toLowerCase()
      ) ||
      null
    );
  };

  const findRelatedHR = (notif) => {
    if (!notif) return null;

    return (
      hrs.find(
        (hr) =>
          String(hr.name || '').toLowerCase() ===
          String(notif.hrName || '').toLowerCase()
      ) || null
    );
  };

  const handleAction = (notif) => {
    const relatedFollowUp = findRelatedFollowUp(notif);
    const relatedHR = findRelatedHR(notif);

    if (relatedFollowUp) {
      setActiveReminder({
        followUp: relatedFollowUp,
        hr:
          relatedHR || {
            name: notif.hrName,
            companyName: notif.companyName,
            phone: notif.phone,
            email: notif.email
          }
      });
    } else if (relatedHR?.id) {
      navigate(`/hr/${relatedHR.id}`);
    } else {
      navigate('/follow-ups');
    }
  };

  return (
    <main className="min-h-full w-full bg-[#FDFBD4] px-4 pb-24 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-12">

      <div className="mx-auto w-full max-w-7xl">

        {/* HEADER */}
        <section className="relative overflow-hidden rounded-[30px] border border-[#D7B943] bg-white p-5 shadow-[0_12px_35px_rgba(58,42,22,0.07)] sm:p-7">

          <div className="absolute left-0 top-0 h-1 w-full bg-[#D4AF37]" />

          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#3A2A16]">
                  <Bell size={20} />
                </div>

                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#A65D20]">
                  PlaceSync Alerts
                </span>

              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-[#3A2A16] sm:text-3xl">
                Notifications
              </h1>

              <p className="mt-1 max-w-2xl text-[11px] font-medium leading-5 text-[#81776B] sm:text-xs">
                Stay updated with scheduled follow-ups, overdue actions and recruiter-related reminders.
              </p>

            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-xl border border-[#DDD4C2] bg-[#FCFBF7] px-4 py-2.5">

              <Bell
                size={14}
                className="text-[#A65D20]"
              />

              <span className="text-[9px] font-black text-[#5D5041]">
                {alertSummary.total} Active Alerts
              </span>

            </div>

          </div>

          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#D4AF37] opacity-10" />

        </section>

        {/* SUMMARY */}
        <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#E5DECF] bg-white p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.13em] text-[#958A7D]">
                  Total Alerts
                </p>

                <p className="mt-1 text-2xl font-black text-[#3A2A16]">
                  {alertSummary.total}
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#3A2A16]">
                <Bell size={17} />
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-[#E8C49F] bg-[#FFF9F2] p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.13em] text-[#A09689]">
                  Scheduled
                </p>

                <p className="mt-1 text-2xl font-black text-[#A65D20]">
                  {alertSummary.scheduled}
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#A65D20]">
                <Clock3 size={17} />
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-[#EBCACA] bg-[#FFF7F7] p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.13em] text-[#A78D8D]">
                  Needs Attention
                </p>

                <p className="mt-1 text-2xl font-black text-[#A33D3D]">
                  {alertSummary.overdue}
                </p>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#A33D3D]">
                <AlertTriangle size={17} />
              </div>

            </div>

          </div>

        </section>

        {/* ALERT LIST */}
        <section className="mt-5 rounded-[28px] border border-[#E3DAC6] bg-white p-5 shadow-[0_8px_26px_rgba(58,42,22,0.04)] sm:p-6">

          <div className="flex flex-col gap-3 border-b border-[#EEE8D9] pb-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#A65D20]">
                Action Center
              </p>

              <h2 className="mt-1 text-base font-black text-[#3A2A16]">
                Your Notifications
              </h2>

            </div>

            {notifications.length > 0 && (

              <button
                onClick={() => navigate('/follow-ups')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8CDBB] bg-[#FCFBF7] px-4 py-2 text-[9px] font-black text-[#5D5041] transition hover:bg-[#FDFBD4]"
              >
                View Follow-Ups
                <ArrowRight size={13} />
              </button>

            )}

          </div>

          {notifications.length === 0 ? (

            /* EMPTY STATE */
            <div className="flex flex-col items-center justify-center py-14 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7FBF8] text-[#3E7650]">

                <CheckCircle2 size={30} />

              </div>

              <h3 className="mt-5 text-base font-black text-[#3A2A16]">
                You're All Caught Up
              </h3>

              <p className="mt-1 max-w-sm text-[10px] font-medium leading-5 text-[#958A7D]">
                There are no active placement alerts or follow-up reminders requiring your attention right now.
              </p>

              <button
                onClick={() => navigate('/follow-ups')}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3A2A16] px-5 py-2.5 text-[9px] font-black text-[#FDFBD4] transition hover:bg-[#A65D20]"
              >
                Open Follow-Ups
                <ArrowRight size={13} />
              </button>

            </div>

          ) : (

            /* NOTIFICATION CARDS */
            <div className="mt-5 space-y-3">

              {notifications.map((notif) => {

                const isOverdue =
                  String(notif.type || '').toLowerCase() ===
                  'overdue';

                const relatedFollowUp =
                  findRelatedFollowUp(notif);

                const relatedHR =
                  findRelatedHR(notif);

                const hrName =
                  notif.hrName ||
                  relatedHR?.name ||
                  'HR Contact';

                const companyName =
                  notif.companyName ||
                  relatedHR?.companyName ||
                  'Company';

                return (
                  <article
                    key={notif.id}
                    className={`group rounded-2xl border p-4 transition-all duration-200 ${
                      isOverdue
                        ? 'border-[#EBCACA] bg-[#FFF7F7] hover:shadow-[0_8px_20px_rgba(163,61,61,0.08)]'
                        : 'border-[#E8E0D0] bg-[#FCFBF7] hover:border-[#D4AF37] hover:shadow-[0_8px_20px_rgba(58,42,22,0.06)]'
                    }`}
                  >

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      {/* LEFT */}
                      <div className="flex min-w-0 items-start gap-3">

                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[12px] font-black ${
                            isOverdue
                              ? 'bg-[#A33D3D] text-white'
                              : 'bg-[#3A2A16] text-[#FDFBD4]'
                          }`}
                        >
                          {isOverdue ? (
                            <AlertTriangle size={19} />
                          ) : (
                            <Bell size={19} />
                          )}
                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="text-[11px] font-black text-[#3A2A16]">
                              {notif.title || 'Follow-Up Reminder'}
                            </h3>

                            {isOverdue && (

                              <span className="rounded-md bg-[#A33D3D] px-2 py-1 text-[7px] font-black uppercase tracking-wider text-white">
                                Overdue
                              </span>

                            )}

                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">

                            <span className="flex items-center gap-1.5 text-[9px] font-black text-[#5D5041]">

                              <UserRound
                                size={12}
                                className="text-[#A65D20]"
                              />

                              {hrName}

                            </span>

                            <span className="flex items-center gap-1.5 text-[9px] font-semibold text-[#958A7D]">

                              <Building2 size={12} />

                              {companyName}

                            </span>

                          </div>

                          {notif.time && (

                            <div className="mt-2 flex items-center gap-1.5 text-[8px] font-bold text-[#958A7D]">

                              <Clock3 size={11} />

                              {notif.time}

                            </div>

                          )}

                        </div>

                      </div>

                      {/* ACTION */}
                      <div className="flex items-center justify-between gap-2 lg:justify-end">

                        {isOverdue ? (

                          <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-[#A33D3D]">

                            <AlertTriangle size={12} />

                            Needs Attention

                          </span>

                        ) : (

                          <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-[#A65D20]">

                            <Clock3 size={12} />

                            Scheduled

                          </span>

                        )}

                        <button
                          onClick={() => handleAction(notif)}
                          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[9px] font-black transition-all ${
                            isOverdue
                              ? 'bg-[#A33D3D] text-white hover:bg-[#8E3232]'
                              : 'bg-[#3A2A16] text-[#FDFBD4] hover:bg-[#A65D20]'
                          }`}
                        >
                          <Phone size={13} />
                          Action Now
                          <ArrowRight size={12} />
                        </button>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

          )}

        </section>

        {/* QUICK ACTION */}
        {notifications.length > 0 && (

          <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

            <button
              onClick={() => navigate('/follow-ups')}
              className="group flex items-center justify-between rounded-2xl border border-[#E3DAC6] bg-white p-4 text-left transition hover:border-[#D4AF37] hover:shadow-[0_8px_22px_rgba(58,42,22,0.06)]"
            >

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDFBD4] text-[#3A2A16]">
                  <CalendarDays size={17} />
                </div>

                <div>

                  <p className="text-[10px] font-black text-[#3A2A16]">
                    Manage Follow-Ups
                  </p>

                  <p className="mt-1 text-[8px] font-medium text-[#958A7D]">
                    Review and reschedule your follow-up activities.
                  </p>

                </div>

              </div>

              <ArrowRight
                size={15}
                className="text-[#A65D20] transition group-hover:translate-x-1"
              />

            </button>

            <button
              onClick={() => navigate('/hr')}
              className="group flex items-center justify-between rounded-2xl border border-[#E3DAC6] bg-white p-4 text-left transition hover:border-[#D4AF37] hover:shadow-[0_8px_22px_rgba(58,42,22,0.06)]"
            >

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF9F2] text-[#A65D20]">
                  <UserRound size={17} />
                </div>

                <div>

                  <p className="text-[10px] font-black text-[#3A2A16]">
                    HR Directory
                  </p>

                  <p className="mt-1 text-[8px] font-medium text-[#958A7D]">
                    Open your recruiter contact directory.
                  </p>

                </div>

              </div>

              <ArrowRight
                size={15}
                className="text-[#A65D20] transition group-hover:translate-x-1"
              />

            </button>

          </section>

        )}

        {/* FOOTER */}
        <div className="mt-5 flex items-center justify-center gap-2 px-4 text-center">

          <Activity
            size={12}
            className="text-[#958A7D]"
          />

          <p className="text-[8px] font-semibold leading-4 text-[#958A7D]">
            Notifications are generated from your current follow-up and HR contact records.
          </p>

        </div>

      </div>

    </main>
  );
};

export default Notifications;