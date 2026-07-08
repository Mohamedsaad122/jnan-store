import React from 'react';
import {
  WifiOff,
  ServerCrash,
  AlertCircle,
  Lock,
  FileQuestion,
  RotateCcw,
  Home,
} from 'lucide-react';
import { useLanguageStore } from '@/store/language.store';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export interface ErrorStateProps {
  type?: 'default' | 'offline' | 'server' | 'network' | 'unauthorized' | 'forbidden' | '404';
  title?: string;
  description?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'default',
  title,
  description,
  onRetry,
  showHomeButton = true,
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  // Get default content based on type
  const getDefaultContent = () => {
    switch (type) {
      case 'offline':
        return {
          icon: <WifiOff className="h-12 w-12 text-destructive/80 animate-pulse" />,
          title: isRtl ? 'لا يوجد اتصال بالإنترنت' : 'No Internet Connection',
          desc: isRtl
            ? 'يرجى التحقق من اتصال الشبكة الخاص بك والمحاولة مرة أخرى.'
            : 'Please check your network connection and try again.',
        };
      case 'server':
        return {
          icon: <ServerCrash className="h-12 w-12 text-destructive/80" />,
          title: isRtl ? 'خطأ في الخادم الداخلي' : 'Internal Server Error',
          desc: isRtl
            ? 'نواجه مشكلة في معالجة طلبك على الخادم. يرجى المحاولة لاحقاً.'
            : 'We encountered an error processing your request on our server. Please try again later.',
        };
      case 'network':
        return {
          icon: <AlertCircle className="h-12 w-12 text-destructive/80" />,
          title: isRtl ? 'خطأ في الشبكة' : 'Network Communication Error',
          desc: isRtl
            ? 'فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالشبكة وإعادة المحاولة.'
            : 'Failed to communicate with the server. Please check your network and retry.',
        };
      case 'unauthorized':
      case 'forbidden':
        return {
          icon: <Lock className="h-12 w-12 text-gold" />,
          title: isRtl ? 'غير مصرح بالدخول' : 'Access Restricted',
          desc: isRtl
            ? 'ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة.'
            : 'You do not have the required permissions to view this page.',
        };
      case '404':
        return {
          icon: <FileQuestion className="h-12 w-12 text-gold" />,
          title: isRtl ? 'الصفحة غير موجودة' : 'Page Not Found',
          desc: isRtl
            ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
            : 'Sorry, the page you are looking for does not exist or has been moved.',
        };
      case 'default':
      default:
        return {
          icon: <AlertCircle className="h-12 w-12 text-destructive/80" />,
          title: isRtl ? 'حدث خطأ غير متوقع' : 'Unexpected Error Occurred',
          desc: isRtl
            ? 'عذراً، حدث خطأ ما أثناء معالجة طلبك. يرجى المحاولة مجدداً.'
            : 'Sorry, something went wrong while processing your request. Please try again.',
        };
    }
  };

  const defaults = getDefaultContent();
  const displayTitle = title || defaults.title;
  const displayDescription = description || defaults.desc;

  return (
    <div
      className="flex flex-col items-center justify-center p-8 border border-border/40 bg-card rounded-3xl text-center font-tajawal select-none w-full max-w-lg mx-auto shadow-xs"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="h-20 w-20 rounded-2xl bg-muted/30 dark:bg-muted/10 flex items-center justify-center mb-5 border border-border/10">
        {defaults.icon}
      </div>

      <h3 className="text-lg font-extrabold text-primary dark:text-gold mb-2">{displayTitle}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed font-light">
        {displayDescription}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {onRetry && (
          <Button
            variant="gold"
            onClick={onRetry}
            className="text-xs font-bold px-6 h-10 rounded-xl flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-gold"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{isRtl ? 'إعادة المحاولة' : 'Retry Action'}</span>
          </Button>
        )}

        {showHomeButton && (
          <Link to={ROUTES.HOME} className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="text-xs font-bold px-6 h-10 rounded-xl flex items-center justify-center gap-2 w-full cursor-pointer focus-visible:ring-2 focus-visible:ring-gold"
            >
              <Home className="h-3.5 w-3.5" />
              <span>{isRtl ? 'العودة للرئيسية' : 'Back to Home'}</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
