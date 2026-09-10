import { supabase } from '../lib/supabaseClient';


// ---------------------------------------------------------
// Convert database time "14:30:00" → display time "2:30 PM"
// ---------------------------------------------------------
const formatTimeForDisplay = (time) => {
  if (!time) {
    return '10:30 AM';
  }

  const cleanTime = String(time).substring(0, 5);
  const parts = cleanTime.split(':');

  if (parts.length < 2) {
    return time;
  }

  const hours = Number(parts[0]);
  const minutes = parts[1];

  if (Number.isNaN(hours)) {
    return time;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${minutes} ${period}`;
};


// ---------------------------------------------------------
// Convert one HR contact into the format used by
// FollowUps.jsx
// ---------------------------------------------------------
const convertHRToFollowUp = (hr) => {
  if (!hr || !hr.next_follow_up_date) {
    return null;
  }

  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const todayString = `${year}-${month}-${day}`;

  const followUpDate = hr.next_follow_up_date;

  let status = 'Upcoming';

  if (followUpDate < todayString) {
    status = 'MISSED';
  } else if (followUpDate === todayString) {
    status = 'Follow-Up Due';
  }

  return {
    id: hr.id,

    hrId: hr.id,

    hrName: hr.name || 'Unknown HR',

    companyName:
      hr.company_name ||
      'Unknown Company',

    phone:
      hr.phone ||
      '',

    email:
      hr.email ||
      '',

    designation:
      hr.designation ||
      '',

    date: followUpDate,

    time: formatTimeForDisplay(
      hr.next_follow_up_time
    ),

    rawTime:
      hr.next_follow_up_time ||
      null,

    status,

    purpose:
      'Placement follow-up',

    priority:
      'Medium',

    studentsRequired:
      hr.students_required || 0,

    location:
      hr.location || '',

    originalHR: hr
  };
};


// =========================================================
// FOLLOW-UP SERVICE
// =========================================================

export const followUpService = {

  // -------------------------------------------------------
  // GET ALL FOLLOW-UPS
  // -------------------------------------------------------
  getAll: async (filter = '') => {

    // Get logged-in Supabase user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();


    if (userError) {
      console.error(
        'Get logged-in user error:',
        userError
      );

      throw userError;
    }


    if (!user) {
      throw new Error(
        'User is not logged in.'
      );
    }


    console.log(
      'FOLLOW-UP QUERY USER:',
      user.id
    );


    // -----------------------------------------------------
    // Get HR contacts belonging to this placement officer
    // -----------------------------------------------------
    let query = supabase
      .from('hr_contacts')
      .select('*')
      .eq(
        'placement_officer_id',
        user.id
      )
      .not(
        'next_follow_up_date',
        'is',
        null
      )
      .order(
        'next_follow_up_date',
        {
          ascending: true
        }
      )
      .order(
        'next_follow_up_time',
        {
          ascending: true
        }
      );


    // -----------------------------------------------------
    // Filter
    // -----------------------------------------------------
    if (filter) {

      const filterValue =
        String(filter).toLowerCase();


      const now = new Date();

      const year =
        now.getFullYear();

      const month =
        String(
          now.getMonth() + 1
        ).padStart(2, '0');

      const day =
        String(
          now.getDate()
        ).padStart(2, '0');

      const today =
        `${year}-${month}-${day}`;


      if (
        filterValue === 'missed'
      ) {

        query = query.lt(
          'next_follow_up_date',
          today
        );
      }


      if (
        filterValue === 'upcoming'
      ) {

        query = query.gte(
          'next_follow_up_date',
          today
        );
      }
    }


    // -----------------------------------------------------
    // Execute query
    // -----------------------------------------------------
    const {
      data,
      error
    } = await query;


    console.log(
      'FOLLOW-UP SUPABASE DATA:',
      data
    );

    console.log(
      'FOLLOW-UP SUPABASE ERROR:',
      error
    );


    if (error) {

      console.error(
        'Get follow-ups error:',
        error
      );

      throw error;
    }


    // -----------------------------------------------------
    // Convert database rows into FollowUps page format
    // -----------------------------------------------------
    const followUps = (data || [])
      .map(convertHRToFollowUp)
      .filter(Boolean);


    console.log(
      'FOLLOW-UPS RETURNED TO APP:',
      followUps
    );


    return followUps;
  },


  // -------------------------------------------------------
  // CREATE / SCHEDULE FOLLOW-UP
  // -------------------------------------------------------
  create: async (followUpData) => {

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();


    if (userError) {
      throw userError;
    }


    if (!user) {
      throw new Error(
        'User is not logged in.'
      );
    }


    if (!followUpData?.hrId) {
      throw new Error(
        'HR contact ID is required.'
      );
    }


    if (!followUpData?.date) {
      throw new Error(
        'Follow-up date is required.'
      );
    }


    const updateData = {

      next_follow_up_date:
        followUpData.date,

      next_follow_up_time:
        followUpData.time ||
        null
    };


    console.log(
      'SAVING FOLLOW-UP:',
      updateData
    );


    const {
      data,
      error
    } = await supabase
      .from('hr_contacts')
      .update(updateData)
      .eq(
        'id',
        followUpData.hrId
      )
      .eq(
        'placement_officer_id',
        user.id
      )
      .select()
      .single();


    if (error) {

      console.error(
        'Create follow-up error:',
        error
      );

      throw error;
    }


    console.log(
      'FOLLOW-UP SAVED:',
      data
    );


    return convertHRToFollowUp(data);
  },


  // -------------------------------------------------------
  // MARK FOLLOW-UP AS COMPLETED
  // -------------------------------------------------------
  markCompleted: async (id) => {

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();


    if (userError) {
      throw userError;
    }


    if (!user) {
      throw new Error(
        'User is not logged in.'
      );
    }


    const today =
      new Date()
        .toISOString()
        .split('T')[0];


    const {
      data,
      error
    } = await supabase
      .from('hr_contacts')
      .update({

        next_follow_up_date:
          null,

        next_follow_up_time:
          null,

        last_contact_date:
          today
      })
      .eq(
        'id',
        id
      )
      .eq(
        'placement_officer_id',
        user.id
      )
      .select()
      .single();


    if (error) {

      console.error(
        'Mark follow-up completed error:',
        error
      );

      throw error;
    }


    return data;
  },


  // -------------------------------------------------------
  // RESCHEDULE FOLLOW-UP
  // -------------------------------------------------------
  reschedule: async (
    id,
    date,
    time
  ) => {

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();


    if (userError) {
      throw userError;
    }


    if (!user) {
      throw new Error(
        'User is not logged in.'
      );
    }


    if (!date) {
      throw new Error(
        'Follow-up date is required.'
      );
    }


    const {
      data,
      error
    } = await supabase
      .from('hr_contacts')
      .update({

        next_follow_up_date:
          date,

        next_follow_up_time:
          time ||
          null
      })
      .eq(
        'id',
        id
      )
      .eq(
        'placement_officer_id',
        user.id
      )
      .select()
      .single();


    if (error) {

      console.error(
        'Reschedule follow-up error:',
        error
      );

      throw error;
    }


    return convertHRToFollowUp(data);
  },


  // -------------------------------------------------------
  // UPDATE FOLLOW-UP STATUS
  // -------------------------------------------------------
  updateStatus: async (
    id,
    status
  ) => {

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();


    if (userError) {
      throw userError;
    }


    if (!user) {
      throw new Error(
        'User is not logged in.'
      );
    }


    const {
      data,
      error
    } = await supabase
      .from('hr_contacts')
      .update({

        status:
          status || null
      })
      .eq(
        'id',
        id
      )
      .eq(
        'placement_officer_id',
        user.id
      )
      .select()
      .single();


    if (error) {

      console.error(
        'Update follow-up status error:',
        error
      );

      throw error;
    }


    return data;
  }

};