import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosinstance";
import { useAlert } from "../context/Alert/UseAlert";
import { useAuth } from "../context/Auth/useAuth";
import {
    UserPlus,
    Users,
    User,
    Calendar,
    CheckCircle,
    Loader2,
    Check,
    CheckSquare,
} from "lucide-react";

const TeamInvite = () => {
    const { token } = useParams();
    const { showAlert } = useAlert();
    const { user, fetchCurrentUser } = useAuth();
    const navigate = useNavigate();

    const [inviteData, setInviteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [joined, setJoined] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCurrentUser();
        async function fetchInviteDetails() {
            if (!token) {
                setError("Invalid invitation link: Token is missing.");
                setLoading(false);
                showAlert("Error: Invalid token.", "error");
                return;
            }

            try {
                const response = await axiosInstance.get(`/teams/invite?token=${token}`);
                if (response.data.status === 200) {
                    setInviteData(response.data.data);
                } else {
                    setError(response.data.message || "Failed to retrieve invite details.");
                    showAlert(`Error: ${response.data.message}`, "error");
                }
            } catch (err) {
                if (err.response && err.response.status === 400) {
                    setError("Bad request: Invalid or expired token.");
                    showAlert("Error: Invalid token or bad request.", "error");
                } else {
                    setError("An error occurred while fetching invite details.");
                    showAlert("Error: Failed to load invite.", "error");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchInviteDetails();
    }, [token, showAlert]);

    const calculateExpiresIn = (expiresAt) => {
        if (!expiresAt) return "Unknown";

        const expiresDate = new Date(expiresAt);
        const now = new Date();
        const diffTime = expiresDate - now;

        if (diffTime <= 0) return "Expired";

        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

        if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? "s" : ""} ${diffMinutes > 0
                ? `${diffMinutes} min${diffMinutes > 1 ? "s" : ""}`
                : ""
                }`;
        } else {
            return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
        }
    };

    const handleJoin = async () => {
        if (!user) {
            showAlert("Please log in to join the team.", "info");
            navigate("/login");
            return;
        }

        if (!token || joining || joined) return;

        setJoining(true);
        try {
            const response = await axiosInstance.post(`/teams/accept-invite`, { token });
            if (response.data.status == 200) {
                setJoined(true);
                showAlert("Success: You've joined the team!", "success");
                navigate('/teams');
            } else {
                showAlert(`Error: ${response.data.message}`, "error");
            }
        } catch (error) {
            const errRes = error.response?.data || {};
            let message = errRes.message || "Something went wrong. Please try again.";
            showAlert(message, 'error');
        } finally {
            setJoining(false);
        }
    };

    const handleDecline = async () => {
        if (!token) {
            showAlert("Invalid invitation token.", "error");
            return;
        }
        try {
            const response = await axiosInstance.post("/teams/decline-invite", { token });
            if (response.data.status == 200) {
                showAlert("You have declined the invitation.", "success");
                navigate("/teams");
            } else {
                showAlert(`Error: ${response.data.message}`, "error");
            }
        } catch (error) {
            const errRes = error.response?.data || {};
            let message = errRes.message || "Something went wrong. Please try again.";
            showAlert(message, 'error');
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (error || !inviteData) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 text-slate-900">
                <div className="max-w-md w-full bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm text-center">
                    <h1 className="text-2xl font-bold mb-2">Error</h1>
                    <p className="text-gray-500">{error || "No invite data available."}</p>
                </div>
            </div>
        );
    }

    const inviterInitials =
        inviteData.inviter.fname[0] + inviteData.inviter.lname[0];
    const inviterName = `${inviteData.inviter.fname} ${inviteData.inviter.lname}`;
    const expiresIn = calculateExpiresIn(inviteData.expires_at);
    const teammateCount = inviteData.teammate_count;
    const memberText = `${teammateCount} teammate${teammateCount !== 1 ? "s" : ""
        }`;

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 text-slate-900">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-3 text-2xl font-bold">
                        <CheckSquare className="text-blue-500" size={36} />
                        <span>TaskFlow</span>
                    </div>
                </div>

                {/* Invitation Card */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="text-blue-500" size={36} />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Team Invitation</h1>
                        <p className="text-gray-500">
                            You've been invited to join a team on TaskFlow
                        </p>
                    </div>

                    {/* Team Details */}
                    <div className="bg-gray-50 rounded-xl p-5 mb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                                {inviterInitials}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Team on TaskFlow</h3>
                                <p className="text-gray-500 text-sm">
                                    {memberText} • Projects ongoing
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            <User className="text-gray-400" size={16} />
                            <p className="text-sm text-gray-600">
                                Invited by: <span className="font-medium">{inviterName}</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="text-gray-400" size={16} />
                            <p className="text-sm text-gray-600">
                                Expires in: <span className="font-medium">{expiresIn}</span>
                            </p>
                        </div>
                    </div>

                    {/* Team Members Preview */}
                    <div className="mb-8">
                        <h3 className="font-semibold mb-3 text-gray-700">Team Members</h3>
                        <div className="flex -space-x-2">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white">
                                {inviterInitials}
                            </div>
                            {teammateCount > 0 && (
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-semibold border-2 border-white">
                                    +{teammateCount}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Join Button */}
                    <button
                        onClick={handleJoin}
                        disabled={joining || joined}
                        className={`w-full py-4 text-white border-none rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${joined
                            ? "bg-green-500 cursor-default"
                            : "bg-blue-500 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg"
                            }`}
                    >
                        {joining ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : joined ? (
                            <Check size={24} />
                        ) : (
                            <UserPlus size={24} />
                        )}
                        {joining
                            ? "Joining..."
                            : joined
                                ? "Joined Successfully"
                                : user
                                    ? "Join Team"
                                    : "Login to Join"}
                    </button>

                    {/* Decline Link */}
                    <div className="text-center mt-4">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDecline();
                            }}
                            className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                        >
                            Not interested? Decline invitation
                        </a>
                    </div>
                </div>

                {/* Success Message */}
                {joined && (
                    <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="text-green-500" size={24} />
                        </div>
                        <h3 className="font-semibold text-green-800 mb-1">
                            Welcome to the team!
                        </h3>
                        <p className="text-green-600 text-sm">
                            You've successfully joined the team on TaskFlow.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamInvite;
