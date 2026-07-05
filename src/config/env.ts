import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('https://api.jnan-store.com/v1'),
  VITE_IMAGE_BASE_URL: z.string().url().default('https://api.jnan-store.com/images'),
  VITE_APP_NAME: z.string().default('Jnan Store'),
  VITE_APP_VERSION: z.string().default('1.0.0'),
  VITE_DEFAULT_LANGUAGE: z.enum(['ar', 'en']).default('ar'),
  VITE_ENABLE_ANALYTICS: z
    .preprocess((val) => val === 'true' || val === true || val === '1', z.boolean())
    .default(false),
  VITE_ENABLE_MOCK_API: z
    .preprocess(
      (val) => val === 'true' || val === true || val === '1' || val === undefined,
      z.boolean()
    )
    .default(true),
});

// Access and parse metadata variables from Vite environment context
const envParseResult = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL,
  VITE_IMAGE_BASE_URL: import.meta.env.VITE_IMAGE_BASE_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
  VITE_DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE,
  VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS,
  VITE_ENABLE_MOCK_API: import.meta.env.VITE_ENABLE_MOCK_API,
});

if (!envParseResult.success) {
  const formattedErrors = envParseResult.error.format();
  console.error('❌ Environment validation failed:', formattedErrors);
  throw new Error('Environment validation failed. Please check your .env file configurations.');
}

// Map the parsed object, adding VITE_API_URL for backward-compatibility
export const env = {
  ...envParseResult.data,
  VITE_API_URL: envParseResult.data.VITE_API_BASE_URL, // Backward compatibility alias
};

export default env;
