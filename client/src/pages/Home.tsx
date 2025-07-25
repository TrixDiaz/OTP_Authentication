import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/authStore';
import { LogOut, User, Mail, Calendar, Shield } from 'lucide-react';

export default function Home() {
    const [ isLoading, setIsLoading ] = useState(true);
    const navigate = useNavigate();
    const { user, email: authEmail, clearEmail, logout } = useAuthStore();

    useEffect(() => {
        // Set loading to false after component mounts since authentication is guaranteed by ProtectedRoute
        setIsLoading(false);

        // Clear email from auth store since we've reached the authenticated area
        if (authEmail) {
            clearEmail();
        }

    }, [ authEmail, clearEmail ]);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed, but you will be redirected');
            navigate('/login', { replace: true });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Use user data from the store, with fallback for display
    const displayUser = user || {
        email: 'user@example.com',
        name: 'User',
        isVerified: true,
        createdAt: new Date().toISOString()
    };

    // Extract name from email if no name is provided
    const displayName = displayUser.name || displayUser.email.split('@')[ 0 ]
        .split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

    const joinDate = new Date(displayUser.createdAt).toLocaleDateString();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Logo />
                            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="flex items-center space-x-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {displayName}!
                    </h2>
                    <p className="text-gray-600">
                        Here's your account information and dashboard overview.
                    </p>
                </div>

                {/* User Information Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="col-span-1 md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="w-5 h-5" />
                                <span>Profile Information</span>
                            </CardTitle>
                            <CardDescription>
                                Your account details and verification status
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-900">Email</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">{displayUser.email}</span>
                                    {displayUser.isVerified && (
                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                            <Shield className="w-3 h-3 mr-1" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-900">Full Name</span>
                                </div>
                                <span className="text-sm text-gray-600">{displayName}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-900">Member Since</span>
                                </div>
                                <span className="text-sm text-gray-600">{joinDate}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Manage your account settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Link to="/profile">
                                <Button variant="outline" className="w-full justify-start">
                                    <User className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </Link>
                            <Button variant="outline" className="w-full justify-start">
                                <Shield className="w-4 h-4 mr-2" />
                                Security Settings
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Welcome Message */}
                <Card className="mt-6">
                    <CardContent className="py-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                🎉 Welcome to FastLink!
                            </h3>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                You have successfully logged in to your account. This is your personal dashboard
                                where you can manage your profile, view your information, and access various features.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
} 