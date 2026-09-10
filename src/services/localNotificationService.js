import { LocalNotifications } from '@capacitor/local-notifications';

const CHANNEL_ID = 'placement-hr-reminders';

const getNotificationId = (id) => {
  const numericId = Number(
    String(id || '').replace(/\D/g, '').slice(-8)
  );

  if (numericId > 0) {
    return numericId;
  }

  return Math.floor(Math.random() * 90000000) + 10000000;
};

export const localNotificationService = {

  // =========================================================
  // REQUEST NOTIFICATION PERMISSION
  // =========================================================

  requestPermission: async () => {
    try {

      const permission =
        await LocalNotifications.requestPermissions();

      console.log(
        'Notification permission:',
        permission.display
      );

      return permission.display === 'granted';

    } catch (error) {

      console.error(
        'Notification permission error:',
        error
      );

      return false;
    }
  },


  // =========================================================
  // CREATE ANDROID NOTIFICATION CHANNEL
  // =========================================================

  createChannel: async () => {
    try {

      await LocalNotifications.createChannel({

        id: CHANNEL_ID,

        name: 'Placement HR Reminders',

        description:
          'Follow-up reminders for HR contacts',

        importance: 5,

        visibility: 1,

        sound: 'default',

        vibration: true

      });

      console.log(
        'Placement HR notification channel created.'
      );

    } catch (error) {

      console.error(
        'Notification channel error:',
        error
      );

    }
  },


  // =========================================================
  // INITIALIZE NOTIFICATIONS
  // =========================================================

  initialize: async () => {
    try {

      const granted =
        await localNotificationService.requestPermission();

      if (!granted) {

        console.log(
          'Notification permission was not granted.'
        );

        return false;
      }


      await localNotificationService.createChannel();


      return true;

    } catch (error) {

      console.error(
        'Notification initialization error:',
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

      // -------------------------------------------------------
      // Make sure notifications are initialized
      // -------------------------------------------------------

      const initialized =
        await localNotificationService.initialize();


      if (!initialized) {

        throw new Error(
          'Notification permission was not granted.'
        );

      }


      // -------------------------------------------------------
      // Validate date
      // -------------------------------------------------------

      if (!date) {

        throw new Error(
          'Reminder date is required.'
        );

      }


      // -------------------------------------------------------
      // Validate time
      // -------------------------------------------------------

      if (!time) {

        throw new Error(
          'Reminder time is required.'
        );

      }


      // -------------------------------------------------------
      // Create JavaScript Date
      // -------------------------------------------------------

      const notificationDate =
        new Date(`${date}T${time}`);


      if (
        Number.isNaN(
          notificationDate.getTime()
        )
      ) {

        throw new Error(
          'Invalid reminder date or time.'
        );

      }


      // -------------------------------------------------------
      // Don't schedule past reminders
      // -------------------------------------------------------

      if (
        notificationDate.getTime() <= Date.now()
      ) {

        console.log(
          'Reminder date/time is in the past.'
        );

        return null;

      }


      // -------------------------------------------------------
      // Generate stable notification ID
      // -------------------------------------------------------

      const notificationId =
        getNotificationId(id);


      // -------------------------------------------------------
      // Schedule Android notification
      // -------------------------------------------------------

      await LocalNotifications.schedule({

        notifications: [

          {

            id: notificationId,

            title:
              'Placement HR Reminder',

            body:
              `Follow-up with ${hrName || 'HR'}${
                companyName
                  ? ` - ${companyName}`
                  : ''
              }`,

            schedule: {

              at: notificationDate,

              allowWhileIdle: true

            },

            channelId:
              CHANNEL_ID,

            smallIcon:
              'ic_stat_icon_config_sample',

            sound:
              'default',

            actionTypeId:
              '',

            extra: {

              followUpId:
                String(id || ''),

              hrName:
                hrName || '',

              companyName:
                companyName || '',

              date:
                date,

              time:
                time

            }

          }

        ]

      });


      console.log(
        'Android reminder scheduled:',
        {
          notificationId,
          followUpId: id,
          date,
          time
        }
      );


      return notificationId;


    } catch (error) {

      console.error(
        'Schedule reminder error:',
        error
      );

      throw error;

    }

  },


  // =========================================================
  // CANCEL ONE REMINDER
  // =========================================================

  cancelReminder: async (id) => {

    try {

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
        'Android reminder cancelled:',
        notificationId
      );


    } catch (error) {

      console.error(
        'Cancel reminder error:',
        error
      );

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
        !pending.notifications.length
      ) {

        return;

      }


      await LocalNotifications.cancel({

        notifications:
          pending.notifications.map(
            (notification) => ({

              id: notification.id

            })
          )

      });


      console.log(
        'All Android reminders cancelled.'
      );


    } catch (error) {

      console.error(
        'Cancel all reminders error:',
        error
      );

    }

  },


  // =========================================================
  // GET PENDING REMINDERS
  // =========================================================

  getPendingReminders: async () => {

    try {

      const result =
        await LocalNotifications.getPending();


      return (
        result.notifications || []
      );


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