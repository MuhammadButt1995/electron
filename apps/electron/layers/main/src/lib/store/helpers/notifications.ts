/* eslint-disable import/prefer-default-export */
import NotificationHandler, {
  AppNotification,
} from '@notifications/NotificationHandler';
import { ConnectionState } from '@store/store';

const notificationHandler = new NotificationHandler();

export function wasConnectedNowNotConnectedNotif(
  notification: AppNotification
) {
  return (state: ConnectionState, prevState: ConnectionState) => {
    if (prevState === 'connected' && state === 'not_connected') {
      notificationHandler.addNotification(notification);
    }
  };
}
