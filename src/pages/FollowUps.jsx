import React, { useMemo, useState } from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  X,
  Phone,
  Building2,
  UserRound,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

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

const getStatusClass = (status) => {
  const normalized = String(status || '').toLowerCase();

  if (
    normalized === 'completed' ||
    normalized === 'complete'
  ) {
    return 'followup-status completed';
  }

  if (
    normalized === 'missed' ||
    normalized === 'overdue'
  ) {
    return 'followup-status missed';
  }

  if (
    normalized === 'follow-up due' ||
    normalized === 'due'
  ) {
    return 'followup-status due';
  }

  return 'followup-status upcoming';
};

const getStatusLabel = (status) => {
  const normalized = String(status || '').toLowerCase();

  if (normalized === 'completed' || normalized === 'complete') {
    return 'Completed';
  }

  if (normalized === 'missed' || normalized === 'overdue') {
    return 'Missed';
  }

  if (
    normalized === 'follow-up due' ||
    normalized === 'due'
  ) {
    return 'Follow-Up Due';
  }

  return 'Upcoming';
};

const getPriorityClass = (priority) => {
  const normalized = String(priority || '').toLowerCase();

  if (normalized === 'high') {
    return 'priority high';
  }

  if (normalized === 'low') {
    return 'priority low';
  }

  return 'priority medium';
};

const getHRInitial = (name) => {
  const trimmedName = String(name || '').trim();

  if (!trimmedName) {
    return '?';
  }

  return trimmedName.charAt(0).toUpperCase();
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

  /*
   * Combine follow-up data with HR contact data.
   *
   * followUpService returns:
   * id
   * hrId
   * hrName
   * companyName
   * date
   * time
   * status
   * purpose
   * priority
   */
  const normalizedFollowUps = useMemo(() => {
    return (followUps || []).map((item) => {
      const hr =
        hrs.find((hrItem) => hrItem.id === item.hrId) ||
        hrs.find((hrItem) => hrItem.id === item.id);

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

  const filteredFollowUps = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return normalizedFollowUps.filter((item) => {
      const normalizedStatus =
        String(item.status || '').toLowerCase();

      let matchesTab = true;

      if (activeTab === 'Today') {
        matchesTab =
          item.date === todayStr &&
          normalizedStatus !== 'missed' &&
          normalizedStatus !== 'overdue' &&
          normalizedStatus !== 'completed';
      }

      if (activeTab === 'Upcoming') {
        matchesTab =
          normalizedStatus === 'upcoming' ||
          normalizedStatus === 'pending' ||
          normalizedStatus === 'follow-up due' ||
          normalizedStatus === 'due';
      }

      if (activeTab === 'Missed') {
        matchesTab =
          normalizedStatus === 'missed' ||
          normalizedStatus === 'overdue';
      }

      if (activeTab === 'Completed') {
        matchesTab =
          normalizedStatus === 'completed' ||
          normalizedStatus === 'complete';
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

  const counts = useMemo(() => {
    let today = 0;
    let upcoming = 0;
    let missed = 0;
    let completed = 0;

    normalizedFollowUps.forEach((item) => {
      const status =
        String(item.status || '').toLowerCase();

      if (
        item.date === todayStr &&
        status !== 'missed' &&
        status !== 'overdue' &&
        status !== 'completed'
      ) {
        today++;
      }

      if (
        status === 'upcoming' ||
        status === 'pending' ||
        status === 'follow-up due' ||
        status === 'due'
      ) {
        upcoming++;
      }

      if (
        status === 'missed' ||
        status === 'overdue'
      ) {
        missed++;
      }

      if (
        status === 'completed' ||
        status === 'complete'
      ) {
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

  const openReschedule = (item) => {
    setRescheduleTarget(item);
    setNewDate(item.date || todayStr);

    /*
     * Convert existing display time such as
     * 10:30 AM into HTML time format 10:30.
     */
    let timeValue = item.time || '';

    if (timeValue.includes('AM') || timeValue.includes('PM')) {
      const parts = timeValue.trim().split(' ');
      const clock = parts[0];
      const period = parts[1];

      const [h, m] = clock.split(':');

      let hour = Number(h);

      if (period === 'AM' && hour === 12) {
        hour = 0;
      }

      if (period === 'PM' && hour !== 12) {
        hour += 12;
      }

      timeValue = `${String(hour).padStart(2, '0')}:${m}`;
    }

    setNewTime(timeValue || '10:30');
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
    if (!item?.id) {
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

    if (!rescheduleTarget?.id) {
      return;
    }

    if (!newDate) {
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

  const tabs = [
    {
      label: 'All',
      count: counts.all
    },
    {
      label: 'Today',
      count: counts.today
    },
    {
      label: 'Upcoming',
      count: counts.upcoming
    },
    {
      label: 'Missed',
      count: counts.missed
    },
    {
      label: 'Completed',
      count: counts.completed
    }
  ];

  return (
    <div className="followups-page">

      {/* PAGE HEADER */}
      <div className="followups-header">

        <div>
          <h1>Follow-Ups</h1>

          <p>
            Manage and track all scheduled HR follow-ups.
          </p>
        </div>

        <div className="followups-total-card">
          <CalendarDays size={22} />

          <div>
            <strong>{counts.all}</strong>
            <span>Total Follow-Ups</span>
          </div>
        </div>

      </div>

      {/* SUMMARY CARDS */}
      <div className="followups-summary">

        <div className="summary-card">
          <div className="summary-icon">
            <CalendarDays size={22} />
          </div>

          <div>
            <span>Today</span>
            <strong>{counts.today}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Clock size={22} />
          </div>

          <div>
            <span>Upcoming</span>
            <strong>{counts.upcoming}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <AlertCircle size={22} />
          </div>

          <div>
            <span>Missed</span>
            <strong>{counts.missed}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <span>Completed</span>
            <strong>{counts.completed}</strong>
          </div>
        </div>

      </div>

      {/* SEARCH */}
      <div className="followups-toolbar">

        <div className="followups-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search HR, company, phone..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

          {searchTerm && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              <X size={17} />
            </button>
          )}
        </div>

      </div>

      {/* TABS */}
      <div className="followups-tabs">

        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={
              activeTab === tab.label
                ? 'followup-tab active'
                : 'followup-tab'
            }
            onClick={() =>
              setActiveTab(tab.label)
            }
          >
            <span>{tab.label}</span>

            <span className="tab-count">
              {tab.count}
            </span>
          </button>
        ))}

      </div>

      {/* CONTENT */}
      <div className="followups-content">

        {loading && normalizedFollowUps.length === 0 ? (
          <div className="followups-empty">
            <RefreshCw
              size={34}
              className="loading-icon"
            />

            <h3>Loading follow-ups...</h3>

            <p>
              Please wait while your follow-ups are loaded.
            </p>
          </div>
        ) : filteredFollowUps.length === 0 ? (
          <div className="followups-empty">

            <CalendarDays size={52} />

            <h3>
              No follow-ups found
            </h3>

            <p>
              {searchTerm
                ? 'No follow-ups match your search.'
                : activeTab === 'All'
                  ? 'You have no scheduled follow-ups yet.'
                  : `There are no ${activeTab.toLowerCase()} follow-ups.`}
            </p>

          </div>
        ) : (
          <div className="followups-list">

            {filteredFollowUps.map((item) => (
              <div
                className="followup-card"
                key={item.id}
              >

                {/* AVATAR */}
                <div className="followup-avatar">
                  {getHRInitial(item.hrName)}
                </div>

                {/* MAIN INFO */}
                <div className="followup-main">

                  <div className="followup-title-row">

                    <div>
                      <h3>
                        {item.hrName}
                      </h3>

                      <div className="followup-company">
                        <Building2 size={15} />

                        <span>
                          {item.companyName}
                        </span>
                      </div>
                    </div>

                    <span
                      className={getStatusClass(
                        item.status
                      )}
                    >
                      {getStatusLabel(
                        item.status
                      )}
                    </span>

                  </div>

                  <div className="followup-details">

                    <div className="followup-detail">

                      <CalendarDays size={16} />

                      <span>
                        {formatNiceDate(
                          item.date
                        )}
                      </span>

                    </div>

                    <div className="followup-detail">

                      <Clock size={16} />

                      <span>
                        {item.time ||
                          '10:30 AM'}
                      </span>

                    </div>

                    {item.phone && (
                      <div className="followup-detail">

                        <Phone size={16} />

                        <span>
                          {item.phone}
                        </span>

                      </div>
                    )}

                  </div>

                  <div className="followup-purpose">
                    <span>
                      Purpose:
                    </span>

                    <strong>
                      {item.purpose}
                    </strong>
                  </div>

                  <div className="followup-bottom-row">

                    <span
                      className={getPriorityClass(
                        item.priority
                      )}
                    >
                      {item.priority || 'Medium'} Priority
                    </span>

                    <div className="followup-actions">

                      {String(
                        item.status || ''
                      ).toLowerCase() !==
                        'completed' &&
                        String(
                          item.status || ''
                        ).toLowerCase() !==
                          'complete' && (
                          <>
                            <button
                              type="button"
                              className="secondary-action"
                              onClick={() =>
                                openReschedule(
                                  item
                                )
                              }
                            >
                              <RefreshCw
                                size={16}
                              />

                              Reschedule
                            </button>

                            <button
                              type="button"
                              className="primary-action"
                              onClick={() =>
                                handleComplete(
                                  item
                                )
                              }
                            >
                              <CheckCircle2
                                size={16}
                              />

                              Complete
                            </button>
                          </>
                        )}

                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* RESCHEDULE MODAL */}
      {rescheduleTarget && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeReschedule();
            }
          }}
        >

          <div className="reschedule-modal">

            <div className="modal-header">

              <div>
                <h2>
                  Reschedule Follow-Up
                </h2>

                <p>
                  {rescheduleTarget.hrName}
                  {' · '}
                  {rescheduleTarget.companyName}
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeReschedule}
                disabled={saving}
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleReschedule}
            >

              <div className="form-group">

                <label>
                  Follow-Up Date
                </label>

                <div className="input-with-icon">

                  <CalendarDays size={18} />

                  <input
                    type="date"
                    value={newDate}
                    min={todayStr}
                    onChange={(event) =>
                      setNewDate(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Follow-Up Time
                </label>

                <div className="input-with-icon">

                  <Clock size={18} />

                  <input
                    type="time"
                    value={newTime}
                    onChange={(event) =>
                      setNewTime(
                        event.target.value
                      )
                    }
                  />

                </div>

              </div>

              <div className="reschedule-note">

                <AlertCircle size={18} />

                <span>
                  The selected date and time will
                  be saved to this HR contact.
                </span>

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeReschedule}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="loading-icon"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      <CalendarDays
                        size={17}
                      />

                      Save Follow-Up
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* PAGE STYLES */}
      <style>{`
        .followups-page {
          width: 100%;
          min-height: 100%;
          padding: 24px;
          box-sizing: border-box;
        }

        .followups-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
        }

        .followups-header h1 {
          margin: 0;
          color: #3A2A16;
          font-size: 30px;
          font-weight: 800;
        }

        .followups-header p {
          margin: 7px 0 0;
          color: #766653;
          font-size: 14px;
        }

        .followups-total-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 18px;
          border-radius: 14px;
          background: #FDFBD4;
          border: 1px solid #D4AF37;
          color: #3A2A16;
        }

        .followups-total-card strong {
          display: block;
          font-size: 20px;
          line-height: 1;
        }

        .followups-total-card span {
          display: block;
          margin-top: 4px;
          font-size: 12px;
          color: #766653;
        }

        .followups-summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 22px;
        }

        .summary-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          background: #ffffff;
          border: 1px solid #eadfca;
          border-radius: 16px;
          box-shadow: 0 4px 14px rgba(58, 42, 22, 0.05);
        }

        .summary-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #FDFBD4;
          color: #CE8946;
        }

        .summary-card span {
          display: block;
          font-size: 12px;
          color: #766653;
        }

        .summary-card strong {
          display: block;
          margin-top: 3px;
          color: #3A2A16;
          font-size: 23px;
        }

        .followups-toolbar {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .followups-search {
          width: 100%;
          max-width: 480px;
          height: 46px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          box-sizing: border-box;
          background: #ffffff;
          border: 1px solid #ded3c0;
          border-radius: 12px;
          color: #8b795f;
        }

        .followups-search:focus-within {
          border-color: #D4AF37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.12);
        }

        .followups-search input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: none;
          background: transparent;
          color: #3A2A16;
          font-size: 14px;
        }

        .followups-search input::placeholder {
          color: #a79a88;
        }

        .clear-search {
          width: 28px;
          height: 28px;
          border: 0;
          background: transparent;
          color: #8b795f;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
        }

        .clear-search:hover {
          background: #FDFBD4;
        }

        .followups-tabs {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
          padding-bottom: 2px;
          overflow-x: auto;
        }

        .followup-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 15px;
          border: 1px solid #ded3c0;
          border-radius: 10px;
          background: #ffffff;
          color: #6f604f;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .followup-tab:hover {
          border-color: #D4AF37;
        }

        .followup-tab.active {
          background: #3A2A16;
          border-color: #3A2A16;
          color: #ffffff;
        }

        .tab-count {
          min-width: 20px;
          height: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 5px;
          box-sizing: border-box;
          border-radius: 20px;
          background: #FDFBD4;
          color: #3A2A16;
          font-size: 11px;
          font-weight: 700;
        }

        .followup-tab.active .tab-count {
          background: #D4AF37;
          color: #3A2A16;
        }

        .followups-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .followup-card {
          display: flex;
          gap: 17px;
          padding: 20px;
          background: #ffffff;
          border: 1px solid #eadfca;
          border-radius: 17px;
          box-shadow: 0 4px 14px rgba(58, 42, 22, 0.045);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .followup-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 7px 20px rgba(58, 42, 22, 0.08);
        }

        .followup-avatar {
          width: 52px;
          height: 52px;
          min-width: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #3A2A16;
          color: #FDFBD4;
          border: 2px solid #D4AF37;
          font-size: 21px;
          font-weight: 800;
        }

        .followup-main {
          flex: 1;
          min-width: 0;
        }

        .followup-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
        }

        .followup-title-row h3 {
          margin: 0;
          color: #3A2A16;
          font-size: 18px;
          font-weight: 750;
        }

        .followup-company {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 5px;
          color: #766653;
          font-size: 13px;
        }

        .followup-status {
          flex-shrink: 0;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 750;
        }

        .followup-status.completed {
          background: #e6f4e9;
          color: #28623a;
        }

        .followup-status.missed {
          background: #fce7e3;
          color: #9b3b2d;
        }

        .followup-status.due {
          background: #fff1d6;
          color: #9a641b;
        }

        .followup-status.upcoming {
          background: #eaf3fa;
          color: #496580;
        }

        .followup-details {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 15px;
        }

        .followup-detail {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #665846;
          font-size: 13px;
        }

        .followup-detail svg {
          color: #CE8946;
        }

        .followup-purpose {
          margin-top: 13px;
          padding: 11px 13px;
          background: #FDFBD4;
          border-radius: 10px;
          color: #6b5b49;
          font-size: 13px;
        }

        .followup-purpose span {
          margin-right: 5px;
        }

        .followup-purpose strong {
          color: #3A2A16;
          font-weight: 650;
        }

        .followup-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-top: 14px;
        }

        .priority {
          display: inline-flex;
          align-items: center;
          padding: 5px 9px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
        }

        .priority.high {
          background: #fce7e3;
          color: #9b3b2d;
        }

        .priority.medium {
          background: #fff1d6;
          color: #9a641b;
        }

        .priority.low {
          background: #e8f2e8;
          color: #3e6b42;
        }

        .followup-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .secondary-action,
        .primary-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 36px;
          padding: 0 12px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .secondary-action {
          border: 1px solid #d9cbb5;
          background: #ffffff;
          color: #5d4d3c;
        }

        .secondary-action:hover {
          border-color: #D4AF37;
          background: #FDFBD4;
        }

        .primary-action {
          border: 1px solid #3A2A16;
          background: #3A2A16;
          color: #ffffff;
        }

        .primary-action:hover {
          background: #CE8946;
          border-color: #CE8946;
        }

        .followups-empty {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px;
          background: #ffffff;
          border: 1px dashed #d9cbb5;
          border-radius: 17px;
          color: #9b8c78;
        }

        .followups-empty h3 {
          margin: 15px 0 5px;
          color: #3A2A16;
          font-size: 18px;
        }

        .followups-empty p {
          margin: 0;
          color: #827361;
          font-size: 13px;
        }

        .loading-icon {
          animation: followup-spin 1s linear infinite;
        }

        @keyframes followup-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(58, 42, 22, 0.45);
        }

        .reschedule-modal {
          width: 100%;
          max-width: 450px;
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 20px 60px rgba(58, 42, 22, 0.25);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
          padding: 20px 22px;
          border-bottom: 1px solid #eadfca;
        }

        .modal-header h2 {
          margin: 0;
          color: #3A2A16;
          font-size: 20px;
        }

        .modal-header p {
          margin: 5px 0 0;
          color: #766653;
          font-size: 12px;
        }

        .modal-close {
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 8px;
          background: #FDFBD4;
          color: #3A2A16;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          background: #BDB76B;
        }

        .reschedule-modal form {
          padding: 22px;
        }

        .form-group {
          margin-bottom: 17px;
        }

        .form-group label {
          display: block;
          margin-bottom: 7px;
          color: #3A2A16;
          font-size: 13px;
          font-weight: 700;
        }

        .input-with-icon {
          height: 44px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 12px;
          box-sizing: border-box;
          border: 1px solid #d9cbb5;
          border-radius: 10px;
          color: #CE8946;
        }

        .input-with-icon:focus-within {
          border-color: #D4AF37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.12);
        }

        .input-with-icon input {
          width: 100%;
          border: 0;
          outline: none;
          background: transparent;
          color: #3A2A16;
          font-size: 14px;
        }

        .reschedule-note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-top: 4px;
          margin-bottom: 20px;
          padding: 11px 12px;
          border-radius: 10px;
          background: #FDFBD4;
          color: #6b5b49;
          font-size: 12px;
          line-height: 1.5;
        }

        .reschedule-note svg {
          flex-shrink: 0;
          margin-top: 1px;
          color: #CE8946;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 9px;
        }

        .cancel-button,
        .save-button {
          min-height: 40px;
          padding: 0 15px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
        }

        .cancel-button {
          border: 1px solid #d9cbb5;
          background: #ffffff;
          color: #5d4d3c;
        }

        .save-button {
          border: 1px solid #3A2A16;
          background: #3A2A16;
          color: #ffffff;
        }

        .save-button:hover {
          background: #CE8946;
          border-color: #CE8946;
        }

        .cancel-button:disabled,
        .save-button:disabled,
        .modal-close:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        @media (max-width: 1000px) {
          .followups-summary {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .followups-page {
            padding: 16px;
          }

          .followups-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .followups-total-card {
            width: 100%;
            box-sizing: border-box;
          }

          .followups-summary {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .summary-card {
            padding: 13px;
          }

          .summary-icon {
            width: 38px;
            height: 38px;
          }

          .followup-card {
            padding: 15px;
          }

          .followup-title-row {
            flex-direction: column;
          }

          .followup-bottom-row {
            align-items: flex-start;
            flex-direction: column;
          }

          .followup-actions {
            width: 100%;
          }

          .secondary-action,
          .primary-action {
            flex: 1;
          }
        }

        @media (max-width: 480px) {
          .followups-summary {
            grid-template-columns: 1fr;
          }

          .followup-card {
            gap: 12px;
          }

          .followup-avatar {
            width: 44px;
            height: 44px;
            min-width: 44px;
            font-size: 18px;
          }

          .followup-details {
            flex-direction: column;
            gap: 8px;
          }

          .followup-actions {
            flex-direction: column;
          }

          .secondary-action,
          .primary-action {
            width: 100%;
          }

          .modal-actions {
            flex-direction: column-reverse;
          }

          .cancel-button,
          .save-button {
            width: 100%;
          }
        }
      `}</style>

    </div>
  );
};

export default FollowUps;