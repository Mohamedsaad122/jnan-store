import { AxiosError } from 'axios';
import {
  ApiError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnknownServerError,
} from '@/utils/errors';

export const errorMapper = {
  /**
   * Translates an AxiosError catch block into a normalized ApiError subclass
   */
  mapError(error: AxiosError): ApiError {
    const status = error.response?.status;
    let message = 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.';
    let validationDetails: Record<string, string[]> | undefined;

    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as { message?: string; errors?: Record<string, string[]> };
      if (data.message) {
        message = data.message;
      }
      if (data.errors) {
        validationDetails = data.errors;
      }
    }

    switch (status) {
      case 400:
        return new ValidationError(message, validationDetails);
      case 401:
        return new UnauthorizedError(message);
      case 403:
        return new ForbiddenError(message);
      case 404:
        return new NotFoundError(message);
      case 409:
        return new ConflictError(message);
      case 500:
        return new UnknownServerError(message);
      default:
        return new ApiError(message, status || 500);
    }
  },
};

export default errorMapper;
