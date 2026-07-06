import React from 'react';

interface PreferenceSwitchProps {
  title: string;
  description?: string;
  checked: boolean;
  onToggle: () => void;
  isRtl: boolean;
  disabled?: boolean;
}

export const PreferenceSwitch: React.FC<PreferenceSwitchProps> = ({
  title,
  description,
  checked,
  onToggle,
  isRtl,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-between py-3 font-tajawal text-right gap-4">
      {/* Title & Desc */}
      <div className="space-y-1">
        <span className="font-bold text-xs sm:text-sm text-primary">{title}</span>
        {description && (
          <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Switch Toggle */}
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 ${
          checked ? 'bg-gold' : 'bg-muted'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        role="switch"
        aria-checked={checked}
        aria-label={title}
      >
        <span
          className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-background shadow-sm transition duration-200 ease-in-out ${
            checked ? (isRtl ? '-translate-x-[18px]' : 'translate-x-[18px]') : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export default PreferenceSwitch;
