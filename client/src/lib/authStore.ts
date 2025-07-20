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
            ?.split('=')[ 1 ];

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

// Helper function to check if auth cookie exists
// Since we're using HTTP-only cookies, we need to check server-side validation
const hasAuthCookie = (): boolean => {
    if (typeof document === 'undefined') return false;

    // We can't read HTTP-only cookies from JavaScript
    // Instead, we'll rely on the server validation endpoint
    // This is a fallback that checks if we have any stored auth data
    const cookieValue = cookieStorage.getItem('fastlink-auth');
    if (!cookieValue) return false;

    try {
        const parsedData = JSON.parse(cookieValue);
        // Check that user data exists (tokens are now in HTTP-only cookies)
        return !!(
            parsedData?.state?.user &&
            parsedData.state.user !== null &&
            Object.keys(parsedData.state.user).length > 0
        );
    } catch {
        return false;
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
    isHydrated: boolean;
    isInitializing: boolean; // Add flag to prevent multiple init calls

    // User state
    user: User | null;

    // Existing auth flow state
    email: string;
    flowType: AuthFlowType | null;

    // Auth flow actions
    setEmail: (email: string) => void;
    setFlowType: (flowType: AuthFlowType | null) => void;
    clearEmail: () => void;
    clearFlowType: () => void;
    clearAll: () => void;

    // Loading state actions
    setLoading: (loading: boolean) => void;
    setInitialized: (initialized: boolean) => void;
    setHydrated: (hydrated: boolean) => void;
    setInitializing: (initializing: boolean) => void;

    // User actions
    setUser: (user: User) => void;
    clearUser: () => void;

    // Authentication actions
    isAuthenticated: () => boolean;

    // Initialize auth state
    initialize: () => Promise<void>;

    // Check if user has auth cookie (before rehydration)
    hasAuthCookie: () => boolean;

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
            isHydrated: false,
            isInitializing: false,
            user: null,
            email: '',
            flowType: null,

            // Loading state actions
            setLoading: (loading: boolean) => set({ isLoading: loading }),
            setInitialized: (initialized: boolean) => set({ isInitialized: initialized }),
            setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
            setInitializing: (initializing: boolean) => set({ isInitializing: initializing }),

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
                user: null,
                isLoading: false
            }),

            // Authentication check
            isAuthenticated: () => {
                const state = get();
                // Check if we have user data (tokens are in HTTP-only cookies)
                if (state.user) {
                    return true;
                }
                // If not hydrated yet, check if auth cookie exists as fallback
                if (!state.isHydrated) {
                    return hasAuthCookie();
                }
                return false;
            },

            // Check if auth cookie exists (before full rehydration)
            hasAuthCookie: () => {
                return hasAuthCookie();
            },

            // Initialize auth state on app startup - prevent multiple calls
            initialize: async () => {
                const state = get();

                // Prevent multiple initialization calls
                if (state.isInitialized || state.isInitializing) {
                    return;
                }

                const { setLoading, setInitialized, setInitializing } = get();

                setInitializing(true);
                setLoading(true);

                try {
                    // Wait for rehydration to complete if not already done
                    let attempts = 0;
                    const maxAttempts = 100; // 1 second max wait

                    while (!get().isHydrated && attempts < maxAttempts) {
                        await new Promise(resolve => setTimeout(resolve, 10));
                        attempts++;
                    }

                    // Always validate with server to check if user is authenticated
                    // This will handle cases where:
                    // 1. User has local data but server tokens are expired
                    // 2. User has HTTP-only cookies but no local data
                    // 3. User has both and everything is valid
                    const isValid = await get().validateTokenWithServer();

                    if (!isValid) {
                        // Try to refresh tokens if validation failed
                        const refreshSuccess = await get().refreshTokens();
                        if (!refreshSuccess) {
                            // Refresh failed, clear all auth data
                            get().clearAll();
                        }
                    }
                } catch (error) {
                    console.error('Auth initialization failed:', error);
                    get().clearAll();
                } finally {
                    setLoading(false);
                    setInitialized(true);
                    setInitializing(false);
                }
            },

            // Validate token with server - using native fetch to avoid circular dependency
            validateTokenWithServer: async () => {
                const { setUser, clearUser } = get();

                try {
                    const response = await fetch('http://localhost:3000/api/v1/auth/validate-token', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include' // Include HTTP-only cookies
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success && data.user) {
                            setUser(data.user);
                            return true;
                        }
                    }

                    // Token is invalid
                    clearUser();
                    return false;
                } catch (error) {
                    console.error('Token validation failed:', error);
                    clearUser();
                    return false;
                }
            },

            // Refresh tokens - using native fetch to avoid circular dependency
            refreshTokens: async () => {
                const { clearUser } = get();

                try {
                    const response = await fetch('http://localhost:3000/api/v1/auth/refresh-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include' // Include HTTP-only cookies
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.success) {
                            // Tokens are now set as HTTP-only cookies by the server
                            // Validate again to get updated user data
                            return await get().validateTokenWithServer();
                        }
                    }

                    // Refresh failed
                    clearUser();
                    return false;
                } catch (error) {
                    console.error('Token refresh failed:', error);
                    clearUser();
                    return false;
                }
            },

            // Logout - using native fetch to avoid circular dependency
            logout: async () => {
                const { clearAll } = get();

                try {
                    // Call server logout endpoint to clear HTTP-only cookies
                    await fetch('http://localhost:3000/api/v1/auth/sign-out', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include' // Include HTTP-only cookies
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
            // Only persist user data and email for auth flow (tokens are in HTTP-only cookies)
            partialize: (state) => ({
                user: state.user,
                email: state.email
            }),
            // Handle rehydration completion
            onRehydrateStorage: () => (state) => {
                // Mark as hydrated when rehydration is complete
                if (state) {
                    state.setHydrated(true);
                }
            },
        }
    )
); 