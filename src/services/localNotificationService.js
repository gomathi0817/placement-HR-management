import { LocalNotifications } from '@capacitor/local-notifications';

const CHANNEL_ID = 'placement-hr-reminders-v2';

/**
 * Convert a follow-up ID into a valid Android notification ID.
 */
const getNotificationId = (id) => {
  const numericId = String(id || '')
    .replace(/\D/g, '')
    .slice(0, 8);

  if (numericId) {
    return Math.max(1, Number(numericId));
  }

  // Stable fallback for IDs without numbers
  let hash = 0;

  String(id || '').split('').forEach((char) => {
    hash = ((hash << 5) - hash) + char.charCodeAt(0);
    hash |= 0;
  });

  return Math.abs(hash) % 2147483647 || 1;
};

const localNotificationService = {

  // =========================================================
  // INITIALIZE NOTIFICATIONS
  // =========================================================

  initialize: async () => {
    try {
      const permission =
        await LocalNotifications.requestPermissions();

      console.log(
        'Notification permission:',
        permission.display
      );

      if (permission.display !== 'granted') {
        console.warn(
          'Notification permission was not granted.'
        );

        return false;
      }

      // Create Android notification channel
      await LocalNotifications.createChannel({
        id: CHANNEL_ID,

        name: 'Placement HR Follow-up Reminders',

        description:
          'Notifications for HR follow-up reminders',

        importance: 5,

        visibility: 1,

        // Custom notification sound
        sound: 'placement_reminder',

        vibration: true
      });

      console.log(
        'Local notification service initialized with custom sound.'
      );

      return true;

    } catch (error) {

      console.error(
        'Local notification initialization error:',
        error
      );

      return false;
    }
  },

  // =========================================================
  // SCHEDULE FOLLOW-UP REMINDER
  // =========================================================

  scheduleReminder: async ({
    id,
    hrName,
    companyName,
    date,
    time
  }) => {

    try {

      if (!id || !date || !time) {
        console.warn(
          'Cannot schedule reminder: missing data.'
        );

        return false;
      }

      const notificationId =
        getNotificationId(id);

      const scheduledDate =
        new Date(`${date}T${time}`);

      // Do not schedule reminders in the past
      if (
        Number.isNaN(scheduledDate.getTime()) ||
        scheduledDate <= new Date()
      ) {
        console.warn(
          'Reminder date/time is in the past.'
        );

        return false;
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id: notificationId,

            title:
              'Placement Follow-up Reminder',

            body:
              `Follow up with ${hrName || 'HR contact'}${
                companyName
                  ? ` from ${companyName}`
                  : ''
              }.`,


            schedule: {
              at: scheduledDate,
              allowWhileIdle: true
            },

            channelId: CHANNEL_ID,

            smallIcon:
              'ic_stat_icon_config_sample',

            iconColor:
              '#D4AF37',

            extra: {
              followUpId: id,
              hrName: hrName || '',
              companyName: companyName || '',
              date: date || '',
              time: time || ''
            }
          }
        ]
      });

      console.log(
        'Reminder scheduled successfully:',
        {
          notificationId,
          hrName,
          companyName,
          date,
          time
        }
      );

      return true;

    } catch (error) {

      console.error(
        'Schedule reminder error:',
        error
      );

      return false;
    }
  },

  // =========================================================
  // CANCEL ONE REMINDER
  // =========================================================

  cancelReminder: async (id) => {

    try {

      if (!id) {
        return false;
      }

      const notificationId =
        getNotificationId(id);

      await LocalNotifications.cancel({
        notifications: [
          {
            id: notificationId
          }
        ]
      });

      console.log(
        'Reminder cancelled:',
        notificationId
      );

      return true;

    } catch (error) {

      console.error(
        'Cancel reminder error:',
        error
      );

      return false;
    }
  },

  // =========================================================
  // CANCEL ALL REMINDERS
  // =========================================================

  cancelAllReminders: async () => {

    try {

      const pending =
        await LocalNotifications.getPending();

      if (
        pending.notifications &&
        pending.notifications.length > 0
      ) {

        await LocalNotifications.cancel({
          notifications:
            pending.notifications.map(
              (notification) => ({
                id: notification.id
              })
            )
        });
      }

      console.log(
        'All reminders cancelled.'
      );

      return true;

    } catch (error) {

      console.error(
        'Cancel all reminders error:',
        error
      );

      return false;
    }
  },

  // =========================================================
  // GET PENDING REMINDERS
  // =========================================================

  getPendingReminders: async () => {

    try {

      const result =
        await LocalNotifications.getPending();

      return result.notifications || [];

    } catch (error) {

      console.error(
        'Get pending reminders error:',
        error
      );

      return [];
    }
  }
};

export default localNotificationService;