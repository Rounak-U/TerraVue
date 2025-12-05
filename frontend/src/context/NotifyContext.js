import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import '../components/NotificationTray.css';

const NotificationContext = createContext({
    notify: () => {},
    success: () => {},
    error: () => {},
    info: () => {},
    warning: () => {}
});

const randomId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const NotificationViewport = ({ notifications, onDismiss }) => (
    <div className="notify-stack" aria-live="polite" aria-atomic="true">
        {notifications.map((note) => (
            <div key={note.id} className={`notify-card notify-${note.type}`}>
                <div className="notify-indicator" />
                <div className="notify-content">
                    <p className="notify-message">{note.message}</p>
                    {note.description && <p className="notify-description">{note.description}</p>}
                </div>
                <button
                    type="button"
                    className="notify-dismiss"
                    onClick={() => onDismiss(note.id)}
                    aria-label="Dismiss notification"
                >
                    ×
                </button>
            </div>
        ))}
    </div>
);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const timers = useRef(new Map());

    const clearTimer = useCallback((id) => {
        const timer = timers.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timers.current.delete(id);
        }
    }, []);

    const remove = useCallback((id) => {
        setNotifications((prev) => prev.filter((note) => note.id !== id));
        clearTimer(id);
    }, [clearTimer]);

    useEffect(() => () => {
        timers.current.forEach((timer) => clearTimeout(timer));
        timers.current.clear();
    }, []);

    const push = useCallback((message, options = {}) => {
        if (!message) return null;
        const id = randomId();
        const note = {
            id,
            message,
            description: options.description,
            type: options.type || 'info',
            duration: options.duration || 2800
        };

        setNotifications((prev) => {
            const next = [...prev, note];
            return next.slice(-3); // cap stack to 3 to keep things calm
        });

        const timeout = setTimeout(() => remove(id), note.duration);
        timers.current.set(id, timeout);
        return id;
    }, [remove]);

    const notifier = useMemo(() => ({
        notify: push,
        success: (message, options) => push(message, { ...options, type: 'success' }),
        error: (message, options) => push(message, { ...options, type: 'error', duration: options?.duration || 3400 }),
        info: (message, options) => push(message, { ...options, type: 'info' }),
        warning: (message, options) => push(message, { ...options, type: 'warning' })
    }), [push]);

    return (
        <NotificationContext.Provider value={notifier}>
            {children}
            <NotificationViewport notifications={notifications} onDismiss={remove} />
        </NotificationContext.Provider>
    );
};

export const useNotify = () => useContext(NotificationContext);
