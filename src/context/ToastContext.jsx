import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Sprout } from 'lucide-react';

const ToastContext = createContext(null);
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Set());
  const showToast = useCallback((message, duration = 3800) => {
    const id = crypto.randomUUID();
    setToasts(current => [...current.slice(-2), { id, message }]);
    const timer = setTimeout(() => {
      setToasts(current => current.filter(toast => toast.id !== id));
      timers.current.delete(timer);
    }, duration);
    timers.current.add(timer);
  }, []);
  useEffect(() => {
    const activeTimers = timers.current;
    return () => activeTimers.forEach(clearTimeout);
  }, []);
  return <ToastContext.Provider value={{ showToast }}>{children}<aside className="toast-stack" aria-live="polite" aria-atomic="true">{toasts.map(toast => <div key={toast.id} className="toast-message"><Sprout size={17} />{toast.message}</div>)}</aside></ToastContext.Provider>;
}
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}
