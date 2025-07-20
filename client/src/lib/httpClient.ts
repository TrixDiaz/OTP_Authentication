import { useAuthStore } from './authStore';

// API base URL - should be moved to environment config
const API_BASE_URL = 'http://localhost:3000/api/v1';

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
        resolve: () => void;
        reject: (error: any) => void;
    }> = [];

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private processQueue(error: any) {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });

        this.failedQueue = [];
    }

    private async refreshToken(): Promise<boolean> {
        const { refreshTokens } = useAuthStore.getState();

        try {
            const success = await refreshTokens();
            return success;
        } catch (error) {
            throw error;
        }
    }

    private async handleTokenRefresh(): Promise<void> {
        if (this.isRefreshing) {
            // If already refreshing, wait for it to complete
            return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
            });
        }

        this.isRefreshing = true;

        try {
            const success = await this.refreshToken();
            if (!success) {
                throw new Error('Token refresh failed');
            }
            this.processQueue(null);
            this.isRefreshing = false;
        } catch (error) {
            this.processQueue(error);
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

        // Prepare request options with credentials to include HTTP-only cookies
        const requestOptions: RequestInit = {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined,
            credentials: 'include' // Include cookies in requests
        };

        try {
            const response = await fetch(url, requestOptions);

            // Handle token expiration for authenticated routes
            if (response.status === 401 && requiresAuth) {
                const data = await response.json();

                if (data.code === 'TOKEN_EXPIRED' || data.code === 'INVALID_TOKEN') {
                    // Attempt to refresh token
                    try {
                        await this.handleTokenRefresh();

                        // Retry the original request
                        const retryResponse = await fetch(url, requestOptions);

                        if (retryResponse.ok) {
                            return await retryResponse.json();
                        } else {
                            return await retryResponse.json();
                        }
                    } catch (refreshError) {
                        // Token refresh failed, return original error
                        return data;
                    }
                }

                // Other 401 errors (no token, account locked, etc.)
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