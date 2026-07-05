export interface ApiResponseDto<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface MetaResponseDto {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponseDto<T> {
  success: boolean;
  data: T[];
  pagination: MetaResponseDto;
  message?: string;
}

export interface ErrorResponseDto {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
