import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input, { InputProps } from '@/components/ui/Input';

interface PasswordFieldProps extends Omit<InputProps, 'type' | 'error' | 'helperText'> {
  error?: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ error, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          error={!!error}
          helperText={error}
          className={`pr-3 pl-10 ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute left-3 top-[32px] text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-gold rounded p-1 select-none"
          tabIndex={-1}
          aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';

export default PasswordField;
