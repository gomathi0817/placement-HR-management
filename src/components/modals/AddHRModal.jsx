import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const emptyForm = {
  name: '',
  companyName: '',
  designation: '',
  phone: '',
  email: '',
  status: 'Active',
  lastContactDate: '',
  nextFollowUpDate: '',
  studentsRequired: '',
  location: ''
};

export const AddHRModal = ({
  isOpen,
  onClose,
  editHR = null
}) => {
  const {
    addHR,
    updateHR
  } = useApp();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const isEditMode = Boolean(editHR);

  // =========================================================
  // LOAD EXISTING HR DETAILS WHEN EDITING
  // =========================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (editHR) {
      setForm({
        name: editHR.name || '',
        companyName: editHR.companyName || '',
        designation: editHR.designation || '',
        phone: editHR.phone || '',
        email: editHR.email || '',
        status: editHR.status || 'Active',
        lastContactDate: editHR.lastContactDate || '',
        nextFollowUpDate: editHR.nextFollowUpDate || '',
        studentsRequired:
          editHR.companyInfo?.studentsRequired ??
          editHR.studentsRequired ??
          '',
        location:
          editHR.companyInfo?.location ??
          editHR.location ??
          ''
      });
    } else {
      setForm(emptyForm);
    }

    setError('');
  }, [isOpen, editHR]);

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleClose = () => {
    if (saving) {
      return;
    }

    setError('');
    onClose();
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    // =======================================================
    // REQUIRED FIELD VALIDATION
    // Only these 5 fields are mandatory:
    // Company Name, HR Name, Designation, Phone, Location
    // =======================================================

    if (!form.companyName.trim()) {
      setError('Please enter company name.');
      return;
    }

    if (!form.name.trim()) {
      setError('Please enter HR name.');
      return;
    }

    if (!form.designation.trim()) {
      setError('Please enter designation.');
      return;
    }

    if (!form.phone.trim()) {
      setError('Please enter phone number.');
      return;
    }

    if (!form.location.trim()) {
      setError('Please enter company location.');
      return;
    }

    // =======================================================
    // PREPARE DATA
    // =======================================================

    const hrData = {
      name: form.name.trim(),

      companyName:
        form.companyName.trim(),

      designation:
        form.designation.trim(),

      phone:
        form.phone.trim(),

      // Email is optional
      email:
        form.email.trim() || null,

      // Status is optional
      status:
        form.status || null,

      // Last contact date is optional
      lastContactDate:
        form.lastContactDate || null,

      // Next follow-up date is optional
      nextFollowUpDate:
        form.nextFollowUpDate || null,

      // Students required is optional
      studentsRequired:
        form.studentsRequired !== ''
          ? Number(form.studentsRequired)
          : null,

      // Location is mandatory
      location:
        form.location.trim()
    };

    // =======================================================
    // SAVE
    // =======================================================

    try {
      setSaving(true);

      if (isEditMode) {
        await updateHR(
          editHR.id,
          hrData
        );
      } else {
        await addHR(
          hrData
        );
      }

      // =====================================================
      // RESET
      // =====================================================

      setForm(emptyForm);
      setError('');

      onClose();

    } catch (err) {
      console.error(
        isEditMode
          ? 'Error updating HR:'
          : 'Error adding HR:',
        err
      );

      setError(
        err?.message ||
        (
          isEditMode
            ? 'Unable to update HR contact.'
            : 'Unable to add HR contact.'
        )
      );

    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // MODAL CLOSED
  // =========================================================

  if (!isOpen) {
    return null;
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="flex items-center justify-between border-b p-5">

          <div>
            <h2 className="text-xl font-bold text-darkText">
              {isEditMode
                ? 'Edit HR Contact'
                : 'Add HR Contact'}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? 'Correct or update the HR representative details'
                : 'Enter the HR representative details'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-full p-2 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>

        {/* =================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >

          {/* HR NAME */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              HR Name *
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter HR name"
              disabled={saving}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100"
            />
          </div>

          {/* COMPANY */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Company Name *
            </label>

            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              disabled={saving}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100"
            />
          </div>

          {/* DESIGNATION */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Designation *
            </label>

            <input
              type="text"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              placeholder="Enter designation"
              disabled={saving}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100"
            />
          </div>

          {/* PHONE */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone *
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              disabled={saving}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100"
            />
          </div>

          {/* EMAIL - OPTIONAL */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter HR email"
              disabled={saving}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100"
            />
          </div>

          {/* STATUS - OPTIONAL */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100"
            >
              <option value="Active">
                Active
              </option>

              <option value="Waiting for Response">
                Waiting for Response
              </option>
            </select>
          </div>

          {/* LAST CONTACT - OPTIONAL */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Last Contact Date
            </label>

            <input
              type="date"
              name="lastContactDate"
              value={form.lastContactDate}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100"
            />
          </div>

          {/* NEXT FOLLOW UP - OPTIONAL */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Next Follow-Up Date
            </label>

            <input
              type="date"
              name="nextFollowUpDate"
              value={form.nextFollowUpDate}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100"
            />
          </div>

          {/* STUDENTS REQUIRED - OPTIONAL */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Students Required
            </label>

            <input
              type="number"
              min="0"
              name="studentsRequired"
              value={form.studentsRequired}
              onChange={handleChange}
              placeholder="Enter number of students"
              disabled={saving}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100"
            />
          </div>

          {/* LOCATION - MANDATORY */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Location *
            </label>

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter company location"
              disabled={saving}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100"
            />
          </div>

          {/* ERROR */}

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-5 py-2.5 text-darkText font-bold hover:bg-accent disabled:opacity-50 shadow transition-colors"
            >
              {saving
                ? 'Saving...'
                : isEditMode
                  ? 'Save Changes'
                  : 'Add HR Contact'}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};