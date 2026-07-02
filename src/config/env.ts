import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url().default('https://api.jnan-store.com/v1'),
  VITE_APP_NAME: z.string().default('Jnan Store'),
  VITE_DEFAULT_LANGUAGE: z.enum(['ar', 'en']).default('ar'),
});

// Access and parse metadata variables from Vite
const envParseResult = envSchema.safeParse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE,
});

if (!envParseResult.success) {
  const formattedErrors = envParseResult.error.format();
  console.error('❌ Environment validation failed:', formattedErrors);
  throw new Error('Environment validation failed. Please check your .env file configurations.');
}

export const env = envParseResult.data;
export default env;
