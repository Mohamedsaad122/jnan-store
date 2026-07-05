import React, { useRef, useEffect } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export const OTPInput: React.FC<OTPInputProps> = ({ value, onChange, length = 6 }) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Split value into array
  const valuesArray = value.split('').concat(Array(length).fill('')).slice(0, length);

  useEffect(() => {
    // Autofocus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, ''); // Allow only digits
    if (!val) return;

    const newValues = [...valuesArray];
    // Take the last entered character
    newValues[index] = val.substring(val.length - 1);
    const combined = newValues.join('');
    onChange(combined);

    // Auto-focus next input
    if (index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newValues = [...valuesArray];
      if (valuesArray[index]) {
        // If current box has value, clear it
        newValues[index] = '';
        onChange(newValues.join(''));
      } else if (index > 0) {
        // If current box is empty, move backward and clear previous
        newValues[index - 1] = '';
        onChange(newValues.join(''));
        focusInput(index - 1);
      }
    } else if (e.key === 'ArrowRight' && index > 0) {
      focusInput(index - 1);
    } else if (e.key === 'ArrowLeft' && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pastedData) {
      onChange(pastedData);
      // Focus on last input or the next empty box
      const focusTarget = Math.min(pastedData.length, length - 1);
      focusInput(focusTarget);
    }
  };

  return (
    <div className="flex gap-2 justify-center select-none" dir="ltr">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            if (el) inputRefs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={valuesArray[idx]}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          className="w-11 h-12 text-center text-lg font-black font-sans bg-card border border-border/60 rounded-xl focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none transition-all selection:bg-gold/20"
          aria-label={`الرمز ${idx + 1}`}
        />
      ))}
    </div>
  );
};

export default OTPInput;
