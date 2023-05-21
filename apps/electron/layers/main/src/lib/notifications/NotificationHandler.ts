import { Notification as ElectronNotification, nativeImage } from 'electron';

export interface AppNotification {
  title: string;
  body: string;
  icon: Electron.NativeImage;
}

class NotificationHandler {
  private lastNotificationTime = 0;

  private debounceTime = 5000; // 5 seconds debounce time

  private queuedNotifications: AppNotification[] = [];

  private timer: NodeJS.Timeout | null = null;

  // eslint-disable-next-line class-methods-use-this
  showNotification({ title, body, icon }: AppNotification) {
    new ElectronNotification({
      title,
      body,
      icon,
    }).show();
  }

  showConnectedNotification() {
    this.addNotification({
      title: 'All systems go!',
      body: 'We are ready to work!',
      icon: nativeImage.createFromPath('path_to_your_image'),
    });
  }

  // eslint-disable-next-line class-methods-use-this
  showMultipleNotifications(count: number) {
    new ElectronNotification({
      title: 'Multiple changes detected',
      body: `${count} changes occurred. Please check your applications.`,
      icon: nativeImage.createFromPath('path_to_your_image'),
    }).show();
  }

  addNotification(notification: AppNotification) {
    const timeSinceLastNotification = Date.now() - this.lastNotificationTime;

    if (timeSinceLastNotification > this.debounceTime) {
      this.showNotification(notification);
      this.lastNotificationTime = Date.now();
    } else {
      this.queuedNotifications.push(notification);

      if (!this.timer) {
        this.timer = setTimeout(() => {
          if (this.queuedNotifications.length === 1) {
            this.showNotification(this.queuedNotifications[0]);
          } else {
            this.showMultipleNotifications(this.queuedNotifications.length);
          }
          this.queuedNotifications = [];
          this.timer = null;
        }, this.debounceTime - timeSinceLastNotification);
      }
    }
  }
}

export default NotificationHandler;
