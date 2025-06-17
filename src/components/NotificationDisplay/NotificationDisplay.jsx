import React from 'react';
import { useNotification } from '../../hooks/NotificationContext';
import { FaTimes } from 'react-icons/fa';

export default function NotificationDisplay() {
    const { notifications, removeNotification } = useNotification();

    const getNotificationClasses = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-gray-900';
            case 'info':
            default:
                return 'bg-blue-500 text-white';
        }
    };

    return (
        <div className="fixed z-50 bottom-4 right-4 w-80">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`${getNotificationClasses(notification.type)} p-3 rounded-lg shadow-md mb-2 flex items-center justify-between`}
                >
                    <div>
                        <p className="font-bold capitalize">{notification.type}:</p>
                        <p className="text-sm">{notification.message}</p>
                    </div>
                    <button
                        onClick={() => removeNotification(notification.id)}
                        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                    >
                        <FaTimes />
                    </button>
                </div>
            ))}
        </div>
    );
} 