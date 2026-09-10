import { supabase } from '../lib/supabaseClient';

export const analyticsService = {

  // =========================================================
  // GET ANALYTICS
  // =========================================================
  getAnalytics: async () => {
    try {
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

      const { data, error } = await supabase
        .from('hr_contacts')
        .select('*')
        .eq('placement_officer_id', user.id);

      if (error) {
        throw error;
      }

      const hrs = data || [];

      const today =
        new Date()
          .toISOString()
          .split('T')[0];

      // -------------------------------------------------------
      // BASIC COUNTS
      // -------------------------------------------------------

      const totalHRContacts = hrs.length;

      const companies = new Set(
        hrs
          .map((hr) =>
            String(
              hr.company_name || ''
            )
              .trim()
              .toLowerCase()
          )
          .filter(Boolean)
      );

      const totalCompanies =
        companies.size;

      const todayFollowUps =
        hrs.filter(
          (hr) =>
            hr.next_follow_up_date ===
            today
        ).length;

      const upcomingFollowUps =
        hrs.filter(
          (hr) =>
            hr.next_follow_up_date &&
            hr.next_follow_up_date > today
        ).length;

      const missedFollowUps =
        hrs.filter(
          (hr) =>
            hr.next_follow_up_date &&
            hr.next_follow_up_date < today
        ).length;

      // -------------------------------------------------------
      // STATUS COUNTS
      // -------------------------------------------------------

      const statusCounts = {};

      hrs.forEach((hr) => {
        const status =
          hr.status || 'Unknown';

        statusCounts[status] =
          (statusCounts[status] || 0) + 1;
      });

      // -------------------------------------------------------
      // LOCATION COUNTS
      // -------------------------------------------------------

      const locationCounts = {};

      hrs.forEach((hr) => {
        const location =
          hr.location || 'Unknown';

        locationCounts[location] =
          (locationCounts[location] || 0) + 1;
      });

      // -------------------------------------------------------
      // STUDENTS REQUIRED
      // -------------------------------------------------------

      const totalStudentsRequired =
        hrs.reduce(
          (total, hr) =>
            total +
            Number(
              hr.students_required || 0
            ),
          0
        );

      // -------------------------------------------------------
      // RECENT CONTACTS
      // -------------------------------------------------------

      const recentContacts = [...hrs]
        .sort(
          (a, b) =>
            new Date(
              b.updated_at ||
                b.created_at
            ) -
            new Date(
              a.updated_at ||
                a.created_at
            )
        )
        .slice(0, 10)
        .map((hr) => ({
          id: hr.id,
          hrName: hr.name || '',
          companyName:
            hr.company_name || '',
          designation:
            hr.designation || '',
          status: hr.status || '',
          location:
            hr.location || '',
          lastContactDate:
            hr.last_contact_date || '',
          nextFollowUpDate:
            hr.next_follow_up_date || '',
          studentsRequired:
            Number(
              hr.students_required || 0
            ),
          updatedAt:
            hr.updated_at ||
            hr.created_at
        }));

      // -------------------------------------------------------
      // ANALYTICS RESULT
      // -------------------------------------------------------

      const analytics = {
        totalHRContacts,
        totalCompanies,
        todayFollowUps,
        upcomingFollowUps,
        missedFollowUps,
        totalStudentsRequired,

        statusCounts,
        locationCounts,

        recentContacts,

        // Additional commonly used names
        hrContacts: totalHRContacts,
        companies: totalCompanies,
        studentsRequired:
          totalStudentsRequired
      };

      console.log(
        'Analytics loaded from Supabase:',
        analytics
      );

      return analytics;

    } catch (error) {
      console.error(
        'Failed to load analytics:',
        error
      );

      throw error;
    }
  }
};

export default analyticsService;