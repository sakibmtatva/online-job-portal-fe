import { useEffect } from 'react';
import { onMessageListener } from '../lib/firebase';
// import { toast } from 'react-toastify';

export const useNotifications = () => {
  useEffect(() => {

    const messageListener = onMessageListener()
      .then((payload: unknown) => {
        const typedPayload = payload as {notification: {body: string}};
        // toast.info(typedPayload.notification?.body || '');
        if (!typedPayload) return;
        const notificationEvent = new CustomEvent('newNotification', {
        detail: typedPayload
      });
        window.dispatchEvent(notificationEvent);
      })
      .catch(console.error);

    return () => {
      messageListener.catch(() => {});
    };
  }, []);
};