import { supabase } from '../lib/supabaseClient';

const convertHR = (hr) => {
  if (!hr) return null;

  return {
    id: hr.id,

    // Keep both IDs available
    userId: hr.user_id,
    placementOfficerId: hr.placement_officer_id,

    name: hr.name || '',
    companyName: hr.company_name || '',
    designation: hr.designation || '',
    phone: hr.phone || '',
    email: hr.email || '',

    status: hr.status || 'Active',

    lastContactDate: hr.last_contact_date || null,
    nextFollowUpDate: hr.next_follow_up_date || null,

    avatar: hr.avatar || null,

    companyInfo: {
      studentsRequired: hr.students_required ?? null,
      location: hr.location || ''
    },

    createdAt: hr.created_at,
    updatedAt: hr.updated_at
  };
};

export const hrService = {

  // =========================================================
  // GET ALL HR CONTACTS FOR LOGGED-IN PLACEMENT OFFICER
  // =========================================================
  getAll: async (search = '', status = 'All') => {

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error('User is not logged in.');
    }

    let query = supabase
      .from('hr_contacts')
      .select('*')
      .eq('placement_officer_id', user.id)
      .order('created_at', {
        ascending: false
      });

    if (status && status !== 'All') {
      query = query.eq('status', status);
    }

    const {
      data,
      error
    } = await query;

    if (error) {
      console.error(
        'Failed to load HR contacts:',
        error
      );

      throw error;
    }

    let result = (data || []).map(convertHR);

    // =======================================================
    // SEARCH
    // =======================================================

    if (search && search.trim()) {

      const searchText =
        search.trim().toLowerCase();

      result = result.filter((hr) =>
        (hr.name || '')
          .toLowerCase()
          .includes(searchText) ||

        (hr.companyName || '')
          .toLowerCase()
          .includes(searchText) ||

        (hr.designation || '')
          .toLowerCase()
          .includes(searchText) ||

        (hr.phone || '')
          .toLowerCase()
          .includes(searchText) ||

        (hr.email || '')
          .toLowerCase()
          .includes(searchText)
      );
    }

    return result;
  },


  // =========================================================
  // GET HR BY ID
  // =========================================================
  getById: async (id) => {

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error('User is not logged in.');
    }

    const {
      data,
      error
    } = await supabase
      .from('hr_contacts')
      .select('*')
      .eq('id', id)
      .eq('placement_officer_id', user.id)
      .single();

    if (error) {
      throw error;
    }

    return convertHR(data);
  },


  // =========================================================
  // CREATE HR
  // =========================================================
  create: async (hrData) => {

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error(
        'You must be logged in to add an HR contact.'
      );
    }

    const newHR = {
      user_id: user.id,
      placement_officer_id: user.id,

      name: hrData.name || '',
      company_name: hrData.companyName || '',
      designation: hrData.designation || '',
      phone: hrData.phone || '',
      email: hrData.email || '',

      status: hrData.status || 'Active',

      last_contact_date:
        hrData.lastContactDate || null,

      next_follow_up_date:
        hrData.nextFollowUpDate || null,

      students_required:
        hrData.companyInfo?.studentsRequired ??
        hrData.studentsRequired ??
        null,

      location:
        hrData.companyInfo?.location ??
        hrData.location ??
        null,

      avatar:
        hrData.avatar || null
    };

    const {
      data,
      error
    } = await supabase
      .from('hr_contacts')
      .insert(newHR)
      .select()
      .single();

    if (error) {

      console.error(
        'Supabase HR insert error:',
        error
      );

      throw error;
    }

    return convertHR(data);
  },


  // =========================================================
  // UPDATE HR
  // =========================================================
  update: async (id, hrData) => {

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error('User is not logged in.');
    }

    const updatedHR = {

      name: hrData.name || '',
      company_name:
        hrData.companyName || '',
      designation:
        hrData.designation || '',
      phone:
        hrData.phone || '',
      email:
        hrData.email || '',

      status:
        hrData.status || 'Active',

      last_contact_date:
        hrData.lastContactDate || null,

      next_follow_up_date:
        hrData.nextFollowUpDate || null,

      students_required:
        hrData.companyInfo?.studentsRequired ??
        hrData.studentsRequired ??
        null,

      location:
        hrData.companyInfo?.location ??
        hrData.location ??
        null,

      avatar:
        hrData.avatar || null,

      updated_at:
        new Date().toISOString()
    };

    const {
      data,
      error
    } = await supabase
      .from('hr_contacts')
      .update(updatedHR)
      .eq('id', id)
      .eq('placement_officer_id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return convertHR(data);
  },


  // =========================================================
  // DELETE HR
  // =========================================================
  delete: async (id) => {

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    if (!user) {
      throw new Error('User is not logged in.');
    }

    const {
      error
    } = await supabase
      .from('hr_contacts')
      .delete()
      .eq('id', id)
      .eq('placement_officer_id', user.id);

    if (error) {
      throw error;
    }

    return {
      success: true,
      id
    };
  }
};