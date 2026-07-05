import * as z from 'zod';

// Helper password strength checker regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginSchema = z.object({
  email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('صيغة البريد الإلكتروني غير صحيحة'),
  password: z.string().min(6, 'يجب أن تتكون كلمة المرور من ٦ أحرف على الأقل'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'الاسم الأول يجب أن يتكون من حرفين على الأقل'),
    lastName: z.string().min(2, 'الاسم الأخير يجب أن يتكون من حرفين على الأقل'),
    email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('صيغة البريد الإلكتروني غير صحيحة'),
    phone: z
      .string()
      .min(9, 'يجب أن يتكون رقم الجوال من ٩ أرقام على الأقل')
      .regex(/^05\d{8}$/, 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من ١٠ أرقام'),
    password: z
      .string()
      .min(8, 'يجب أن تتكون كلمة المرور من ٨ أحرف على الأقل')
      .regex(passwordRegex, 'يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم ورمز خاص'),
    confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, 'يجب قبول الشروط والأحكام ومتابعة التسجيل'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('صيغة البريد الإلكتروني غير صحيحة'),
});

export const resetPasswordSchema = z
  .object({
    otpCode: z.string().length(6, 'يجب أن يتكون رمز التحقق من ٦ أرقام'),
    password: z
      .string()
      .min(8, 'يجب أن تتكون كلمة المرور من ٨ أحرف على الأقل')
      .regex(passwordRegex, 'يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم ورمز خاص'),
    confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  });

export const otpSchema = z.object({
  otpCode: z.string().length(6, 'يجب أن يتكون رمز التحقق من ٦ أرقام'),
});
