import React, { useState, useEffect } from 'react';
import {
    Menu,
    Search,
    ListChecks,
    TrendingUp,
    CheckCircle,
    TrendingDown,
    Clock,
    Folder,
    ArrowRight,
    Check,
    Users,
    AlertTriangle,
    MoreVertical
} from 'lucide-react';
import { useGlobal } from '../context/Global/useGlobal';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const {
        teamMembers,
        fetchLoading,
        fetchTeamMembers,
        projects,
        getTasks,
        tasks,
        taskFetchLoading,
        projectFetchLoading,
        user,
        userLoading
    } = useGlobal();
    const [stats, setStats] = useState({
        activeTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        totalProjects: 0,
        teamMembersCount: 0
    });
    const [todayTasks, setTodayTasks] = useState([]);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        fetchTeamMembers();
        getTasks();
    }, []);

    useEffect(() => {
        setStatsLoading(true);
        const activeTasks = tasks.filter(task =>
            task.status !== 'completed' &&
            new Date(task.due_date) >= new Date()
        ).length;
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const overdueTasks = tasks.filter(task =>
            task.status !== 'completed' &&
            new Date(task.due_date) < new Date()
        ).length;
        const today = new Date().toISOString().split('T')[0];
        const todaysTasks = tasks.filter(task =>
            task.due_date &&
            task.due_date.split('T')[0] === today
        );
        setStats({
            activeTasks,
            completedTasks,
            overdueTasks,
            totalProjects: projects.length,
            teamMembersCount: teamMembers.length
        });
        setTodayTasks(todaysTasks);
        setStatsLoading(false);
    }, [tasks, projects, teamMembers]);

    const handleTaskClick = (e, taskId) => {
        if (!e.target.closest('.task-checkbox')) {
            navigate(`/tasks/${taskId}`);
        }
    };

    const handleProjectClick = (projectId) => {
        navigate(`/projects/${projectId}`);
    };

    const handleTaskToggle = async (taskId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        } catch (error) {
        }
    };

    const StatsSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border-2 border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                        <div className="w-16 h-6 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
            ))}
        </div>
    );

    const TasksSkeleton = () => (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl border-2 border-gray-100 mb-3 animate-pulse">
                    <div className="w-5 h-5 bg-gray-200 rounded-md"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="flex gap-2">
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const TeamSkeleton = () => (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg animate-pulse">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-1">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                    </div>
                ))}
            </div>
        </div>
    );

    const ProjectsSkeleton = () => (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="border-2 border-gray-200 rounded-xl p-5 animate-pulse">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                            <div className="w-5 h-5 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
                        <div className="space-y-2 mb-3">
                            <div className="h-1.5 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                        </div>
                        <div className="flex">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-7 h-7 bg-gray-200 rounded-full -ml-2 first:ml-0"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 mb-8 w-full">
                <div className="flex flex-col gap-1 w-full lg:w-auto">
                    <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        {userLoading ? (
                            <div className="flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 animate-spin text-blue-600"
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
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                                <span>Loading user...</span>
                            </div>
                        ) : (
                            <>Welcome back, {user?.fname || user?.lname || 'User'}! 👋</>
                        )}
                    </h1>

                    <p className="text-gray-500 text-sm sm:text-base">
                        Here's what's happening with your projects today
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto lg:min-w-fit">
                    <div className="relative w-full sm:w-64 lg:w-72">
                        <Search
                            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search tasks, projects..."
                            className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                    </div>
                </div>
            </header>
            {statsLoading ? (
                <StatsSkeleton />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-500 text-2xl">
                                <ListChecks size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${stats.activeTasks > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                <TrendingUp size={14} />
                                {stats.activeTasks > 0 ? 'Active' : 'None'}
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.activeTasks}</div>
                        <div className="text-gray-500 text-sm">Active Tasks</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-500 text-2xl">
                                <CheckCircle size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${stats.completedTasks > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                <TrendingUp size={14} />
                                {stats.completedTasks > 0 ? `${Math.round((stats.completedTasks / (stats.completedTasks + stats.activeTasks)) * 100)}%` : '0%'}
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.completedTasks}</div>
                        <div className="text-gray-500 text-sm">Completed</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 text-2xl">
                                <AlertTriangle size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${stats.overdueTasks > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                {stats.overdueTasks > 0 ? <TrendingDown size={14} /> : <CheckCircle size={14} />}
                                {stats.overdueTasks > 0 ? 'Overdue' : 'On Track'}
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.overdueTasks}</div>
                        <div className="text-gray-500 text-sm">Overdue</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-500 text-2xl">
                                <Folder size={24} />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-600 px-2 py-1 rounded-md">
                                <Users size={14} />
                                {stats.teamMembersCount}
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.totalProjects}</div>
                        <div className="text-gray-500 text-sm">Active Projects</div>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-6">
                {statsLoading || taskFetchLoading ? (
                    <TasksSkeleton />
                ) : (
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Today's Tasks</h2>
                            <Link
                                to="/projects"
                                className="text-blue-500 text-sm font-semibold flex items-center gap-1 hover:underline"
                            >
                                View all
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                        {todayTasks.length > 0 ? (
                            todayTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-start gap-4 p-4 rounded-xl border-2 border-gray-100 mb-3 hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
                                    onClick={(e) => handleTaskClick(e, task.id)}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-md border-2 ${task.status === 'completed' ? 'border-blue-500 bg-blue-500 flex items-center justify-center text-white' : 'border-gray-300'} cursor-pointer mt-0.5 flex-shrink-0`}
                                        onClick={() => handleTaskToggle(task.id, task.status)}
                                    >
                                        {task.status === 'completed' && <Check size={12} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`text-base font-semibold mb-1.5 ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
                                            {task.title}
                                        </div>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                                <Folder size={14} />
                                                {task.project_name || 'No Project'}
                                            </div>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase ${task.priority === 'high' ? 'bg-red-100 text-red-600' : task.priority === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}
                                            >
                                                {task.priority || 'low'}
                                            </span>
                                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                <Clock size={14} />
                                                {task.due_date ? new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No time'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <ListChecks size={48} className="mx-auto mb-3 text-gray-300" />
                                <p>No tasks for today</p>
                            </div>
                        )}
                    </div>
                )}
                {statsLoading || fetchLoading ? (
                    <TeamSkeleton />
                ) : (
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Team</h2>
                            <Link
                                to="/teams"
                                className="text-blue-500 text-sm font-semibold flex items-center gap-1 hover:underline"
                            >
                                View all
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            {teamMembers.slice(0, 4).map((member) => (
                                <div
                                    key={member.uuid}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
                                >
                                    <div
                                        className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-semibold text-sm text-white flex-shrink-0"
                                    >
                                        {member?.fname && member?.lname ? (member.fname[0] + member.lname[0]).toUpperCase() : 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold mb-0.5">
                                            {member?.fname || 'Unknown'} {member?.lname || ''}
                                            {member.alias && (
                                                <span className="text-gray-400 text-xs ml-1">({member?.alias || 'No alias'})</span>
                                            )}
                                        </h4>
                                        <p className="text-xs text-gray-500">{member?.role || 'Team Member'}</p>
                                    </div>
                                    <div
                                        className={`w-2 h-2 ${member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'} rounded-full flex-shrink-0`}
                                    />
                                </div>
                            ))}
                            {teamMembers.length === 0 && (
                                <div className="text-center py-4 text-gray-500">
                                    <Users size={32} className="mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No team members</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {statsLoading || projectFetchLoading ? (
                <ProjectsSkeleton />
            ) : (
                <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mt-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Active Projects</h2>
                        <a
                            href="#"
                            className="text-blue-500 text-sm font-semibold flex items-center gap-1 hover:underline"
                        >
                            View all
                            <ArrowRight size={16} />
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {projects.slice(0, 6).map((project) => {
                            const projectTasks = tasks.filter(task => task.project_id === project.id);
                            const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
                            const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;
                            return (
                                <div
                                    key={project.uuid}
                                    className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => handleProjectClick(project.uuid)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-3 h-3 bg-blue-500 rounded-sm mt-1" />
                                        <MoreVertical className="text-gray-400 text-lg" size={20} />
                                    </div>
                                    <h3 className="text-base font-semibold mb-2">{project.name}</h3>
                                    <p className="text-gray-500 text-sm mb-4">
                                        {projectTasks.length} tasks • {completedTasks} completed
                                    </p>
                                    <div className="mb-3">
                                        <div className="w-full h-1.5 bg-gray-100 rounded-sm overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-sm"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">{progress}% complete</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-xs text-gray-600">
                                            {projectTasks.length}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {projects.length === 0 && (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                <Folder size={48} className="mx-auto mb-3 text-gray-300" />
                                <p>No projects found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}