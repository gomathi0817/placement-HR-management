import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const notificationNativeService = {
  async requestPermission() {
    if (Capacitor.isNativePlatform()) {
      try {
        const status = await LocalNotifications.checkPermissions();
        if (status.display !== 'granted') {
          await LocalNotifications.requestPermissions();
        }
      } catch (e) {
        console.warn('Native notification permission error:', e);
      }
    } else if ('Notification' in window && Notification.permission !== 'granted') {
      try {
        await Notification.requestPermission();
      } catch (e) {}
    }
  },

  async scheduleNotification({ id, title, body, date }) {
    await this.requestPermission();

    if (Capacitor.isNativePlatform()) {
      try {
        const notifId = typeof id === 'number' ? id : Math.floor(Math.random() * 100000);
        await LocalNotifications.schedule({
          notifications: [
            {
              title,
              body,
              id: notifId,
              schedule: { at: date || new Date(Date.now() + 2000) },
              sound: 'beep.wav',
              attachments: null,
              actionTypeId: '',
              extra: null
            }
          ]
        });
      } catch (e) {
        console.warn('Failed to schedule native notification:', e);
      }
    } else if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: '/favicon.svg' });
      } catch (e) {}
    }
  }
};
