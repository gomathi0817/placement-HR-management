import { supabase } from '../lib/supabaseClient';

export const notificationService = {
  // =========================================================
  // GET ALL NOTIFICATIONS
  // =========================================================
  getAll: async () => {
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
        .not('next_follow_up_date', 'is', null)
        .order('next_follow_up_date', {
          ascending: true
        })
        .order('next_follow_up_time', {
          ascending: true
        });

      if (error) {
        throw error;
      }

      const today =
        new Date()
          .toISOString()
          .split('T')[0];

      const notifications = (data || []).map(
        (hr) => {
          const followUpDate =
            hr.next_follow_up_date;

          let notificationType = 'upcoming';
          let message =
            `Follow-up with ${
              hr.name || 'HR'
            }`;

          if (followUpDate < today) {
            notificationType = 'missed';
            message =
              `Missed follow-up with ${
                hr.name || 'HR'
              }`;
          } else if (
            followUpDate === today
          ) {
            notificationType = 'today';
            message =
              `Today's follow-up with ${
                hr.name || 'HR'
              }`;
          }

          return {
            id: hr.id,
            hrId: hr.id,
            hrName: hr.name || '',
            companyName:
              hr.company_name || '',
            message,
            type: notificationType,
            date: followUpDate,
            time:
              hr.next_follow_up_time ||
              '',
            read: false,
            createdAt:
              hr.updated_at ||
              hr.created_at
          };
        }
      );

      console.log(
        'Notifications loaded from Supabase:',
        notifications
      );

      return notifications;
    } catch (error) {
      console.error(
        'Failed to load notifications:',
        error
      );

      throw error;
    }
  },

  // =========================================================
  // GET NOTIFICATION BY ID
  // =========================================================
  getById: async (id) => {
    try {
      if (!id) {
        throw new Error(
          'Notification ID is required.'
        );
      }

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
        .eq('id', id)
        .eq(
          'placement_officer_id',
          user.id
        )
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        hrId: data.id,
        hrName: data.name || '',
        companyName:
          data.company_name || '',
        message:
          `Follow-up with ${
            data.name || 'HR'
          }`,
        type: 'upcoming',
        date:
          data.next_follow_up_date || '',
        time:
          data.next_follow_up_time || '',
        read: false,
        createdAt:
          data.updated_at ||
          data.created_at
      };
    } catch (error) {
      console.error(
        'Failed to load notification:',
        error
      );

      throw error;
    }
  },

  // =========================================================
  // MARK NOTIFICATION AS READ
  // =========================================================
  markAsRead: async (id) => {
    try {
      if (!id) {
        throw new Error(
          'Notification ID is required.'
        );
      }

      /*
       * There is currently no separate notifications
       * table in Supabase.
       *
       * Therefore this operation is handled locally.
       * The actual follow-up data remains unchanged.
       */

      console.log(
        'Notification marked as read:',
        id
      );

      return {
        id,
        read: true
      };
    } catch (error) {
      console.error(
        'Failed to mark notification as read:',
        error
      );

      throw error;
    }
  },

  // =========================================================
  // MARK ALL NOTIFICATIONS AS READ
  // =========================================================
  markAllAsRead: async () => {
    try {
      console.log(
        'All notifications marked as read.'
      );

      return true;
    } catch (error) {
      console.error(
        'Failed to mark all notifications as read:',
        error
      );

      throw error;
    }
  },

  // =========================================================
  // DELETE NOTIFICATION
  // =========================================================
  delete: async (id) => {
    try {
      if (!id) {
        throw new Error(
          'Notification ID is required.'
        );
      }

      /*
       * Notifications are currently generated
       * from HR follow-up data.
       *
       * We do NOT delete the HR contact here.
       */

      console.log(
        'Notification dismissed:',
        id
      );

      return true;
    } catch (error) {
      console.error(
        'Failed to dismiss notification:',
        error
      );

      throw error;
    }
  }
};

export default notificationService;