import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Check, CheckCheck, X } from "lucide-react";
import notificationService from "../services/notification-service";
import { useNavigate } from "react-router-dom";

interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data: {[key:string]:string};
}

interface NotificationCardProps {
  onClose: () => void;
}

const NotificationCard = ({ onClose }: NotificationCardProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(1, 20);
      const notificationData = response.data.data.notifications || [];
      setNotifications(notificationData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
      if(notification.data.type){
        if(notification.data.type === "candidate"){
          const id = notification.data.id ?? notification.data.candidateId;
          navigate(`/candidate/${id}`);
        } else if(notification.data.type === "job"){
          const id = notification.data.id ?? notification.data.jobId;
          navigate(`/jobdetails/${id}`);
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-80 md:w-96 max-h-[500px] overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-lg">Notifications</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs h-8 px-2"
            disabled={notifications.length === 0}
          >
            Mark all as read
          </Button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[400px]">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : notifications && notifications.length > 0 ? (
          notifications.map((notification) => {
            return (
              <div
                
                key={notification._id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-default ${
                  !notification.isRead ? "bg-blue-50 cursor-pointer" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {notification.isRead ? (
                      <CheckCheck className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
