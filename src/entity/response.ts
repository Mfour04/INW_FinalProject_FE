export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PaginatedApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  totalPage: number;
  totalResult: number;
};
