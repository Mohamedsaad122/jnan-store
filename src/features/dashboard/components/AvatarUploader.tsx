import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Trash2 } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

interface AvatarUploaderProps {
  currentAvatarUrl?: string;
  userName: string;
  onAvatarChange: (newUrl: string | null) => void;
  isSaving?: boolean;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatarUrl,
  userName,
  onAvatarChange,
  isSaving = false,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format and size (< 2MB)
    if (!file.type.startsWith('image/')) {
      alert(t('profile.avatar.error_type', 'الرجاء اختيار ملف صورة صالح'));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert(t('profile.avatar.error_size', 'حجم الصورة يجب أن يكون أقل من 2 ميغابايت'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      onAvatarChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    setPreviewUrl(null);
    onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 select-none font-tajawal">
      <div className="relative group">
        <Avatar
          src={previewUrl || undefined}
          fallbackText={userName || 'U'}
          className="h-28 w-28 md:h-32 md:w-32 border-2 border-gold/20 shadow-md transition-transform group-hover:scale-[1.02]"
        />
        <button
          type="button"
          onClick={handleTriggerUpload}
          disabled={isSaving}
          className="absolute bottom-1 right-1 bg-primary text-primary-foreground hover:bg-primary/95 p-2 rounded-full shadow-md cursor-pointer transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label={t('profile.avatar.change', 'تغيير الصورة الشخصية')}
        >
          <Camera className="h-4.5 w-4.5 text-gold" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleTriggerUpload}
          disabled={isSaving}
          className="text-xs font-bold border-border/40"
        >
          {t('profile.avatar.select', 'اختر صورة')}
        </Button>

        {previewUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveAvatar}
            disabled={isSaving}
            className="text-xs font-bold gap-1 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{t('profile.avatar.remove', 'حذف')}</span>
          </Button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-hidden="true"
      />
      <p className="text-[10px] text-muted-foreground">
        {t('profile.avatar.hint', 'تنسيق JPG, PNG. الحد الأقصى 2 ميغابايت.')}
      </p>
    </div>
  );
};

export default AvatarUploader;
