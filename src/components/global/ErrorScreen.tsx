import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  message = 'حدث خطأ غير متوقع أثناء تحميل الصفحة.',
  onRetry,
}) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center font-tajawal">
      <AlertCircle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-xl font-bold text-primary mb-2">عذراً، حدث خطأ ما!</h2>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" size="md">
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
};

export default ErrorScreen;
