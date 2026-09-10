import { supabase } from '../lib/supabaseClient';

export const dashboardService = {
  // =========================================================
  // GET DASHBOARD STATISTICS
  // =========================================================
  getStats: async () => {
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

      const todayFollowUps = hrs.filter(
        (hr) =>
          hr.next_follow_up_date ===
          today
      );

      const upcomingFollowUps = hrs.filter(
        (hr) =>
          hr.next_follow_up_date &&
          hr.next_follow_up_date > today
      );

      const missedFollowUps = hrs.filter(
        (hr) =>
          hr.next_follow_up_date &&
          hr.next_follow_up_date < today
      );

      const activeCompanies = new Set(
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

      const pendingResponses =
        hrs.filter(
          (hr) =>
            String(
              hr.status || ''
            ).toLowerCase() ===
            'pending'
        );

      const completedActivities =
        hrs.filter(
          (hr) =>
            String(
              hr.status || ''
            ).toLowerCase() ===
            'completed'
        );

      const stats = {
        todayFollowUps:
          todayFollowUps.length,

        upcomingFollowUps:
          upcomingFollowUps.length,

        missedFollowUps:
          missedFollowUps.length,

        totalHRContacts:
          hrs.length,

        activeCompanies:
          activeCompanies.size,

        pendingResponses:
          pendingResponses.length,

        completedActivities:
          completedActivities.length
      };

      console.log(
        'Dashboard statistics from Supabase:',
        stats
      );

      return stats;
    } catch (error) {
      console.error(
        'Failed to load dashboard statistics:',
        error
      );

      throw error;
    }
  },

  // =========================================================
  // GET RECENT ACTIVITIES
  // =========================================================
  getRecentActivities: async (
    limit = 5
  ) => {
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
        .eq('placement_officer_id', user.id)
        .order('updated_at', {
          ascending: false
        })
        .limit(limit);

      if (error) {
        throw error;
      }

      return (data || []).map((hr) => ({
        id: hr.id,
        hrId: hr.id,
        hrName: hr.name || '',
        companyName:
          hr.company_name || '',
        status: hr.status || '',
        date:
          hr.last_contact_date ||
          hr.updated_at?.split('T')[0] ||
          '',
        updatedAt: hr.updated_at
      }));
    } catch (error) {
      console.error(
        'Failed to load recent activities:',
        error
      );

      throw error;
    }
  },

  // =========================================================
  // GET DASHBOARD DATA
  // =========================================================
  getDashboardData: async () => {
    try {
      const [
        stats,
        recentActivities
      ] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivities()
      ]);

      return {
        ...stats,
        recentActivities
      };
    } catch (error) {
      console.error(
        'Failed to load dashboard data:',
        error
      );

      throw error;
    }
  }
};

export default dashboardService;