import { message } from '@/components/ui/message';

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
}

/**
 * Base API URL from environment variable or default to localhost
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Helper function to handle API requests with error handling
 */
export async function request<T = any>(
  url: string, 
  options: RequestOptions = {}
): Promise<T> {
  const { 
    params, 
    data, 
    timeout = 30000, 
    headers = {}, 
    method = 'GET',
    ...rest 
  } = options;

  // Add query parameters to URL if provided
  const queryString = params 
    ? `?${new URLSearchParams(params as Record<string, string>).toString()}` 
    : '';
  
  const fullUrl = `${API_BASE_URL}${url}${queryString}`;

  // Prepare headers with content type for JSON
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Create request options
  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
    ...rest,
  };

  // Add body data for non-GET requests
  if (data && method !== 'GET') {
    fetchOptions.body = JSON.stringify(data);
  }

  // Create fetch promise with timeout
  const controller = new AbortController();
  fetchOptions.signal = controller.signal;

  // Create timeout promise
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      controller.abort();
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);
  });

  try {
    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(fullUrl, fetchOptions),
      timeoutPromise,
    ]);

    // Check if response is ok (status in 200-299 range)
    if (!(response as Response).ok) {
      const errorData = await (response as Response).json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${(response as Response).status}`);
    }

    // Parse response as JSON
    const responseData = await (response as Response).json();
    return responseData;
  } catch (error: any) {
    // Show error message
    message.error(error.message || 'An error occurred');
    throw error;
  }
} 