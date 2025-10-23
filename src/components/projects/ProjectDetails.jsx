import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobal } from '../../context/Global/useGlobal';
import { useAlert } from '../../context/Alert/UseAlert';
import { ListChecks, CheckCircle, Clock, Users, Plus, Filter, Calendar, MoreVertical, UserPlus, MessageCircle, ArrowLeft, X } from 'lucide-react';
import axiosInstance from '../../api/axiosinstance';

const ProjectDetails = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const { showAlert } = useAlert();
    const { projectDetails, projectDetailsFetchLoading, getProjectDetails, getProjectTeam, projectTeam, projectTeamFetchLoading, user } = useGlobal();
    const [comment, setComment] = useState('');
    const [isCommentLoading, setIsCommentLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [isAddingTeam, setIsAddingTeam] = useState(false);

    useEffect(() => {
        if (projectId) {
            getProjectDetails(projectId);
            fetchComments(projectId);
            getProjectTeam(projectId);
        }
    }, [projectId]);

    const fetchComments = async (projectId) => {
        try {
            const response = await axiosInstance.get(`/projects/s/comment?qid=${projectId}`);
            const res = response.data;
            setComments(res.data);
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch comments';
            showAlert(message, 'error');
        }
    };

    const handleCommentSubmit = async () => {
        if (!comment.trim()) {
            showAlert('Please enter a comment', 'error');
            return;
        }
        setIsCommentLoading(true);
        try {
            const response = await axiosInstance.post('/projects/comment', {
                projectId: projectId,
                comment: comment.trim(),
            });
            const res = response.data;
            const newComment = {
                id: res.data?.id || Date.now(),
                comment: comment.trim(),
                created_at: new Date().toISOString(),
                user_uuid: res.data?.user_uuid || 'current-user-uuid',
                fname: res.data?.fname || 'Current',
                lname: res.data?.lname || 'User',
            };
            setComments((prevComments) => [newComment, ...prevComments]);
            setComment('');
            showAlert(res.message || 'Comment posted successfully', 'success');
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to post comment';
            showAlert(message, 'error');
        } finally {
            setIsCommentLoading(false);
        }
    };

    const handleAddTeam = async () => {
        if (!selectedTeam) {
            showAlert('Please select a team', 'error');
            return;
        }
        setIsAddingTeam(true);
        try {
            const response = await axiosInstance.post('/projects/add-team', {
                projectId: projectId,
                teamId: selectedTeam,
            });
            const res = response.data;
            showAlert(res.message || 'Team added successfully', 'success');
            setShowTeamModal(false);
            setSelectedTeam('');
            getProjectTeam(projectId);
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to add team';
            showAlert(message, 'error');
        } finally {
            setIsAddingTeam(false);
        }
    };

    const handleAddTask = () => {
        navigate(`/tasks/add?project=${projectId}`);
    };

    const getExistingTeammateIds = () => {
        return projectDetails?.teammates?.map(teammate => teammate.uuid) || [];
    };

    const getAvailableTeams = () => {
        const existingIds = getExistingTeammateIds();
        return projectTeam?.filter(team => !existingIds.includes(team.uuid)) || [];
    };

    const SkeletonLoader = () => (
        <div className="animate-pulse max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                <div className="h-10 w-64 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-96 bg-gray-200 rounded mb-6"></div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
                        <div className="h-3 w-full bg-gray-100 rounded-full"></div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                        <div className="flex gap-4 overflow-x-auto">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="min-w-[280px] h-64 bg-gray-100 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (projectDetailsFetchLoading) {
        return <SkeletonLoader />;
    }

    if (!projectDetails) {
        return (
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ListChecks className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">No project details available</p>
                </div>
            </div>
        );
    }

    const { name, description, color, start_date, end_date, tasks, teammates, created_by } = projectDetails;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const isCreator = user?.uuid == created_by;


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatCommentDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const tasksByStatus = {
        'to-do': tasks.filter(task => task.status === 'to-do'),
        'in-progress': tasks.filter(task => task.status === 'in-progress'),
        'review': tasks.filter(task => task.status === 'review'),
        'done': tasks.filter(task => task.status === 'done'),
    };

    const statusConfig = {
        'to-do': { label: 'To Do', color: 'bg-gray-200 text-gray-700' },
        'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
        'review': { label: 'Review', color: 'bg-yellow-100 text-yellow-700' },
        'done': { label: 'Done', color: 'bg-green-100 text-green-700' },
    };

    const availableTeams = getAvailableTeams();
    const hasAvailableTeams = availableTeams.length > 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <button
                    onClick={() => navigate('/projects')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Back to Projects</span>
                </button>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{name}</h1>
                            <p className="text-gray-600 text-sm sm:text-base max-w-3xl">{description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {isCreator && (
                                <button
                                    onClick={handleAddTask}
                                    className="px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all shadow-sm hover:shadow flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="hidden sm:inline">Add Task</span>
                                </button>
                            )}
                            <button
                                className="px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all"
                            >
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 sm:p-5 rounded-xl border border-blue-200/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <ListChecks className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalTasks}</div>
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-gray-600">Total Tasks</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-4 sm:p-5 rounded-xl border border-green-200/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{completedTasks}</div>
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-gray-600">Completed</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 sm:p-5 rounded-xl border border-orange-200/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{inProgressTasks}</div>
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-gray-600">In Progress</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 sm:p-5 rounded-xl border border-purple-200/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{teammates.length}</div>
                            </div>
                            <div className="text-xs sm:text-sm font-medium text-gray-600">Team Members</div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Project Progress</h2>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-blue-500">{progressPercentage}%</span>
                                    <span className="text-sm text-gray-500">complete</span>
                                </div>
                            </div>
                            <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600">
                                <span>{completedTasks} of {totalTasks} tasks completed</span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    Due: {formatDate(end_date)}
                                </span>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">Task Board</h2>
                            <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 sm:mx-0 sm:px-0">
                                {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                                    <div key={status} className="flex-shrink-0 w-[280px] sm:w-[300px]">
                                        <div className="bg-gray-50 rounded-xl p-4 h-full">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold text-sm text-gray-700">
                                                    {statusConfig[status].label}
                                                </h3>
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig[status].color}`}>
                                                    {statusTasks.length}
                                                </span>
                                            </div>
                                            <div className="space-y-3">
                                                {statusTasks.map(task => (
                                                    <div
                                                        key={task.id}
                                                        className={`bg-white p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer ${status === 'done' ? 'opacity-60' : ''}`}
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h4 className={`font-semibold text-sm text-gray-900 pr-2 ${status === 'done' ? 'line-through' : ''}`}>
                                                                {task.title}
                                                            </h4>
                                                            <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <p className={`text-gray-600 text-xs mb-3 line-clamp-2 ${status === 'done' ? 'line-through' : ''}`}>
                                                            {task.description}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                <span>{formatDate(task.due_date)}</span>
                                                            </div>
                                                            <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-xs font-medium text-white">
                                                                {task.assignee_fname[0]}{task.assignee_lname[0]}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Team</h2>
                                <button
                                    onClick={() => setShowTeamModal(true)}
                                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors flex items-center gap-2"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    <span className="hidden sm:inline">Add</span>
                                </button>
                            </div>
                            <div className="space-y-3">
                                {teammates.map(member => (
                                    <div
                                        key={member.uuid}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group"
                                    >
                                        <div className="w-11 h-11 bg-blue-500 rounded-full flex items-center justify-center font-semibold text-sm text-white flex-shrink-0">
                                            {member.fname[0]}{member.lname[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-gray-900 truncate">
                                                {member.fname} {member.lname}
                                            </h4>
                                            <p className="text-xs text-gray-500">{member.role}</p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {member.role === 'Creator' && (
                                                <span className="text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
                                                    Lead
                                                </span>
                                            )}
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">Comments</h2>
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <textarea
                                        className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        rows="4"
                                        placeholder="Write a comment..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        disabled={isCommentLoading}
                                    ></textarea>
                                    <button
                                        onClick={handleCommentSubmit}
                                        className="w-full sm:w-auto px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                        disabled={isCommentLoading}
                                    >
                                        {isCommentLoading ? (
                                            <>
                                                <svg
                                                    className="animate-spin w-4 h-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Posting...
                                            </>
                                        ) : (
                                            <>
                                                <MessageCircle className="w-4 h-4" />
                                                Post Comment
                                            </>
                                        )}
                                    </button>
                                </div>
                                {comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {comments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="flex items-start gap-3 p-3 rounded-xl bg-gray-50"
                                            >
                                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                    {comment.fname[0]}{comment.lname[0]}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="text-sm font-semibold text-gray-900">
                                                            {comment.fname} {comment.lname}
                                                        </h4>
                                                        <span className="text-xs text-gray-500">
                                                            {formatCommentDate(comment.created_at)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{comment.comment}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <MessageCircle className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-500">No comments yet</p>
                                        <p className="text-xs text-gray-400 mt-1">Be the first to comment</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showTeamModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Add Team to Project</h3>
                            <button
                                onClick={() => setShowTeamModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Team
                                </label>
                                {projectTeamFetchLoading ? (
                                    <div className="flex items-center justify-center py-3">
                                        <svg
                                            className="animate-spin h-5 w-5 text-blue-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            ></path>
                                        </svg>
                                        <span className="ml-2 text-sm text-gray-500">Loading teams...</span>
                                    </div>
                                ) : (
                                    <>
                                        <select
                                            value={selectedTeam}
                                            onChange={(e) => setSelectedTeam(e.target.value)}
                                            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            disabled={isAddingTeam || !hasAvailableTeams}
                                        >
                                            <option defaultValue="" selected disabled>
                                                {hasAvailableTeams ? '---- Select ----' : 'No available teams'}
                                            </option>
                                            {availableTeams.map((team) => (
                                                <option key={team.uuid} value={team.uuid}>
                                                    {team.fname} {team.lname} — {team.team_role}
                                                </option>
                                            ))}
                                        </select>
                                        {!hasAvailableTeams && (
                                            <p className="text-sm text-gray-500 mt-2 text-center">
                                                All teams are already added to this project
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowTeamModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                                    disabled={isAddingTeam}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddTeam}
                                    className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                    disabled={isAddingTeam || !selectedTeam || !hasAvailableTeams}
                                >
                                    {isAddingTeam ? (
                                        <>
                                            <svg
                                                className="animate-spin w-4 h-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Adding...
                                        </>
                                    ) : (
                                        'Continue'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;