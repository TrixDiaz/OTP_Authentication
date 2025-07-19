import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AuthFlowType = 'login' | 'register';

// Custom cookie storage implementation for Zustand persist
const cookieStorage = {
    getItem: (name: string): string | null => {
        if (typeof document === 'undefined') return null;

        const value = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${name}=`))
            ?.split('=')
        [ 1 ];

        return value ? decodeURIComponent(value) : null;
    },
    setItem: (name: string, value: string): void => {
        if (typeof document === 'undefined') return;

        // Set cookie with secure options
        const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
        const cookieOptions = [
            `${name}=${encodeURIComponent(value)}`,
            `max-age=${maxAge}`,
            'path=/',
            'SameSite=Strict',
            // Add Secure flag in production
            ...(window.location.protocol === 'https:' ? [ 'Secure' ] : [])
        ];

        document.cookie = cookieOptions.join('; ');
    },
    removeItem: (name: string): void => {
        if (typeof document === 'undefined') return;

        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
    }
};

interface User {
    id: string;
    email: string;
    name?: string;
    isVerified: boolean;
    profileCompleted: boolean;
    hasCompletedProfile?: boolean;
    createdAt: string;
}

interface AuthState {
    // Loading and initialization states
    isLoading: boolean;
    isInitialized: boolean;

    // User state
    user: User | null;

    // Existing auth flow state
    email: string;
    flowType: AuthFlowType | null;

    // Token management state
    accessToken: string | null;
    refreshToken: string | null;

    // Auth flow actions
    setEmail: (email: string) => void;
    setFlowType: (flowType: AuthFlowType | null) => void;
    clearEmail: () => void;
    clearFlowType: () => void;
    clearAll: () => void;

    // Loading state actions
    setLoading: (loading: boolean) => void;
    setInitialized: (initialized: boolean) => void;

    // User actions
    setUser: (user: User) => void;
    clearUser: () => void;

    // Token management actions
    setTokens: (accessToken: string, refreshToken: string, user?: User) => void;
    getTokens: () => { accessToken: string | null; refreshToken: string | null };
    clearTokens: () => void;
    getAccessToken: () => string | null;
    getRefreshToken: () => string | null;
    isAuthenticated: () => boolean;

    // Initialize auth state
    initialize: () => Promise<void>;

    // Validate token with server
    validateTokenWithServer: () => Promise<boolean>;

    // Refresh tokens
    refreshTokens: () => Promise<boolean>;

    // Logout
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial state
            isLoading: false,
            isInitialized: false,
            user: null,
            email: '',
            flowType: null,
            accessToken: null,
            refreshToken: null,

            // Loading state actions
            setLoading: (loading: boolean) => set({ isLoading: loading }),
            setInitialized: (initialized: boolean) => set({ isInitialized: initialized }),

            // User actions
            setUser: (user: User) => set({ user }),
            clearUser: () => set({ user: null }),

            // Auth flow actions
            setEmail: (email: string) => set({ email }),
            setFlowType: (flowType: AuthFlowType | null) => set({ flowType }),
            clearEmail: () => set({ email: '' }),
            clearFlowType: () => set({ flowType: null }),
            clearAll: () => set({
                email: '',
                flowType: null,
                accessToken: null,
                refreshToken: null,
                user: null,
                isLoading: false
            }),

            // Token management actions
            setTokens: (accessToken: string, refreshToken: string, user?: User) => {
                set({
                    accessToken,
                    refreshToken,
                    user: user || get().user
                });
            },

            getTokens: () => {
                const state = get();
                return {
                    accessToken: state.accessToken,
                    refreshToken: state.refreshToken
                };
            },

            clearTokens: () => {
                set({
                    accessToken: null,
                    refreshToken: null,
                    user: null
                });
            },

            getAccessToken: () => {
                return get().accessToken;
            },

            getRefreshToken: () => {
                return get().refreshToken;
            },

            isAuthenticated: () => {
                const state = get();
                return !!state.accessToken && !!state.user;
            },

            // Initialize auth state on app startup
            initialize: async () => {
                const { setLoading, setInitialized, accessToken } = get();

                setLoading(true);

                try {
                    // If we have a token, validate it with the server
                    if (accessToken) {
                        const isValid = await get().validateTokenWithServer();
                        if (!isValid) {
                            // Token is invalid, try to refresh
                            const refreshSuccess = await get().refreshTokens();
                            if (!refreshSuccess) {
                                // Refresh failed, clear all auth data
                                get().clearAll();
                            }
                        }
                    }
                } catch (error) {
                    console.error('Auth initialization failed:', error);
                    get().clearAll();
                } finally {
                    setLoading(false);
                    setInitialized(true);
                }
            },

            // Validate token with server - using native fetch to avoid circular dependency
            validateTokenWithServer: async () => {
                const { accessToken, setUser, clearTokens } = get();

                if (!accessToken) {
                    return false;
                }

                try {
                    const response = await fetch('http://localhost:3000/api/auth/validate-token', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.user) {
                            setUser(data.user);
                            return true;
                        }
                    }

                    // Token is invalid
                    clearTokens();
                    return false;
                } catch (error) {
                    console.error('Token validation failed:', error);
                    clearTokens();
                    return false;
                }
            },

            // Refresh tokens - using native fetch to avoid circular dependency
            refreshTokens: async () => {
                const { refreshToken, setTokens, clearTokens } = get();

                if (!refreshToken) {
                    return false;
                }

                try {
                    const response = await fetch('http://localhost:3000/api/auth/refresh-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ refreshToken })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.accessToken && data.refreshToken) {
                            setTokens(data.accessToken, data.refreshToken);
                            return true;
                        }
                    }

                    // Refresh failed
                    clearTokens();
                    return false;
                } catch (error) {
                    console.error('Token refresh failed:', error);
                    clearTokens();
                    return false;
                }
            },

            // Logout - using native fetch to avoid circular dependency
            logout: async () => {
                const { clearAll } = get();

                try {
                    // Call server logout endpoint if needed
                    await fetch('http://localhost:3000/api/auth/signout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                } catch (error) {
                    console.error('Logout API call failed:', error);
                } finally {
                    // Always clear local state
                    clearAll();
                }
            }
        }),
        {
            name: 'fastlink-auth', // Cookie name prefix
            storage: createJSONStorage(() => cookieStorage),
            // Only persist token data, user, and email for auth flow
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                user: state.user,
                email: state.email
            }),
        }
    )
); 