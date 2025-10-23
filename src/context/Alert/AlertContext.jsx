import { createContext, useState, useCallback, useEffect } from "react";

const AlertContext = createContext();

// Enhanced alert configuration with gradients and modern styling
const alertConfig = {
  success: {
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    border: "border-emerald-400/40",
    text: "text-emerald-900",
    icon: "text-emerald-600",
    glow: "shadow-emerald-500/20",
    progress: "bg-emerald-500",
  },
  error: {
    gradient: "from-rose-500/10 via-red-500/5 to-transparent",
    border: "border-rose-400/40",
    text: "text-rose-900",
    icon: "text-rose-600",
    glow: "shadow-rose-500/20",
    progress: "bg-rose-500",
  },
  warning: {
    gradient: "from-orange-500/10 via-amber-500/5 to-transparent",
    border: "border-orange-400/40",
    text: "text-orange-900",
    icon: "text-orange-600",
    glow: "shadow-orange-500/20",
    progress: "bg-orange-500",
  },
  info: {
    gradient: "from-sky-500/10 via-blue-500/5 to-transparent",
    border: "border-sky-400/40",
    text: "text-sky-900",
    icon: "text-sky-600",
    glow: "shadow-sky-500/20",
    progress: "bg-sky-500",
  },
};

// Modern icon components with smooth paths
const IconSuccess = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconError = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconWarning = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const IconInfo = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

const IconClose = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Icon mapper
const iconMap = {
  success: IconSuccess,
  error: IconError,
  warning: IconWarning,
  info: IconInfo,
};

// Progress bar component
const ProgressBar = ({ duration, config }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-2xl bg-black/5">
      <div
        className={`h-full ${config.progress} origin-left animate-progress`}
        style={{
          animation: `shrink ${duration}ms linear forwards`,
        }}
      />
    </div>
  );
};

// Main Alert Component
const Alert = ({ alert, onClose, duration }) => {
  const config = alertConfig[alert.type];
  const IconComponent = iconMap[alert.type];

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes shrink {
        from { transform: scaleX(1); }
        to { transform: scaleX(0); }
      }
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0) scale(1);
          opacity: 1;
        }
        to {
          transform: translateX(120%) scale(0.95);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      className="fixed top-6 right-6 z-[9999] max-w-md"
      style={{
        animation: "slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className={`
          relative overflow-hidden rounded-2xl border backdrop-blur-xl
          ${config.border} ${config.glow}
          bg-gradient-to-br ${config.gradient}
          shadow-2xl transition-all duration-300
          hover:shadow-3xl hover:scale-[1.02]
        `}
      >
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white to-transparent rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative flex items-start gap-4 p-5 pr-12">
          {/* Icon with animated background */}
          <div className="relative flex-shrink-0">
            <div className={`absolute inset-0 ${config.icon} opacity-20 blur-xl animate-pulse`} />
            <div className={`relative ${config.icon} transition-transform duration-300 hover:scale-110`}>
              <IconComponent />
            </div>
          </div>

          {/* Message */}
          <div className="flex-1 pt-0.5">
            <p className={`text-sm font-semibold leading-relaxed ${config.text}`}>
              {alert.message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className={`
              absolute top-4 right-4 rounded-full p-1.5 transition-all duration-200
              hover:bg-black/10 active:scale-95 ${config.text}
            `}
            aria-label="Dismiss notification"
          >
            <IconClose />
          </button>
        </div>

        {/* Progress bar */}
        <ProgressBar duration={duration} config={config} />
      </div>
    </div>
  );
};

// Provider Component
export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);
  const [duration, setDuration] = useState(4000);

  const showAlert = useCallback((message, type = "info", customDuration = 4000) => {
    setAlert({ message, type });
    setDuration(customDuration);

    const timer = setTimeout(() => {
      setAlert(null);
    }, customDuration);

    return () => clearTimeout(timer);
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
      {alert && <Alert alert={alert} onClose={hideAlert} duration={duration} />}
    </AlertContext.Provider>
  );
}

export { AlertContext };