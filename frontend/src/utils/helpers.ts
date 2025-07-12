import { ComplaintStatus } from '../types/complaint.types';
import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString);
  }
};

export const getStatusColor = (status: ComplaintStatus): string => {
  switch (status) {
    case ComplaintStatus.PENDING:
      return 'status-pending';
    case ComplaintStatus.IN_PROGRESS:
      return 'status-in-progress';
    case ComplaintStatus.RESOLVED:
      return 'status-resolved';
    default:
      return 'status-pending';
  }
};

export const getStatusText = (status: ComplaintStatus): string => {
  switch (status) {
    case ComplaintStatus.PENDING:
      return 'Pending';
    case ComplaintStatus.IN_PROGRESS:
      return 'In Progress';
    case ComplaintStatus.RESOLVED:
      return 'Resolved';
    default:
      return 'Unknown';
  }
};

export const validateEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters long`);
  }
  
  if (!VALIDATION_RULES.PASSWORD.PATTERN.test(password)) {
    errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateComplaintTitle = (title: string): boolean => {
  return title.trim().length > 0 && title.length <= VALIDATION_RULES.COMPLAINT.TITLE_MAX_LENGTH;
};

export const validateComplaintDescription = (description: string): boolean => {
  return description.trim().length > 0 && description.length <= VALIDATION_RULES.COMPLAINT.DESCRIPTION_MAX_LENGTH;
};

export const validateComment = (comment: string): boolean => {
  return comment.trim().length > 0 && comment.length <= VALIDATION_RULES.COMMENT.MAX_LENGTH;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const handleApiError = (error: any): string => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 422:
        return error.response.data.message || ERROR_MESSAGES.VALIDATION_ERROR;
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return error.response.data.message || ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  } else if (error.request) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  } else {
    return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
};

export const downloadFile = (data: any, filename: string, type: string = 'application/json'): void => {
  const file = new Blob([JSON.stringify(data, null, 2)], { type });
  const a = document.createElement('a');
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text to clipboard:', err);
    return false;
  }
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const sortArrayByKey = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const groupArrayByKey = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const filterArrayByValue = <T>(array: T[], key: keyof T, value: any): T[] => {
  return array.filter(item => item[key] === value);
};

export const searchArrayByFields = <T>(array: T[], query: string, fields: (keyof T)[]): T[] => {
  const searchTerm = query.toLowerCase();
  return array.filter(item =>
    fields.some(field => 
      String(item[field]).toLowerCase().includes(searchTerm)
    )
  );
};