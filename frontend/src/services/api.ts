import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiError } from '../types/api.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, params?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, { params });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  public async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
      error: error.response?.data?.error || 'Internal Server Error',
    };
    return apiError;
  }
}

export const apiService = new ApiService();
