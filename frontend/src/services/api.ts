import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiError } from '../types/api.types';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';


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
    // Request interceptor to add auth token and /api prefix
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Try multiple possible token keys
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Added token to request:', token.substring(0, 20) + '...');
        } else {
          console.log('No token found in localStorage');
          console.log('Available keys:', Object.keys(localStorage));
        }
        if (config.url && !config.url.startsWith('/api')) {
  config.url = `/api${config.url}`;
}
        // The backend already has a global prefix 'api' set in main.ts
        // Do not add /api prefix here as it would cause double prefixing
        
        console.log('API Request:', config.method?.toUpperCase(), config.url, 'params:', config.params);
        console.log('Base URL:', this.axiosInstance.defaults.baseURL);
        console.log('Full URL:', `${this.axiosInstance.defaults.baseURL}${config.url}`);
        console.log('Request headers:', config.headers);
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('API Response:', response.status, response.data);
        return response;
      },
      (error) => {
        console.error('API Error:', error);
        console.error('Error Details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        });
        
        if (error.response?.status === 401) {
          console.log('401 Unauthorized - clearing tokens and redirecting');
          localStorage.removeItem('token');
          localStorage.removeItem('access_token');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          alert("Authorization failed!");
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, params?: any): Promise<T> {
    try {
      console.log('API GET request:', url, 'with params:', params);
      const response = await this.axiosInstance.get<T>(url, { params });
      return response.data;
    } catch (error: any) {
      console.error('API GET error:', error);
      throw this.handleError(error);
    }
  }

  public async post<T>(url: string, data?: any): Promise<T> {
    try {
      console.log('API POST request:', url, 'with data:', data);
      const response = await this.axiosInstance.post<T>(url, data);
      return response.data;
    } catch (error: any) {
      console.error('API POST error:', error);
      throw this.handleError(error);
    }
  }

  public async put<T>(url: string, data?: any): Promise<T> {
    try {
      console.log('API PUT request:', url, 'with data:', data);
      const response = await this.axiosInstance.put<T>(url, data);
      return response.data;
    } catch (error: any) {
      console.error('API PUT error:', error);
      throw this.handleError(error);
    }
  }

  public async patch<T>(url: string, data?: any): Promise<T> {
    try {
      console.log('API PATCH request:', url, 'with data:', data);
      const response = await this.axiosInstance.patch<T>(url, data);
      return response.data;
    } catch (error: any) {
      console.error('API PATCH error:', error);
      throw this.handleError(error);
    }
  }

  public async delete<T>(url: string): Promise<T> {
    try {
      console.log('API DELETE request:', url);
      const response = await this.axiosInstance.delete<T>(url);
      return response.data;
    } catch (error: any) {
      console.error('API DELETE error:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
      error: error.response?.data?.error || 'Internal Server Error',
    };
    return apiError;
  }
}

export const apiService = new ApiService();