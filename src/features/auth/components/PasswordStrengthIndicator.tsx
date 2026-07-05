import React from 'react';

interface PasswordStrengthIndicatorProps {
  password?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password = '',
}) => {
  if (!password) return null;

  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[@$!%*?&]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getStrength(password);

  const getStrengthMeta = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return { label: 'ضعيفة جداً', color: 'bg-red-500', width: 'w-1/5' };
      case 2:
        return { label: 'ضعيفة', color: 'bg-orange-500', width: 'w-2/5' };
      case 3:
        return { label: 'متوسطة', color: 'bg-yellow-500', width: 'w-3/5' };
      case 4:
        return { label: 'قوية', color: 'bg-emerald-500', width: 'w-4/5' };
      case 5:
        return { label: 'قوية جداً ومثالية', color: 'bg-emerald-600', width: 'w-full' };
      default:
        return { label: 'ضعيفة', color: 'bg-red-500', width: 'w-0' };
    }
  };

  const meta = getStrengthMeta(strengthScore);

  return (
    <div className="space-y-1.5 mt-2 select-none">
      <div className="flex justify-between items-center text-[10px] text-muted-foreground font-tajawal">
        <span>قوة كلمة المرور:</span>
        <span className="font-semibold text-primary">{meta.label}</span>
      </div>
      <div className="h-1 w-full bg-muted/40 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-300 ${meta.color} ${meta.width}`} />
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
