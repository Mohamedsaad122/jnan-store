import { toast } from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        background: 'var(--card)',
        color: 'var(--cardamom)',
        border: '1px solid var(--cardamom)',
        fontFamily: 'Tajawal, sans-serif',
      },
      iconTheme: {
        primary: 'var(--cardamom)',
        secondary: 'var(--card)',
      },
    });
  },
  error: (message: string) => {
    toast.error(message, {
      style: {
        background: 'var(--card)',
        color: 'var(--destructive)',
        border: '1px solid var(--destructive)',
        fontFamily: 'Tajawal, sans-serif',
      },
      iconTheme: {
        primary: 'var(--destructive)',
        secondary: 'var(--card)',
      },
    });
  },
  info: (message: string) => {
    toast(message, {
      style: {
        background: 'var(--card)',
        color: 'var(--primary)',
        border: '1px solid var(--gold)',
        fontFamily: 'Tajawal, sans-serif',
      },
    });
  },
};

export default showToast;
