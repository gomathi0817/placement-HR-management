import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Phone, MessageCircle, Users, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { getTodayDateString, isDateInPast, isDateTimeInPast, formatNiceDate } from '../utils/dateUtils';

export const CalendarView = () => {
  const { followUps, interactions } = useApp();

  const todayStr = getTodayDateString();
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const todayObj = new Date();
  const [currentYear, setCurrentYear] = useState(todayObj.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(todayObj.getMonth()); // 0-indexed

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Check if navigating to previous month would be entirely in the past
  const isPrevMonthDisabled = () => {
    const prevMonthDate = new Date(currentYear, currentMonthIndex - 1, 1);
    const endOfPrevMonth = new Date(currentYear, currentMonthIndex, 0); // Last day of prev month
    const endOfPrevMonthStr = `${endOfPrevMonth.getFullYear()}-${String(endOfPrevMonth.getMonth() + 1).padStart(2, '0')}-${String(endOfPrevMonth.getDate()).padStart(2, '0')}`;
    return endOfPrevMonthStr < todayStr;
  };

  const handlePrevMonth = () => {
    if (isPrevMonthDisabled()) return;
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonthIndex(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonthIndex(prev => prev + 1);
    }
  };

  // Generate days matrix for current month
  const totalDaysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay(); // 0 = Sun

  const daysInMonth = Array.from({ length: totalDaysInMonth }, (_, i) => {
    const dayNum = (i + 1).toString().padStart(2, '0');
    const monthNum = (currentMonthIndex + 1).toString().padStart(2, '0');
    return `${currentYear}-${monthNum}-${dayNum}`;
  });

  const getEventsForDate = (dateStr) => {
    const matchedFollowUps = followUps.filter(f => f.date === dateStr);
    const matchedInteractions = interactions.filter(i => i.date === dateStr);
    return [...matchedFollowUps, ...matchedInteractions];
  };

  const selectedDayEvents = getEventsForDate(selectedDate);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-primary rounded-3xl p-6 shadow-card-custom">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-darkText">
            Placement Recruitment Calendar
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-darkText/70 mt-1">
            Visual recruitment schedule starting from current date <span className="font-extrabold text-darkText">({formatNiceDate(todayStr)})</span>.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2 bg-cream p-2 rounded-2xl border border-olive/50 font-bold text-xs text-darkText self-start sm:self-auto">
          <button
            onClick={handlePrevMonth}
            disabled={isPrevMonthDisabled()}
            title={isPrevMonthDisabled() ? "Past months are not accessible" : "Previous Month"}
            className={`p-1 rounded-lg transition-colors ${isPrevMonthDisabled() ? 'opacity-30 cursor-not-allowed' : 'hover:bg-olive/30'}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>{monthNames[currentMonthIndex]} {currentYear}</span>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-olive/30 rounded-lg transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white border-2 border-primary rounded-3xl p-5 sm:p-6 shadow-card-custom space-y-4">
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-black text-darkText uppercase pb-2 border-b border-olive/40">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <span key={d} className="py-1">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Empty offset padding days */}
            {[...Array(firstDayOfWeek)].map((_, idx) => (
              <div key={`blank-${idx}`} className="h-16 sm:h-20 bg-cream/40 rounded-xl opacity-20 pointer-events-none" />
            ))}

            {daysInMonth.map((dateStr) => {
              const dayNumber = parseInt(dateStr.split('-')[2], 10);
              const events = getEventsForDate(dateStr);
              const isSelected = selectedDate === dateStr;
              const isPast = isDateInPast(dateStr);
              const isToday = dateStr === todayStr;

              return (
                <button
                  key={dateStr}
                  disabled={isPast}
                  onClick={() => !isPast && setSelectedDate(dateStr)}
                  className={`
                    h-16 sm:h-20 p-1.5 rounded-2xl border flex flex-col justify-between text-left transition-all relative overflow-hidden group
                    ${isPast
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-40 select-none'
                      : isSelected
                        ? 'bg-primary text-darkText border-primary shadow-md ring-2 ring-olive'
                        : isToday
                          ? 'bg-accent/30 text-darkText border-primary font-bold shadow-xs'
                          : events.length > 0
                            ? 'bg-cream text-darkText border-olive hover:border-primary'
                            : 'bg-white text-darkText/70 border-olive/30 hover:bg-cream/40'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className={`
                      text-xs font-black px-1.5 py-0.5 rounded-md inline-block
                      ${isPast
                        ? 'bg-gray-200 text-gray-500 line-through'
                        : isSelected
                          ? 'bg-darkText text-cream'
                          : isToday
                            ? 'bg-primary text-darkText'
                            : 'bg-white/60'
                      }
                    `}>
                      {dayNumber}
                    </span>

                    {isPast && (
                      <Lock className="w-3 h-3 text-gray-400" title="Past date inaccessible" />
                    )}
                  </div>

                  {!isPast && events.length > 0 && (
                    <div className="space-y-0.5 mt-1">
                      {events.slice(0, 2).map((ev, i) => (
                        <div
                          key={i}
                          className={`
                            text-[9px] font-extrabold truncate px-1 rounded
                            ${isSelected
                              ? 'bg-darkText/20 text-darkText'
                              : ev.status === 'MISSED' || ev.status === 'Overdue'
                                ? 'bg-red-100 text-red-900'
                                : 'bg-primary text-darkText'
                            }
                          `}
                        >
                          {ev.hrName || ev.purpose}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <span className="text-[8px] font-bold block text-center opacity-80">
                          +{events.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Schedule Inspector */}
        <div className="bg-white border-2 border-primary rounded-3xl p-5 sm:p-6 shadow-card-custom flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-olive/40 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold text-darkText/70 uppercase tracking-wider block">
                  Activities For Date
                </span>
                <h3 className="font-extrabold text-base text-darkText">
                  {formatNiceDate(selectedDate)} {selectedDate === todayStr && '(Today)'}
                </h3>
              </div>

              <span className="bg-cream text-darkText font-bold text-xs px-3 py-1 rounded-full border border-olive/40">
                {selectedDayEvents.length} Schedule Items
              </span>
            </div>

            {selectedDayEvents.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <CalendarIcon className="w-10 h-10 text-primary mx-auto opacity-70" />
                <p className="text-xs font-bold text-darkText/70">
                  No activities scheduled for this date.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {selectedDayEvents.map((item, idx) => (
                  <div
                    key={idx}
                    className={`
                      p-3.5 rounded-2xl border space-y-2 text-xs
                      ${item.status === 'MISSED' ? 'bg-red-50 border-red-300 text-red-950' : 'bg-cream border-olive/40 text-darkText'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold">
                        {item.hrName} ({item.companyName})
                      </span>
                      <span className="font-bold text-[10px] bg-white px-2 py-0.5 rounded border border-olive/40">
                        {item.time || '10:30 AM'}
                      </span>
                    </div>

                    <p className="font-medium italic">
                      "{item.purpose || item.summary}"
                    </p>

                    <div className="text-[10px] font-bold flex items-center justify-between pt-1 border-t border-current/20">
                      <span className={`px-2 py-0.5 rounded font-extrabold ${item.status === 'MISSED' ? 'bg-red-200 text-red-900' : 'bg-white text-darkText'}`}>
                        Status: {item.status || 'Pending'}
                      </span>
                      <span className="uppercase">{item.priority || 'Medium'} Priority</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-olive/40">
            <span className="text-[11px] font-bold text-darkText/70 block text-center">
              Active Calendar • Previous dates restricted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
