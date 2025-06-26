import React, { useState, useEffect } from 'react';
import { useNotification } from '../../hooks/NotificationContext';
import { FaTimes } from 'react-icons/fa';

function NotificationItem({ notification, removeNotification }) {
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFading(true);
            setTimeout(() => removeNotification(notification.id), 500);
        }, notification.duration || 6000);
        return () => clearTimeout(timer);
    }, [notification, removeNotification]);

    const handleRemove = () => {
        setFading(true);
        setTimeout(() => removeNotification(notification.id), 500);
    };

    const getNotificationClasses = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-100 text-green-800 border border-green-300';
            case 'error':
                return 'bg-red-100 text-red-800 border border-red-300';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
            case 'info':
            default:
                return 'bg-blue-100 text-blue-800 border border-blue-300';
        }
    };

    return (
        <div
            className={
                `${getNotificationClasses(notification.type)} p-3 rounded-lg shadow-md mb-2 flex items-center justify-between transition-opacity duration-500 ` +
                (fading ? 'opacity-0' : 'opacity-100')
            }
        >
            <div>
                <p className="font-bold capitalize">{notification.type}:</p>
                <p className="text-sm">{notification.message}</p>
            </div>
            <button
                onClick={handleRemove}
                className="ml-4 text-white hover:text-gray-200 focus:outline-none"
            >
                <FaTimes />
            </button>
        </div>
    );
}

export default function NotificationDisplay() {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="fixed z-50 bottom-4 right-4 w-80">
            {notifications.map(notification => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    removeNotification={removeNotification}
                />
            ))}
        </div>
    );
} 