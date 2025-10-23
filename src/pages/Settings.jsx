import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosinstance';
import { useAlert } from '../context/Alert/UseAlert';
import { useGlobal } from '../context/Global/useGlobal';
import { useCookies } from "react-cookie";
import {
    User,
    Key,
    Bell,
    Palette,
    Shield,
    Camera,
    LogOut,
    Loader,
} from 'lucide-react';

const Settings = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const { user, logout } = useGlobal();
    const [activeSection, setActiveSection] = useState('profile');
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["session_meta"]);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleNavClick = (section) => {
        setActiveSection(section);
    };

    const handleLogout = () => {
        setLoggingOut(true);
        logout()
            .then(response => {
                if (response.status == 200) {
                    removeCookie("session_meta", { path: "/" });
                    showAlert(response.message || "You have been logged out successfully!", 'success');
                } else {
                    alert(response.message || "Logout failed. Please try again.");
                }
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                let message = errRes.message || "Something went wrong. Please try again.";
                showAlert(message, 'error');
            })
            .finally(() => {
                setLoggingOut(false);
                window.location.href = '/login';
            });
    };


    const closeLogoutModal = () => {
        setIsLogoutModalOpen(false);
    };

    const initials = user
        ? `${user?.fname?.[0] || ''}${user.lname?.[0] || ''}`
        : 'TF';

    return (
        <main>
            {/* Header */}
            <header className="flex justify-between items-center mb-8 flex-col md:flex-row gap-4">
                <div className="flex items-center gap-4 w-full">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Settings </h1>
                        <p className="text-gray-500 text-base">
                            Manage your account and preferences
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="w-11 h-11 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all relative">
                        <Bell className="text-xl text-gray-600" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>
            </header>

            {/* Settings Content */}
            <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
                {/* Settings Navigation */}
                <div className="bg-white rounded-xl border-2 border-gray-200 p-4 h-fit">
                    <nav className="flex flex-col gap-1">
                        <button
                            onClick={() => handleNavClick('profile')}
                            className={`flex items-center gap-3 p-3 rounded-lg text-slate-700 hover:bg-gray-50 transition-all cursor-pointer ${activeSection === 'profile'
                                ? 'bg-blue-50 text-blue-600'
                                : ''
                                }`}
                        >
                            <User className="text-lg" />
                            <span className="text-sm font-medium">Profile</span>
                        </button>
                        <button
                            onClick={() => handleNavClick('account')}
                            className={`flex items-center gap-3 p-3 rounded-lg text-slate-700 hover:bg-gray-50 transition-all cursor-pointer ${activeSection === 'account'
                                ? 'bg-blue-50 text-blue-600'
                                : ''
                                }`}
                        >
                            <Key className="text-lg" />
                            <span className="text-sm font-medium">Account</span>
                        </button>
                        <button
                            onClick={() => handleNavClick('notifications')}
                            className={`flex items-center gap-3 p-3 rounded-lg text-slate-700 hover:bg-gray-50 transition-all cursor-pointer ${activeSection === 'notifications'
                                ? 'bg-blue-50 text-blue-600'
                                : ''
                                }`}
                        >
                            <Bell className="text-lg" />
                            <span className="text-sm font-medium">Notifications</span>
                        </button>
                        <button
                            onClick={() => handleNavClick('appearance')}
                            className={`flex items-center gap-3 p-3 rounded-lg text-slate-700 hover:bg-gray-50 transition-all cursor-pointer ${activeSection === 'appearance'
                                ? 'bg-blue-50 text-blue-600'
                                : ''
                                }`}
                        >
                            <Palette className="text-lg" />
                            <span className="text-sm font-medium">Appearance</span>
                        </button>
                        <button
                            onClick={() => handleNavClick('privacy')}
                            className={`flex items-center gap-3 p-3 rounded-lg text-slate-700 hover:bg-gray-50 transition-all cursor-pointer ${activeSection === 'privacy'
                                ? 'bg-blue-50 text-blue-600'
                                : ''
                                }`}
                        >
                            <Shield className="text-lg" />
                            <span className="text-sm font-medium">Privacy</span>
                        </button>
                    </nav>
                </div>

                {/* Settings Content Area */}
                <div className="space-y-6">
                    {/* Profile Section */}
                    {activeSection === 'profile' && (
                        <div id="profile-section" className="bg-white rounded-xl border-2 border-gray-200 p-6">
                            <h2 className="text-xl font-bold mb-6">Profile Information</h2>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center font-bold text-3xl text-white">
                                        {initials}
                                    </div>
                                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-all">
                                        <Camera className="text-sm" />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Profile Photo</h3>
                                    <p className="text-sm text-gray-500 mb-3">
                                        Update your profile picture
                                    </p>
                                    <button className="text-sm text-red-500 font-semibold hover:text-red-600 transition-all">
                                        Remove Photo
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={user?.fname || ''}
                                            readOnly
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={user?.lname || ''}
                                            readOnly
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        UUID
                                    </label>
                                    <input
                                        type="text"
                                        value={user?.uuid || ''}
                                        readOnly
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Account Section */}
                    {activeSection === 'account' && (
                        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                            <h2 className="text-xl font-bold mb-6">Account Settings</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-base font-semibold mb-4">
                                        Change Password
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all">
                                            Update Password
                                        </button>
                                    </div>
                                </div>

                                <hr className="border-gray-200" />

                                <div>
                                    <h3 className="text-base font-semibold mb-2">
                                        Two-Factor Authentication
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Add an extra layer of security to your account
                                    </p>
                                    <button className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all">
                                        Enable 2FA
                                    </button>
                                </div>

                                <hr className="border-gray-200" />

                                <div>
                                    <h3 className="text-base font-semibold mb-2 text-red-600">
                                        Danger Zone
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Permanently delete your account and all data
                                    </p>
                                    <button className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Section */}
                    {activeSection === 'notifications' && (
                        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                            <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="text-sm font-semibold mb-1">
                                            Email Notifications
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Receive email updates about your tasks
                                        </p>
                                    </div>
                                    <label className="relative inline-block w-12 h-6 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="text-sm font-semibold mb-1">
                                            Push Notifications
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Get push notifications on desktop
                                        </p>
                                    </div>
                                    <label className="relative inline-block w-12 h-6 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="text-sm font-semibold mb-1">
                                            Task Reminders
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Remind me about upcoming deadlines
                                        </p>
                                    </div>
                                    <label className="relative inline-block w-12 h-6 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="text-sm font-semibold mb-1">
                                            Team Updates
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Notify me when team members comment
                                        </p>
                                    </div>
                                    <label className="relative inline-block w-12 h-6 cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Logout Section */}
                    {activeSection === 'privacy' && (
                        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                            <h2 className="text-xl font-bold mb-4">Session Management</h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Sign out of your account on this device
                            </p>
                            <button
                                onClick={() => setIsLogoutModalOpen(true)}
                                className="px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 transition-all flex items-center gap-2"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-transform duration-300 scale-100">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogOut className="text-red-500 text-3xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-center mb-2">Logout</h2>
                        <p className="text-gray-500 text-center mb-6">
                            Are you sure you want to logout from TaskFlow?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={closeLogoutModal}
                                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                                disabled={loggingOut}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                                disabled={loggingOut}
                            >
                                {loggingOut ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Logging out...
                                    </>
                                ) : (
                                    'Logout'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Settings;