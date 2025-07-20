import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '@/lib/authStore';
import { Spinner } from '@/components/ui/spinner';

interface RouteGuardProps {
    children: React.ReactNode;
}

// Loading component for authentication state
const AuthLoadingSpinner = () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
            <Spinner className="mx-auto" />
            <p className="text-gray-600">Checking authentication...</p>
        </div>
    </div>
);

// Protected Route Guard - requires authentication
export const ProtectedRoute: React.FC<RouteGuardProps> = ({ children }) => {
    const location = useLocation();
    const {
        isLoading,
        isInitialized,
        isHydrated,
        isInitializing,
        isAuthenticated,
        hasAuthCookie,
        initialize
    } = useAuthStore();

    useEffect(() => {
        // Only initialize if not already done or in progress
        if (!isInitialized && !isInitializing && !isLoading) {
            initialize();
        }
    }, [ isInitialized, isInitializing, isLoading, initialize ]);

    // Check if we have auth cookie early (before full hydration)
    const hasValidCookie = hasAuthCookie();

    // Show loading while any auth process is happening
    const isAuthProcessing = isLoading || isInitializing || !isInitialized || (!isHydrated && hasValidCookie);

    if (isAuthProcessing) {
        return <AuthLoadingSpinner />;
    }

    // Only redirect when auth state is fully stable
    if (!isAuthenticated()) {
        return <Navigate
            to="/login"
            state={{ from: location.pathname }}
            replace
        />;
    }

    return <>{children}</>;
};

// Public Route Guard - redirects to home if already authenticated
export const PublicRoute: React.FC<RouteGuardProps> = ({ children }) => {
    const location = useLocation();
    const {
        isLoading,
        isInitialized,
        isHydrated,
        isInitializing,
        isAuthenticated,
        hasAuthCookie,
        initialize
    } = useAuthStore();

    useEffect(() => {
        // Only initialize if not already done or in progress
        if (!isInitialized && !isInitializing && !isLoading) {
            initialize();
        }
    }, [ isInitialized, isInitializing, isLoading, initialize ]);

    // Check if we have auth cookie early (before full hydration)
    const hasValidCookie = hasAuthCookie();

    // Show loading while any auth process is happening, but only if we have a cookie
    const isAuthProcessing = (isLoading || isInitializing || !isInitialized || (!isHydrated && hasValidCookie));

    if (isAuthProcessing) {
        return <AuthLoadingSpinner />;
    }

    // Only redirect when auth state is fully stable and user is authenticated
    if (isAuthenticated()) {
        const intendedPath = location.state?.from || '/home';
        return <Navigate to={intendedPath} replace />;
    }

    return <>{children}</>;
};

// Auth Initializer - handles initial authentication setup
export const AuthInitializer: React.FC<RouteGuardProps> = ({ children }) => {
    const {
        isLoading,
        isInitialized,
        isHydrated,
        isInitializing,
        hasAuthCookie,
        initialize
    } = useAuthStore();

    useEffect(() => {
        // Only initialize if not already done or in progress
        if (!isInitialized && !isInitializing && !isLoading) {
            initialize();
        }
    }, [ isInitialized, isInitializing, isLoading, initialize ]);

    // Check if we have auth cookie early (before full hydration)
    const hasValidCookie = hasAuthCookie();

    // Show loading while any auth process is happening, but only if we have a cookie
    const isAuthProcessing = isLoading || isInitializing || !isInitialized || (!isHydrated && hasValidCookie);

    if (isAuthProcessing) {
        return <AuthLoadingSpinner />;
    }

    return <>{children}</>;
}; 