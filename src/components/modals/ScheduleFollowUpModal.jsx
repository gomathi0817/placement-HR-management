import React, { useState } from 'react';
import {
  X,
  Clock,
  AlertCircle,
  Bell,
  Check
} from 'lucide-react';

import { useApp } from '../../context/AppContext';

import {
  getTodayDateString,
  isDateInPast,
  isDateTimeInPast
} from '../../utils/dateUtils';


// Convert 24-hour time to 12-hour display
const formatTimeTo12Hour = (hour, minute, period) => {
  const h = String(hour).padStart(2, '0');
  const m = String(minute).padStart(2, '0');

  return `${h}:${m} ${period}`;
};


// Convert selected hour + minute + period to 24-hour format
const convertTo24Hour = (
  hour,
  minute,
  period
) => {
  let convertedHour = hour;

  if (period === 'AM') {
    if (hour === 12) {
      convertedHour = 0;
    }
  } else {
    if (hour !== 12) {
      convertedHour = hour + 12;
    }
  }

  return `${String(convertedHour).padStart(2, '0')}:${String(
    minute
  ).padStart(2, '0')}`;
};


const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];


const AlarmClockPicker = ({
  isOpen,
  initialHour,
  initialMinute,
  initialPeriod,
  onCancel,
  onConfirm
}) => {
  const [pickerMode, setPickerMode] = useState('hour');
  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);

  if (!isOpen) return null;

  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
    setPickerMode('minute');
  };

  const handleMinuteSelect = (minute) => {
    setSelectedMinute(minute);
  };

  const handleConfirm = () => {
    onConfirm({
      hour: selectedHour,
      minute: selectedMinute,
      period: selectedPeriod
    });
  };

  const getPosition = (index, total) => {
    const angle = (index * 360) / total - 90;
    const radius = 42;
    const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
    const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

    return {
      left: `${x}%`,
      top: `${y}%`
    };
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-[360px] bg-white rounded-[28px] border-2 border-primary shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-primary text-darkText px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">
              Set Follow-Up Time
            </p>
            <h3 className="text-xl font-black mt-1">
              {formatTimeTo12Hour(selectedHour, selectedMinute, selectedPeriod)}
            </h3>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="w-9 h-9 rounded-full bg-darkText/10 flex items-center justify-center hover:bg-darkText/20 text-darkText transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODE SELECTOR */}
        <div className="flex items-center justify-center gap-2 px-5 pt-5">
          <button
            type="button"
            onClick={() => setPickerMode('hour')}
            className={`
              px-5 py-2 rounded-full text-xs font-black transition-all
              ${pickerMode === 'hour' ? 'bg-primary text-darkText' : 'bg-cream text-darkText/70'}
            `}
          >
            HOUR
          </button>

          <button
            type="button"
            onClick={() => setPickerMode('minute')}
            className={`
              px-5 py-2 rounded-full text-xs font-black transition-all
              ${pickerMode === 'minute' ? 'bg-primary text-darkText' : 'bg-cream text-darkText/70'}
            `}
          >
            MINUTE
          </button>
        </div>

        {/* CLOCK */}
        <div className="p-5">
          <div className="relative mx-auto w-[270px] h-[270px] rounded-full bg-cream border-[7px] border-olive">
            {/* Center dot */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary z-20" />

            {/* Clock numbers */}
            {(pickerMode === 'hour' ? HOURS : MINUTES).map((number, index) => {
              const position = getPosition(index, 12);
              const isSelected = pickerMode === 'hour' ? number === selectedHour : number === selectedMinute;
              const displayNumber = pickerMode === 'minute' ? String(number).padStart(2, '0') : number;

              return (
                <button
                  key={number}
                  type="button"
                  onClick={() => {
                    if (pickerMode === 'hour') handleHourSelect(number);
                    else handleMinuteSelect(number);
                  }}
                  style={{ left: position.left, top: position.top }}
                  className={`
                    absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-sm font-black transition-all
                    ${isSelected ? 'bg-primary text-darkText shadow-lg scale-110' : 'text-darkText hover:bg-olive/30'}
                  `}
                >
                  {displayNumber}
                </button>
              );
            })}
          </div>

          {/* AM / PM */}
          <div className="flex justify-center gap-3 mt-5">
            <button
              type="button"
              onClick={() => setSelectedPeriod('AM')}
              className={`
                flex-1 max-w-[110px] py-3 rounded-xl border-2 text-sm font-black transition-all
                ${selectedPeriod === 'AM' ? 'bg-primary text-darkText border-primary' : 'bg-white text-darkText/70 border-olive'}
              `}
            >
              AM
            </button>

            <button
              type="button"
              onClick={() => setSelectedPeriod('PM')}
              className={`
                flex-1 max-w-[110px] py-3 rounded-xl border-2 text-sm font-black transition-all
                ${selectedPeriod === 'PM' ? 'bg-primary text-darkText border-primary' : 'bg-white text-darkText/70 border-olive'}
              `}
            >
              PM
            </button>
          </div>

          {/* SELECTED TIME */}
          <div className="mt-4 text-center text-xs font-bold text-darkText/70">
            Selected time:
            <span className="ml-1 text-darkText font-black">
              {formatTimeTo12Hour(selectedHour, selectedMinute, selectedPeriod)}
            </span>
          </div>
        </div>

        {/* FOOTER BUTTONS */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-xs font-black text-darkText/70 bg-cream border border-olive"
          >
            CANCEL
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl text-xs font-black bg-primary hover:bg-accent text-darkText flex items-center justify-center gap-2 transition-colors"
          >
            <Check className="w-4 h-4" />
            SET TIME
          </button>
        </div>
      </div>
    </div>
  );
};


export const ScheduleFollowUpModal = ({
  isOpen,
  onClose,
  defaultHrId = ''
}) => {
  const { hrs, scheduleFollowUp } = useApp();
  const todayStr = getTodayDateString();

  const [selectedHrId, setSelectedHrId] = useState(defaultHrId || (hrs[0] ? hrs[0].id : ''));
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState('10:30 AM');
  const [isClockOpen, setIsClockOpen] = useState(false);
  const [clockHour, setClockHour] = useState(10);
  const [clockMinute, setClockMinute] = useState(30);
  const [clockPeriod, setClockPeriod] = useState('AM');

  const [purpose, setPurpose] = useState('Discuss campus recruitment process');
  const [priority, setPriority] = useState('High');
  const [notes, setNotes] = useState('');
  const [enableReminder, setEnableReminder] = useState(true);
  const [reminderLeadTime, setReminderLeadTime] = useState('15 minutes before');
  const [validationError, setValidationError] = useState('');

  const openClockPicker = () => {
    const match = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (match) {
      setClockHour(parseInt(match[1], 10));
      setClockMinute(parseInt(match[2], 10));
      setClockPeriod(match[3].toUpperCase());
    }
    setIsClockOpen(true);
  };

  const confirmClockTime = ({ hour, minute, period }) => {
    const formattedTime = formatTimeTo12Hour(hour, minute, period);
    setClockHour(hour);
    setClockMinute(minute);
    setClockPeriod(period);
    setTime(formattedTime);
    setIsClockOpen(false);
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!currentHR) {
      setValidationError('Please select an HR contact.');
      return;
    }

    if (!purpose.trim()) {
      setValidationError('Purpose is required.');
      return;
    }

    if (!date) {
      setValidationError('Please select a follow-up date.');
      return;
    }

    if (!time) {
      setValidationError('Please select a follow-up time.');
      return;
    }

    if (isDateInPast(date)) {
      setValidationError('Follow-up date cannot be in the past.');
      return;
    }

    if (isDateTimeInPast(date, time)) {
      setValidationError('Follow-up date and time cannot be in the past.');
      return;
    }

    try {
      await scheduleFollowUp({
        hrId: currentHR.id,
        hrName: currentHR.name,
        companyName: currentHR.companyName,
        date,
        time,
        purpose,
        priority,
        notes: notes + (enableReminder ? ` [Reminder: ${reminderLeadTime}]` : '')
      });

      onClose();
    } catch (err) {
      console.error('Schedule follow-up error:', err);
      setValidationError(err?.message || 'Unable to schedule follow-up. Please try again.');
    }
  };

  const currentHR = hrs.find((h) => h.id === selectedHrId) || hrs[0];

  const leadTimes = [
    'At scheduled time',
    '15 minutes before',
    '30 minutes before',
    '1 hour before',
    '1 day before'
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
        <div className="bg-white border-2 border-primary rounded-3xl max-w-md w-full overflow-hidden shadow-modal-custom flex flex-col">
          {/* HEADER */}
          <div className="bg-primary text-darkText p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-darkText text-cream flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Schedule Follow-Up</h3>
                <span className="text-[11px] text-darkText/80 font-medium">Set reminder & priority alert</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-darkText/10 text-darkText flex items-center justify-center hover:bg-darkText/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto bg-cream/40 flex-1">
            {validationError && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-900 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-700" />
                <span>{validationError}</span>
              </div>
            )}

            {/* HR CONTACT */}
            <div>
              <label className="block text-xs font-bold text-darkText mb-1">Select HR Contact</label>
              <select
                value={selectedHrId}
                onChange={(e) => {
                  setSelectedHrId(e.target.value);
                  setValidationError('');
                }}
                className="w-full text-xs p-3 bg-white border border-olive/50 rounded-xl font-bold text-darkText outline-none"
              >
                {hrs.length === 0 ? (
                  <option value="">No HR contacts available</option>
                ) : (
                  hrs.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} — {h.companyName}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* DATE + TIME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-darkText mb-1">
                  Follow-Up Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setValidationError('');
                  }}
                  className="w-full text-xs p-3 bg-white border border-olive/50 rounded-xl outline-none font-bold text-darkText"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-darkText mb-1">
                  Follow-Up Time <span className="text-red-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={openClockPicker}
                  className="w-full p-3 bg-white border-2 border-olive/50 rounded-xl outline-none font-black text-darkText flex items-center justify-between hover:bg-cream transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-darkText/70" />
                    {time}
                  </span>
                  <span className="text-[10px] font-bold text-darkText/70">CHANGE</span>
                </button>
                <p className="mt-1 text-[10px] text-darkText/70 font-semibold">Tap to open clock picker</p>
              </div>
            </div>

            {/* PURPOSE */}
            <div>
              <label className="block text-xs font-bold text-darkText mb-1">
                Purpose / Goal <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Discuss campus recruitment process"
                value={purpose}
                onChange={(e) => {
                  setPurpose(e.target.value);
                  setValidationError('');
                }}
                className="w-full text-xs p-3 bg-white border border-olive/50 rounded-xl outline-none font-semibold text-darkText"
              />
            </div>

            {/* PRIORITY */}
            <div>
              <label className="block text-xs font-bold text-darkText mb-1">Priority Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['Low', 'Medium', 'High'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`
                      py-2 rounded-xl text-xs font-bold border transition-all
                      ${priority === p
                        ? p === 'High'
                          ? 'bg-red-600 text-white border-red-700 shadow-xs'
                          : p === 'Medium'
                            ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                            : 'bg-blue-600 text-white border-blue-700 shadow-xs'
                        : 'bg-white text-darkText/70 border-olive/50 hover:bg-cream'
                      }
                    `}
                  >
                    {p} Priority
                  </button>
                ))}
              </div>
            </div>

            {/* NOTES */}
            <div>
              <label className="block text-xs font-bold text-darkText mb-1">Additional Preparation Notes</label>
              <textarea
                rows={2}
                placeholder="Add any notes before the follow-up..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-olive/50 rounded-xl outline-none text-darkText"
              />
            </div>

            {/* REMINDER */}
            <div className="p-3 bg-white border border-olive/50 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-darkText" />
                  <span className="text-xs font-bold text-darkText">Enable Smart Alert Reminder</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableReminder}
                  onChange={(e) => setEnableReminder(e.target.checked)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
              </div>

              {enableReminder && (
                <div>
                  <label className="block text-[11px] font-semibold text-darkText/70 mb-1">
                    Reminder Lead-Time
                  </label>
                  <select
                    value={reminderLeadTime}
                    onChange={(e) => setReminderLeadTime(e.target.value)}
                    className="w-full text-xs p-2 bg-cream border border-olive rounded-lg font-bold text-darkText"
                  >
                    {leadTimes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-darkText/70 hover:text-darkText"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={hrs.length === 0}
                className="px-6 py-2.5 bg-primary hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-darkText font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
              >
                <Clock className="w-4 h-4" />
                <span>Schedule Follow-Up</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <AlarmClockPicker
        isOpen={isClockOpen}
        initialHour={clockHour}
        initialMinute={clockMinute}
        initialPeriod={clockPeriod}
        onCancel={() => setIsClockOpen(false)}
        onConfirm={confirmClockTime}
      />
    </>
  );
};

export default ScheduleFollowUpModal;