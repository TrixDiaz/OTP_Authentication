import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../lib/authStore';
import { httpClient } from '../lib/httpClient';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Button,
    Input,
    Label,
    Spinner
} from '../components/ui';
import { toast } from 'sonner';

interface User {
    id: string;
    email: string;
    name?: string;
    isVerified: boolean;
    profileCompleted: boolean;
    hasCompletedProfile?: boolean;
    createdAt: string;
}

interface UpdateProfileData {
    name: string;
}

interface UpdatePasswordData {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface CreatePasswordData {
    newPassword: string;
    confirmPassword: string;
}

interface UpdatePinData {
    oldPin: string;
    newPin: string;
    confirmPin: string;
}

interface CreatePinData {
    newPin: string;
    confirmPin: string;
}

const Profile: React.FC = () => {
    const { user, setUser, logout } = useAuthStore();
    const [ currentUser, setCurrentUser ] = useState<User | null>(null);

    // Form states
    const [ profileData, setProfileData ] = useState<UpdateProfileData>({
        name: ''
    });

    const [ passwordData, setPasswordData ] = useState<UpdatePasswordData>({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [ createPasswordData, setCreatePasswordData ] = useState<CreatePasswordData>({
        newPassword: '',
        confirmPassword: ''
    });

    const [ pinData, setPinData ] = useState<UpdatePinData>({
        oldPin: '',
        newPin: '',
        confirmPin: ''
    });

    const [ createPinData, setCreatePinData ] = useState<CreatePinData>({
        newPin: '',
        confirmPin: ''
    });

    // Loading states for individual sections
    const [ loadingStates, setLoadingStates ] = useState({
        profile: false,
        password: false,
        pin: false,
        delete: false
    });

    // Initialize profile data from auth store
    useEffect(() => {
        if (user) {
            // Use the user data directly from auth store
            setCurrentUser(user);
            setProfileData({ name: user.name || '' });
        }
    }, [ user ]);

    // Update profile (name)
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!profileData.name.trim()) {
            toast.error('Name is required');
            return;
        }

        try {
            setLoadingStates(prev => ({ ...prev, profile: true }));

            const response = await httpClient.put('/users/profile', {
                name: profileData.name.trim()
            });

            if (response.success) {
                toast.success('Profile updated successfully');
                setCurrentUser(prev => prev ? { ...prev, name: profileData.name.trim() } : null);
                setUser({ ...user!, name: profileData.name.trim() });
            } else {
                toast.error(response.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update failed:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update profile');
        } finally {
            setLoadingStates(prev => ({ ...prev, profile: false }));
        }
    };

    // Create password (for first-time setup)
    const handleCreatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!createPasswordData.newPassword || !createPasswordData.confirmPassword) {
            toast.error('All password fields are required');
            return;
        }

        if (createPasswordData.newPassword !== createPasswordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (createPasswordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        try {
            setLoadingStates(prev => ({ ...prev, password: true }));

            const response = await httpClient.put('/users/password', {
                newPassword: createPasswordData.newPassword
            });

            if (response.success) {
                toast.success('Password created successfully');
                setCreatePasswordData({ newPassword: '', confirmPassword: '' });
                // Update user state to reflect password now exists
                setCurrentUser(prev => prev ? { ...prev, profileCompleted: true } : null);
            } else {
                toast.error(response.message || 'Failed to create password');
            }
        } catch (error) {
            console.error('Password creation failed:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to create password');
        } finally {
            setLoadingStates(prev => ({ ...prev, password: false }));
        }
    };

    // Update password
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error('All password fields are required');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters long');
            return;
        }

        try {
            setLoadingStates(prev => ({ ...prev, password: true }));

            const response = await httpClient.put('/users/password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });

            if (response.success) {
                toast.success('Password updated successfully');
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(response.message || 'Failed to update password');
            }
        } catch (error) {
            console.error('Password update failed:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update password');
        } finally {
            setLoadingStates(prev => ({ ...prev, password: false }));
        }
    };

    // Create PIN (for first-time setup)
    const handleCreatePin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!createPinData.newPin || !createPinData.confirmPin) {
            toast.error('All PIN fields are required');
            return;
        }

        if (createPinData.newPin !== createPinData.confirmPin) {
            toast.error('PINs do not match');
            return;
        }

        if (!/^\d{4,6}$/.test(createPinData.newPin)) {
            toast.error('PIN must be 4-6 digits');
            return;
        }

        try {
            setLoadingStates(prev => ({ ...prev, pin: true }));

            const response = await httpClient.put('/users/pin', {
                newPin: createPinData.newPin
            });

            if (response.success) {
                toast.success('PIN created successfully');
                setCreatePinData({ newPin: '', confirmPin: '' });
                // Update user state to reflect PIN now exists
                setCurrentUser(prev => prev ? { ...prev, profileCompleted: true } : null);
            } else {
                toast.error(response.message || 'Failed to create PIN');
            }
        } catch (error) {
            console.error('PIN creation failed:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to create PIN');
        } finally {
            setLoadingStates(prev => ({ ...prev, pin: false }));
        }
    };

    // Update PIN
    const handleUpdatePin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!pinData.oldPin || !pinData.newPin || !pinData.confirmPin) {
            toast.error('All PIN fields are required');
            return;
        }

        if (pinData.newPin !== pinData.confirmPin) {
            toast.error('New PINs do not match');
            return;
        }

        if (!/^\d{4,6}$/.test(pinData.newPin)) {
            toast.error('PIN must be 4-6 digits');
            return;
        }

        try {
            setLoadingStates(prev => ({ ...prev, pin: true }));

            const response = await httpClient.put('/users/pin', {
                oldPin: pinData.oldPin,
                newPin: pinData.newPin
            });

            if (response.success) {
                toast.success('PIN updated successfully');
                setPinData({ oldPin: '', newPin: '', confirmPin: '' });
            } else {
                toast.error(response.message || 'Failed to update PIN');
            }
        } catch (error) {
            console.error('PIN update failed:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update PIN');
        } finally {
            setLoadingStates(prev => ({ ...prev, pin: false }));
        }
    };

    // Delete account
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone.'
        );

        if (!confirmDelete) return;

        const finalConfirm = window.confirm(
            'This will permanently delete all your data. Type "DELETE" to confirm.'
        );

        if (!finalConfirm) return;

        try {
            setLoadingStates(prev => ({ ...prev, delete: true }));

            const response = await httpClient.delete('/users/me');

            if (response.success) {
                toast.success('Account deleted successfully');
                logout();
                // Redirect will happen automatically from logout
            } else {
                toast.error(response.message || 'Failed to delete account');
            }
        } catch (error) {
            console.error('Account deletion failed:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to delete account');
        } finally {
            setLoadingStates(prev => ({ ...prev, delete: false }));
        }
    };

    if (!user || !currentUser) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner className="w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
                </div>

                {/* Profile Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                            Update your personal information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={currentUser.email}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                    <p className="text-xs text-gray-500">Email cannot be changed</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ name: e.target.value })}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={loadingStates.profile}
                                className="w-full md:w-auto"
                            >
                                {loadingStates.profile ? (
                                    <>
                                        <Spinner className="w-4 h-4 mr-2" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Profile'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Password Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Password Settings</CardTitle>
                        <CardDescription>
                            {currentUser.profileCompleted ? 'Change your account password' : 'Set up your account password'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {currentUser.profileCompleted ? (
                            // Update existing password form
                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="oldPassword">Current Password</Label>
                                    <Input
                                        id="oldPassword"
                                        type="password"
                                        value={passwordData.oldPassword}
                                        onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                                        placeholder="Enter current password"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                            placeholder="Enter new password"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            placeholder="Confirm new password"
                                            required
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loadingStates.password}
                                    className="w-full md:w-auto"
                                >
                                    {loadingStates.password ? (
                                        <>
                                            <Spinner className="w-4 h-4 mr-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Password'
                                    )}
                                </Button>
                            </form>
                        ) : (
                            // Create new password form
                            <form onSubmit={handleCreatePassword} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="createNewPassword">Password</Label>
                                        <Input
                                            id="createNewPassword"
                                            type="password"
                                            value={createPasswordData.newPassword}
                                            onChange={(e) => setCreatePasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="createConfirmPassword">Confirm Password</Label>
                                        <Input
                                            id="createConfirmPassword"
                                            type="password"
                                            value={createPasswordData.confirmPassword}
                                            onChange={(e) => setCreatePasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            placeholder="Confirm your password"
                                            required
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Password must be at least 6 characters long.
                                </p>
                                <Button
                                    type="submit"
                                    disabled={loadingStates.password}
                                    className="w-full md:w-auto"
                                >
                                    {loadingStates.password ? (
                                        <>
                                            <Spinner className="w-4 h-4 mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Password'
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* PIN Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>PIN Settings</CardTitle>
                        <CardDescription>
                            {currentUser.profileCompleted ? 'Change your security PIN (4-6 digits)' : 'Set up your security PIN (4-6 digits)'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {currentUser.profileCompleted ? (
                            // Update existing PIN form
                            <form onSubmit={handleUpdatePin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="oldPin">Current PIN</Label>
                                    <Input
                                        id="oldPin"
                                        type="password"
                                        value={pinData.oldPin}
                                        onChange={(e) => setPinData(prev => ({ ...prev, oldPin: e.target.value }))}
                                        placeholder="Enter current PIN"
                                        maxLength={6}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="newPin">New PIN</Label>
                                        <Input
                                            id="newPin"
                                            type="password"
                                            value={pinData.newPin}
                                            onChange={(e) => setPinData(prev => ({ ...prev, newPin: e.target.value.replace(/\D/g, '') }))}
                                            placeholder="Enter new PIN"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPin">Confirm New PIN</Label>
                                        <Input
                                            id="confirmPin"
                                            type="password"
                                            value={pinData.confirmPin}
                                            onChange={(e) => setPinData(prev => ({ ...prev, confirmPin: e.target.value.replace(/\D/g, '') }))}
                                            placeholder="Confirm new PIN"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loadingStates.pin}
                                    className="w-full md:w-auto"
                                >
                                    {loadingStates.pin ? (
                                        <>
                                            <Spinner className="w-4 h-4 mr-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update PIN'
                                    )}
                                </Button>
                            </form>
                        ) : (
                            // Create new PIN form
                            <form onSubmit={handleCreatePin} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="createNewPin">PIN</Label>
                                        <Input
                                            id="createNewPin"
                                            type="password"
                                            value={createPinData.newPin}
                                            onChange={(e) => setCreatePinData(prev => ({ ...prev, newPin: e.target.value.replace(/\D/g, '') }))}
                                            placeholder="Enter your PIN"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="createConfirmPin">Confirm PIN</Label>
                                        <Input
                                            id="createConfirmPin"
                                            type="password"
                                            value={createPinData.confirmPin}
                                            onChange={(e) => setCreatePinData(prev => ({ ...prev, confirmPin: e.target.value.replace(/\D/g, '') }))}
                                            placeholder="Confirm your PIN"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                    PIN must be 4-6 digits long and contain only numbers.
                                </p>
                                <Button
                                    type="submit"
                                    disabled={loadingStates.pin}
                                    className="w-full md:w-auto"
                                >
                                    {loadingStates.pin ? (
                                        <>
                                            <Spinner className="w-4 h-4 mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create PIN'
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-600">Danger Zone</CardTitle>
                        <CardDescription>
                            Irreversible and destructive actions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <h3 className="font-semibold text-red-800 mb-2">Delete Account</h3>
                                <p className="text-red-600 text-sm mb-4">
                                    This action cannot be undone. This will permanently delete your account and all associated data.
                                </p>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteAccount}
                                    disabled={loadingStates.delete}
                                    className="w-full md:w-auto"
                                >
                                    {loadingStates.delete ? (
                                        <>
                                            <Spinner className="w-4 h-4 mr-2" />
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete Account'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
