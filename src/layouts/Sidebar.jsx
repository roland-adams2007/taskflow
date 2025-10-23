import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    CheckSquare,
    X,
    LayoutDashboard,
    CheckCircle2,
    Inbox,
    Calendar,
    Folder,
    PlusCircle,
    Users,
    Settings,
} from 'lucide-react';
import { useAuth } from '../context/Auth/useAuth';
import { useGlobal } from '../context/Global/useGlobal';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { loadingProfile, user, fetchCurrentUser } = useAuth();
    const { fetchAllProjects, projects, projectFetchLoading, getTaskCounts, taskCount } = useGlobal();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(isOpen || false);

    useEffect(() => {
        fetchCurrentUser();
        fetchAllProjects();
        getTaskCounts();
    }, []);

    useEffect(() => {
        setIsMobileNavOpen(isOpen);
    }, [isOpen]);

    const isActive = (path) => location.pathname === path;

    const menuSections = [
        {
            title: 'Menu',
            links: [
                { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
                { 
                    name: 'My Tasks', 
                    path: '/tasks', 
                    icon: CheckCircle2, 
                    badge: taskCount > 0 ? taskCount : null // show badge only if > 0
                },
                { name: 'Calendar', path: '/calendar', icon: Calendar },
            ],
        },
        {
            title: 'Projects',
            links: [
                { name: 'Add Project', path: '/projects/add', icon: PlusCircle },
            ],
        },
        {
            title: 'Other',
            links: [
                { name: 'Teams', path: '/teams', icon: Users },
                { name: 'Settings', path: '/settings', icon: Settings },
            ],
        },
    ];

    return (
        <>
            {isMobileNavOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`w-72 bg-slate-800 text-white p-6 flex flex-col fixed h-screen overflow-y-auto transform 
                    ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
                id="mobile-nav"
            >
                {/* Logo */}
                <div className="flex items-center justify-between gap-2 text-2xl font-bold mb-5 py-2">
                    <div className="flex items-center gap-3">
                        <CheckSquare className="text-blue-500 text-3xl" />
                        <span>TaskFlow</span>
                    </div>
                    <button
                        className="lg:hidden text-white hover:text-gray-300"
                        onClick={onClose}
                    >
                        <X className="text-2xl" />
                    </button>
                </div>

                {/* Menu Sections */}
                {menuSections.map((section, i) => (
                    <nav key={i} className="mb-8">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                            {section.title}
                        </div>

                        {section.title === 'Projects' ? (
                            <>
                                <div className="max-h-60 overflow-y-auto space-y-1">
                                    {projectFetchLoading ? (
                                        <div className="space-y-2">
                                            {Array(3).fill(0).map((_, idx) => (
                                                <div key={idx} className="h-8 bg-slate-600 rounded animate-pulse" />
                                            ))}
                                        </div>
                                    ) : projects.length === 0 ? (
                                        <p className="text-slate-400 text-sm">No projects found.</p>
                                    ) : (
                                        projects.map(project => (
                                            <Link
                                                key={project.uuid}
                                                to={`/projects/${project.uuid}`}
                                                className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${isActive(`/projects/${project.uuid}`)
                                                    ? 'bg-blue-500 text-white'
                                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                                }`}
                                            >
                                                <Folder className="text-md" />
                                                <span className="text-base text-sm font-medium">{project.name}</span>
                                            </Link>
                                        ))
                                    )}
                                </div>
                                {/* Add Project link */}
                                <Link
                                    to="/projects/add"
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-all mt-2 cursor-pointer ${isActive('/projects/add')
                                        ? 'bg-blue-500 text-white'
                                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                                >
                                    <PlusCircle className="text-md" />
                                    <span className="text-base text-sm font-medium">Add Project</span>
                                </Link>
                            </>
                        ) : (
                            section.links.map(({ name, path, icon: Icon, badge }) => (
                                <Link
                                    key={path}
                                    to={path}
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-all mb-1 cursor-pointer ${isActive(path)
                                        ? 'bg-blue-500 text-white'
                                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                                >
                                    <Icon className="text-md" />
                                    <span className="text-base text-sm font-medium">{name}</span>
                                    {badge && (
                                        <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                            {badge}
                                        </span>
                                    )}
                                </Link>
                            ))
                        )}
                    </nav>
                ))}

                {/* Profile Section */}
                <div
                    className="mt-auto p-4 bg-slate-700 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-600 transition-all"
                    onClick={() => navigate('/settings/profile')}
                >
                    {loadingProfile ? (
                        <div className="flex items-center gap-3 w-full animate-pulse">
                            <div className="w-10 h-10 bg-slate-600 rounded-full" />
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-semibold text-base">
                                {user?.fname?.[0]}{user?.lname?.[0]}
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold">{user?.fname} {user?.lname}</h4>
                                <p className="text-xs text-slate-400">{user?.email}</p>
                            </div>
                        </>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
