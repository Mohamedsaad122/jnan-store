import { toast } from 'react-hot-toast';

const DEFAULT_STYLE = {
  background: 'var(--card)',
  color: 'var(--foreground)',
  border: '1px solid var(--border)',
  fontFamily: 'Tajawal, sans-serif',
  fontSize: '13px',
  fontWeight: 'bold',
  borderRadius: '16px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
};

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        ...DEFAULT_STYLE,
        border: '1px solid rgba(34, 197, 94, 0.35)',
        background: 'rgba(27, 27, 26, 0.95)',
      },
      iconTheme: {
        primary: 'rgb(34, 197, 94)',
        secondary: 'var(--card)',
      },
    });
  },

  error: (message: string) => {
    toast.error(message, {
      style: {
        ...DEFAULT_STYLE,
        border: '1px solid rgba(239, 68, 68, 0.35)',
        background: 'rgba(27, 27, 26, 0.95)',
      },
      iconTheme: {
        primary: 'rgb(239, 68, 68)',
        secondary: 'var(--card)',
      },
    });
  },

  warning: (message: string) => {
    toast(message, {
      style: {
        ...DEFAULT_STYLE,
        border: '1px solid rgba(234, 179, 8, 0.35)',
        background: 'rgba(27, 27, 26, 0.95)',
        color: 'rgb(234, 179, 8)',
      },
      icon: '⚠️',
    });
  },

  info: (message: string) => {
    toast(message, {
      style: {
        ...DEFAULT_STYLE,
        border: '1px solid rgba(212, 163, 89, 0.35)',
        background: 'rgba(27, 27, 26, 0.95)',
        color: 'var(--gold)',
      },
      icon: 'ℹ️',
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        ...DEFAULT_STYLE,
        border: '1px solid rgba(212, 163, 89, 0.2)',
        background: 'rgba(27, 27, 26, 0.95)',
      },
    });
  },

  promise: <T,>(promise: Promise<T>, msgs: { loading: string; success: string; error: string }) => {
    return toast.promise(
      promise,
      {
        loading: msgs.loading,
        success: msgs.success,
        error: msgs.error,
      },
      {
        style: DEFAULT_STYLE,
        success: {
          style: {
            ...DEFAULT_STYLE,
            border: '1px solid rgba(34, 197, 94, 0.35)',
            background: 'rgba(27, 27, 26, 0.95)',
          },
          iconTheme: {
            primary: 'rgb(34, 197, 94)',
            secondary: 'var(--card)',
          },
        },
        error: {
          style: {
            ...DEFAULT_STYLE,
            border: '1px solid rgba(239, 68, 68, 0.35)',
            background: 'rgba(27, 27, 26, 0.95)',
          },
          iconTheme: {
            primary: 'rgb(239, 68, 68)',
            secondary: 'var(--card)',
          },
        },
      }
    );
  },
};

export default showToast;
