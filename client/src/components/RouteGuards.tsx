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
        isAuthenticated,
        initialize
    } = useAuthStore();

    useEffect(() => {
        // Initialize auth state if not already done
        if (!isInitialized && !isLoading) {
            initialize();
        }
    }, [ isInitialized, isLoading, initialize ]);

    // Show loading spinner while checking authentication
    if (!isInitialized || isLoading) {
        return <AuthLoadingSpinner />;
    }

    // Redirect to login if not authenticated
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
        isAuthenticated,
        initialize
    } = useAuthStore();

    useEffect(() => {
        // Initialize auth state if not already done
        if (!isInitialized && !isLoading) {
            initialize();
        }
    }, [ isInitialized, isLoading, initialize ]);

    // Show loading spinner while checking authentication
    if (!isInitialized || isLoading) {
        return <AuthLoadingSpinner />;
    }

    // Redirect to intended page or home if already authenticated
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
        initialize
    } = useAuthStore();

    useEffect(() => {
        // Initialize auth state on app startup
        if (!isInitialized && !isLoading) {
            initialize();
        }
    }, [ isInitialized, isLoading, initialize ]);

    // Show loading spinner during initial auth check
    if (!isInitialized || isLoading) {
        return <AuthLoadingSpinner />;
    }

    return <>{children}</>;
}; 