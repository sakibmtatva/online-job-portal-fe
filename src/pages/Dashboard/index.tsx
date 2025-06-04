import Layout from "../../components/LoggedInlayout/LoggedInLayout";
import CandidateOverview from "./CandidateOverview";
import EmployerOverview from "./EmployerOverview";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect } from "react";
import notificationService from "../../services/notification-service";
import { requestForToken } from "../../lib/firebase";

const Dashboard = () => {
  const role = useSelector(
    (state: RootState) => state.auth.currentUser?.user_type ?? "Candidate"
  );

  const setupNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission not granted');
        return;
      }

      const storedFcmToken = localStorage.getItem('fcmToken');
      if (storedFcmToken) {
        console.log('FCM token already exists in local storage');
        return;
      }

      const token = await requestForToken();
      if (!token) {
        console.error('Failed to generate FCM token');
        return;
      }

      await notificationService.addFcmToken(token);
      localStorage.setItem('fcmToken', token);
    } catch (error) {
      console.error('Notification setup error:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          if (isMounted) {
            console.log('Service Worker registered with scope:', registration.scope);
          }
        } catch (err) {
          if (isMounted) {
            console.error('Service Worker registration failed:', err);
          }
        }
        if (isMounted) {
          await setupNotifications();
        }
      }
    };

    registerServiceWorker();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return (
    <Layout>
      {role === "Candidate" ? <CandidateOverview /> : <EmployerOverview />}
    </Layout>
  );
};

export default Dashboard;
