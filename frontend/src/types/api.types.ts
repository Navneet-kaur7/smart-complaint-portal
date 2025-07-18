
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
    complaints: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}


export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}