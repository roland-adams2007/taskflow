import { useState } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CheckSquare, User, Mail, Lock, LockKeyhole, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAlert } from '../../context/Alert/UseAlert';
import { useCookies } from 'react-cookie';

export default function RegisterForm() {
    const { VITE_BACKEND_URL } = import.meta.env;
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [, setCookie] = useCookies(["session_meta"]);
    const redirectParam = new URLSearchParams(location.search).get("redirect");
    const redirect = redirectParam ? decodeURIComponent(redirectParam) : '/dashboard';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const togglePassword = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else if (field === 'confirmPassword') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            showAlert("Passwords don't match", 'error');
            setIsSubmitting(false);
            return;
        }

        // Prepare data for API (remove confirmPassword as it's not needed for backend)
        const { confirmPassword, ...submitData } = formData;

        fetch(`${VITE_BACKEND_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submitData),
        })
            .then((response) => {
                return response.json();
            })
            .then((res) => {
                const { status, message, data } = res;
                if (status != 200) {
                    showAlert(message || 'Unable to register.');
                    return;
                }
                let secondsLeft = 86400;
                let expiryDate = new Date(Date.now() + secondsLeft * 1000);
                setCookie("session_meta", data.accessToken, {
                    path: "/",
                    expires: expiryDate,
                });
                navigate(redirect, { replace: true });
            })
            .catch((error) => {
                const errRes = error.response?.data || {};
                let message = errRes.message || "Something went wrong. Please try again.";
                showAlert(message, 'error');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            <div className="flex w-full min-h-screen">
                <div className="flex-1 p-8 lg:p-16 flex items-center justify-center bg-white">
                    <div className="w-full max-w-lg">
                        <div className="mb-9 flex items-center justify-center flex-col gap-3">
                            <div className="flex items-center gap-3 text-2xl font-bold">
                                <CheckSquare className="text-blue-500 text-3xl" />
                                <span>TaskFlow</span>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                Create your account
                            </h2>
                            <p className="text-gray-500 text-base">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-500 font-semibold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="flex gap-4 mb-5 flex-col sm:flex-row">
                                <div className="flex-1">
                                    <label
                                        htmlFor="fname"
                                        className="block mb-2 font-medium text-slate-700 text-sm"
                                    >
                                        First name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                        <input
                                            type="text"
                                            id="fname"
                                            name="fname"
                                            value={formData.fname}
                                            onChange={handleChange}
                                            placeholder="John"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-base bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label
                                        htmlFor="lname"
                                        className="block mb-2 font-medium text-slate-700 text-sm"
                                    >
                                        Last name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                        <input
                                            type="text"
                                            id="lname"
                                            name="lname"
                                            value={formData.lname}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-base bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-5">
                                <label
                                    htmlFor="email"
                                    className="block mb-2 font-medium text-slate-700 text-sm"
                                >
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-base bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                            <div className="mb-5">
                                <label
                                    htmlFor="password"
                                    className="block mb-2 font-medium text-slate-700 text-sm"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a strong password"
                                        required
                                        className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl text-base bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-400 hover:text-gray-600 text-lg p-1"
                                        onClick={() => togglePassword('password')}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="mb-5">
                                <label
                                    htmlFor="confirmPassword"
                                    className="block mb-2 font-medium text-slate-700 text-sm"
                                >
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        required
                                        className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl text-base bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-400 hover:text-gray-600 text-lg p-1"
                                        onClick={() => togglePassword('confirmPassword')}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5 mb-6">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="w-4 h-4 cursor-pointer accent-blue-500 mt-0.5 flex-shrink-0"
                                />
                                <label
                                    htmlFor="terms"
                                    className="text-sm text-gray-600 cursor-pointer leading-tight"
                                >
                                    I agree to TaskFlow's{' '}
                                    <a href="#" className="text-blue-500 font-medium hover:underline">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-blue-500 font-medium hover:underline">
                                        Privacy Policy
                                    </a>
                                </label>
                            </div>
                            <div className="flex items-start gap-2.5 mb-6">
                                <input
                                    type="checkbox"
                                    id="newsletter"
                                    className="w-4 h-4 cursor-pointer accent-blue-500 mt-0.5 flex-shrink-0"
                                />
                                <label
                                    htmlFor="newsletter"
                                    className="text-sm text-gray-600 cursor-pointer leading-tight"
                                >
                                    Send me product updates and helpful tips via email
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-blue-500 text-white border-none rounded-xl text-base font-semibold cursor-pointer hover:bg-blue-600 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-md disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create account
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}