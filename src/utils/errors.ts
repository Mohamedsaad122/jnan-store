/**
 * Base class for all API-specific exceptions
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * HTTP 400 - Bad Request / Validation errors
 */
export class ValidationError extends ApiError {
  constructor(message: string = 'بيانات المدخلات غير صالحة', errors?: Record<string, string[]>) {
    super(message, 400, errors);
    this.name = 'ValidationError';
  }
}

/**
 * HTTP 401 - Unauthorized / Expired sessions
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'يرجى تسجيل الدخول للوصول إلى هذا المورد') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

/**
 * HTTP 403 - Forbidden / Lacking role scopes
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = 'ليس لديك صلاحية الوصول إلى هذا المورد') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * HTTP 404 - Not Found
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'المورد المطلوب غير موجود') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * HTTP 409 - Conflict (e.g. duplicate accounts)
 */
export class ConflictError extends ApiError {
  constructor(message: string = 'المورد موجود بالفعل أو هناك تعارض') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

/**
 * HTTP 500+ - Internal Server Errors
 */
export class UnknownServerError extends ApiError {
  constructor(message: string = 'حدث خطأ غير متوقع في الخادم، يرجى المحاولة لاحقاً') {
    super(message, 500);
    this.name = 'UnknownServerError';
  }
}
