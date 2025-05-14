// T could be any type or entity dto or a paginated collection of entities dtos
export class ApiResponseDto<T> {
  success: boolean;
  message?: string;
  data?: T | T[];
  error?: any;
}