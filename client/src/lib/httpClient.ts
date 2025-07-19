import { useAuthStore } from './authStore';

// API base URL - should be moved to environment config
const API_BASE_URL = 'http://localhost:3000/api';

interface RequestConfig {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
    requiresAuth?: boolean;
}

interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

class HttpClient {
    private baseURL: string;
    private isRefreshing: boolean = false;
    private failedQueue: Array<{
        resolve: (token: string) => void;
        reject: (error: any) => void;
    }> = [];

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private processQueue(error: any, token: string | null = null) {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else {
                resolve(token!);
            }
        });

        this.failedQueue = [];
    }

    private async refreshToken(): Promise<string | null> {
        const { refreshTokens, getRefreshToken } = useAuthStore.getState();

        if (!getRefreshToken()) {
            throw new Error('No refresh token available');
        }

        try {
            const success = await refreshTokens();
            if (success) {
                const { getAccessToken } = useAuthStore.getState();
                return getAccessToken();
            }
            throw new Error('Token refresh failed');
        } catch (error) {
            throw error;
        }
    }

    private async handleTokenRefresh(): Promise<string> {
        if (this.isRefreshing) {
            // If already refreshing, wait for it to complete
            return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
            });
        }

        this.isRefreshing = true;

        try {
            const newToken = await this.refreshToken();
            this.processQueue(null, newToken);
            this.isRefreshing = false;
            return newToken!;
        } catch (error) {
            this.processQueue(error, null);
            this.isRefreshing = false;

            // Clear auth state and redirect to login
            const { clearAll } = useAuthStore.getState();
            clearAll();

            // Redirect to login page
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }

            throw error;
        }
    }

    async request<T = any>(
        endpoint: string,
        config: RequestConfig = {}
    ): Promise<ApiResponse<T>> {
        const {
            method = 'GET',
            headers = {},
            body,
            requiresAuth = true
        } = config;

        const url = `${this.baseURL}${endpoint}`;

        // Prepare headers
        const requestHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...headers
        };

        // Add authorization header if required
        if (requiresAuth) {
            const { getAccessToken } = useAuthStore.getState();
            const token = getAccessToken();

            if (token) {
                requestHeaders.Authorization = `Bearer ${token}`;
            }
        }

        // Prepare request options
        const requestOptions: RequestInit = {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined
        };

        try {
            const response = await fetch(url, requestOptions);

            // Handle token expiration
            if (response.status === 401 && requiresAuth) {
                const data = await response.json();

                if (data.code === 'TOKEN_EXPIRED') {
                    // Attempt to refresh token
                    try {
                        const newToken = await this.handleTokenRefresh();

                        // Retry the original request with new token
                        requestHeaders.Authorization = `Bearer ${newToken}`;
                        const retryResponse = await fetch(url, {
                            ...requestOptions,
                            headers: requestHeaders
                        });

                        return await retryResponse.json();
                    } catch (refreshError) {
                        // Token refresh failed, return original error
                        return data;
                    }
                }

                // Other 401 errors (invalid token, etc.)
                return data;
            }

            // Parse response
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
            }

            return responseData;
        } catch (error) {
            console.error('HTTP Client Error:', error);
            throw error;
        }
    }

    // Convenience methods
    async get<T = any>(endpoint: string, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET', requiresAuth });
    }

    async post<T = any>(endpoint: string, body: any, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'POST', body, requiresAuth });
    }

    async put<T = any>(endpoint: string, body: any, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'PUT', body, requiresAuth });
    }

    async delete<T = any>(endpoint: string, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE', requiresAuth });
    }

    async patch<T = any>(endpoint: string, body: any, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'PATCH', body, requiresAuth });
    }
}

// Create and export a singleton instance
export const httpClient = new HttpClient(API_BASE_URL);

// Export the class for testing or custom instances
export default HttpClient; 