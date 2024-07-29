export type ApiResponse<T = any> = {
  data?: T;
  error_code?: number;
}