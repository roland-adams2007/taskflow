import React, { useState, useEffect, useCallback } from 'react';
import { CheckSquare, Plus, LayoutDashboard, CheckCircle2, Inbox, Calendar, Folder, Users, Settings, Menu, X, Sliders, Download, Search, Edit3, Trash2, ChevronLeft, ChevronRight, Check, Eye } from 'lucide-react';
import { useAlert } from '../context/Alert/UseAlert';
import { useGlobal } from '../context/Global/useGlobal';
import { useNavigate } from 'react-router-dom';

const TaskSkeleton = () => (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5 animate-pulse">
        <div className="flex items-start gap-4">
            <div className="w-5 h-5 rounded-md bg-gray-300 flex-shrink-0 mt-0.5"></div>
            <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="flex gap-4 mt-4">
                    <div className="h-6 bg-gray-300 rounded w-24"></div>
                    <div className="h-6 bg-gray-300 rounded w-20"></div>
                    <div className="h-6 bg-gray-300 rounded w-32"></div>
                </div>
            </div>
            <div className="flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-300"></div>
                <div className="w-8 h-8 rounded-lg bg-gray-300"></div>
                <div className="w-8 h-8 rounded-lg bg-gray-300"></div>
            </div>
        </div>
    </div>
);

const FilterBarSkeleton = () => (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5 mb-6 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 animate-pulse">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
            <div className="h-4 bg-gray-300 rounded w-12"></div>
            <div className="h-10 bg-gray-300 rounded w-40"></div>
        </div>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
            <div className="h-4 bg-gray-300 rounded w-12"></div>
            <div className="h-10 bg-gray-300 rounded w-40"></div>
        </div>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
            <div className="h-4 bg-gray-300 rounded w-12"></div>
            <div className="h-10 bg-gray-300 rounded w-40"></div>
        </div>
        <div className="flex-1">
            <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>
    </div>
);

const HeaderSkeleton = () => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-pulse">
        <div className="flex items-center gap-4 w-full">
            <div>
                <div className="h-9 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-64"></div>
            </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="h-10 bg-gray-300 rounded w-28"></div>
            <div className="w-11 h-11 bg-gray-300 rounded-lg"></div>
            <div className="w-11 h-11 bg-gray-300 rounded-lg"></div>
        </div>
    </div>
);

const FilterModal = ({ isOpen, onClose, filters, onFilterChange, onClearFilters }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-center">
            <div className="bg-white w-full md:w-96 rounded-t-3xl md:rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Filter Tasks</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Project</label>
                        <select
                            value={filters.project}
                            onChange={(e) => onFilterChange('project', e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 hover:border-gray-300 focus:outline-none focus:border-blue-500"
                        >
                            <option value="all">All Projects</option>
                            <option value="Website Managment">Website Management</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Priority</label>
                        <select
                            value={filters.priority}
                            onChange={(e) => onFilterChange('priority', e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 hover:border-gray-300 focus:outline-none focus:border-blue-500"
                        >
                            <option value="all">All Priorities</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => onFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 hover:border-gray-300 focus:outline-none focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <button
                        onClick={onClearFilters}
                        className="w-full text-blue-500 font-semibold py-2 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-all"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const Tasks = () => {
    const { showAlert } = useAlert();
    const { getTasks, tasks, taskFetchLoading } = useGlobal();
    const navigate = useNavigate();
    const [selectedTasks, setSelectedTasks] = useState(new Set());
    const [completedTasks, setCompletedTasks] = useState(new Set());
    const [activeTab, setActiveTab] = useState('all');
    const [filters, setFilters] = useState({
        project: 'all',
        priority: 'all',
        status: 'all',
        search: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(10);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    // Debounced search handler
    const debouncedSearch = useCallback(
        debounce((searchValue) => {
            setFilters(prev => ({ ...prev, search: searchValue }));
            setCurrentPage(1);
        }, 300),
        []
    );

    // Handle search input change
    const handleSearchChange = (value) => {
        setSearchInput(value);
        debouncedSearch(value);
    };

    useEffect(() => {
        getTasks();
        setCurrentPage(1);
    }, [filters]);

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-600';
            case 'medium': return 'bg-orange-100 text-orange-600';
            case 'low': return 'bg-blue-100 text-blue-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'in-progress': return 'border-blue-200 hover:border-blue-300';
            case 'completed': return 'border-green-200 hover:border-green-300';
            default: return 'border-gray-200 hover:border-gray-300';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const isToday = (dateString) => {
        const today = new Date();
        const date = new Date(dateString);
        return date.toDateString() === today.toDateString();
    };

    const isUpcoming = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const date = new Date(dateString);
        date.setHours(0, 0, 0, 0);
        return date > today;
    };

    const isOverdue = (dateString, status) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const date = new Date(dateString);
        date.setHours(0, 0, 0, 0);
        return date < today && status?.toLowerCase() !== 'completed';
    };

    const filterTasksByTab = (tasksToFilter) => {
        switch (activeTab) {
            case 'today':
                return tasksToFilter.filter(task => isToday(task.due_date));
            case 'upcoming':
                return tasksToFilter.filter(task => isUpcoming(task.due_date));
            case 'overdue':
                return tasksToFilter.filter(task => isOverdue(task.due_date, task.status));
            default:
                return tasksToFilter;
        }
    };

    const filteredTasks = filterTasksByTab(
        tasks.filter(task => {
            const matchesProject = filters.project === 'all' || task.project_name === filters.project;
            const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
            const matchesStatus = filters.status === 'all' || task.status === filters.status;
            const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase());
            return matchesProject && matchesPriority && matchesStatus && matchesSearch;
        })
    );

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    const totalTasks = filteredTasks.length;

    const getTabCount = (tab) => {
        switch (tab) {
            case 'today':
                return tasks.filter(task => isToday(task.due_date)).length;
            case 'upcoming':
                return tasks.filter(task => isUpcoming(task.due_date)).length;
            case 'overdue':
                return tasks.filter(task => isOverdue(task.due_date, task.status)).length;
            default:
                return tasks.length;
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            project: 'all',
            priority: 'all',
            status: 'all',
            search: ''
        });
        setSearchInput('');
        setCurrentPage(1);
    };

    const toggleTaskSelection = (taskId) => {
        const newSelected = new Set(selectedTasks);
        if (newSelected.has(taskId)) {
            newSelected.delete(taskId);
        } else {
            newSelected.add(taskId);
        }
        setSelectedTasks(newSelected);
    };

    const toggleTaskCheckbox = (e, taskId) => {
        e.stopPropagation();
        const newCompleted = new Set(completedTasks);
        if (newCompleted.has(taskId)) {
            newCompleted.delete(taskId);
        } else {
            newCompleted.add(taskId);
        }
        setCompletedTasks(newCompleted);
        console.log('Toggle task completion:', taskId);
    };

    const handleTaskAction = (action, taskId) => {
        switch (action) {
            case 'view':
                navigate(`/tasks/${taskId}`);
                break;
            case 'edit':
                console.log('Edit task:', taskId);
                break;
            case 'delete':
                if (window.confirm('Are you sure you want to delete this task?')) {
                    console.log('Delete task:', taskId);
                }
                break;
        }
    };

    const handleTaskClick = (taskId) => {
        navigate(`/tasks/${taskId}`);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const goToPrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (taskFetchLoading) {
        return (
            <div className="bg-gray-100 text-slate-900">
                <HeaderSkeleton />
                <FilterBarSkeleton />

                <div className="flex gap-2 mb-6 border-b-2 border-gray-200 animate-pulse">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="px-5 py-3 h-6 bg-gray-300 rounded w-24"></div>
                    ))}
                </div>

                <div className="space-y-4 mb-8">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TaskSkeleton key={i} />
                    ))}
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-48"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                            ))}
                        </div>
                        <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 text-slate-900">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-1">My Tasks</h1>
                        <p className="text-gray-500 text-sm sm:text-base">
                            Manage and track all your tasks in one place
                        </p>
                    </div>
                </div>

                <div className="flex justify-start md:justify-end items-center gap-2 sm:gap-3 w-full md:w-auto">
                    <button
                        onClick={() => navigate('/tasks/add')}
                        className="flex items-center justify-center gap-2 bg-blue-500 text-white px-3 sm:px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition-all w-full md:w-auto"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">Add Task</span>
                    </button>
                </div>
            </header>

            {/* Filter Bar - Hidden on mobile */}
            <div className="hidden lg:flex bg-white border-2 border-gray-200 rounded-xl p-5 mb-6 flex-col lg:flex-row items-stretch lg:items-center gap-4">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
                    <span className="text-sm font-semibold text-gray-600">Project:</span>
                    <select
                        value={filters.project}
                        onChange={(e) => handleFilterChange('project', e.target.value)}
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 hover:border-gray-300 focus:outline-none focus:border-blue-500"
                    >
                        <option value="all">All Projects</option>
                        <option value="Website Managment">Website Management</option>
                    </select>
                </div>
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
                    <span className="text-sm font-semibold text-gray-600">Priority:</span>
                    <select
                        value={filters.priority}
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 hover:border-gray-300 focus:outline-none focus:border-blue-500"
                    >
                        <option value="all">All Priorities</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
                    <span className="text-sm font-semibold text-gray-600">Status:</span>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 hover:border-gray-300 focus:outline-none focus:border-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" size={20} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <button
                    onClick={clearFilters}
                    className="text-blue-500 text-sm font-semibold flex items-center gap-1.5 hover:underline ml-auto"
                >
                    <X size={16} />
                    Clear filters
                </button>
            </div>

            {/* Mobile Search Bar + Filter Button */}
            <div className="lg:hidden flex gap-2 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" size={20} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                    />
                </div>
                <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="bg-blue-500 text-white p-2.5 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center flex-shrink-0"
                >
                    <Sliders size={20} />
                </button>
            </div>

            {/* Filter Modal */}
            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
            />

            {/* Task Tabs */}
            <div className="flex gap-2 mb-6 border-b-2 border-gray-200 flex-wrap">
                {['all', 'today', 'upcoming', 'overdue'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={`px-5 py-3 bg-none border-b-3 border-transparent font-semibold text-sm text-gray-500 hover:text-blue-500 flex items-center gap-2 -mb-0.5 transition-all ${activeTab === tab ? 'border-blue-500 text-blue-500' : ''
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg text-xs">
                            {getTabCount(tab)}
                        </span>
                    </button>
                ))}
            </div>

            {/* Tasks List */}
            <div className="space-y-4 mb-8">
                {currentTasks.length > 0 ? (
                    currentTasks.map((task) => (
                        <div
                            key={task.id || task.title}
                            className={`task-card bg-white border-2 ${getStatusColor(task.status)} rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer ${selectedTasks.has(task.id || task.title) ? 'border-blue-500 bg-blue-50' : ''
                                }`}
                            onClick={() => handleTaskClick(task.id)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleTaskSelection(task.id || task.title);
                            }}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className={`task-checkbox w-5 h-5 rounded-md border-2 cursor-pointer mt-0.5 flex-shrink-0 flex items-center justify-center transition-all ${completedTasks.has(task.id || task.title)
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    onClick={(e) => toggleTaskCheckbox(e, task.id || task.title)}
                                >
                                    {completedTasks.has(task.id || task.title) && (
                                        <Check size={14} className="text-white" />
                                    )}
                                </div>
                                <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                                    <h3 className={`task-title text-base font-semibold mb-2 ${completedTasks.has(task.id || task.title) ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
                                    {task.description && (
                                        <p className="text-gray-500 text-sm mb-3 leading-relaxed">
                                            {task.description}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-0.5"></span>
                                            <Folder size={12} />
                                            {task.project_name}
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                            <Calendar size={12} />
                                            {formatDate(task.due_date)}
                                        </div>
                                        {task.tags && task.tags.map((tag, index) => (
                                            <span key={index} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => handleTaskAction('view', task.id)}
                                        className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-green-500 transition-all"
                                        title="View task"
                                    >
                                        <Eye size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleTaskAction('edit', task.id)}
                                        className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-all"
                                        title="Edit task"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleTaskAction('delete', task.id)}
                                        className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-all"
                                        title="Delete task"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>No tasks found matching your filters.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {indexOfFirstTask + 1} to {Math.min(indexOfLastTask, totalTasks)} of {totalTasks} tasks
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToPrevious}
                            disabled={currentPage === 1}
                            className="w-10 h-10 border-2 border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => paginate(page)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${currentPage === page
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-500 hover:bg-gray-50 border-2 border-gray-200'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={goToNext}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 border-2 border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Bulk Actions Bar */}
            {selectedTasks.size > 0 && (
                <div className="fixed bottom-8 left-5 right-5 lg:left-1/2 lg:-translate-x-1/2 bg-slate-800 text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 flex-wrap z-50">
                    <span className="text-sm font-semibold">{selectedTasks.size} tasks selected</span>
                    <button className="bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-blue-600 transition-all flex items-center gap-1.5">
                        <CheckSquare size={16} />
                        Mark Complete
                    </button>
                    <button className="bg-slate-600 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-slate-500 transition-all flex items-center gap-1.5">
                        <Users size={16} />
                        Assign
                    </button>
                    <button className="bg-red-500 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-red-600 transition-all flex items-center gap-1.5">
                        <Trash2 size={16} />
                        Delete
                    </button>
                    <button
                        onClick={() => setSelectedTasks(new Set())}
                        className="bg-slate-600 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-slate-500 transition-all flex items-center gap-1.5"
                    >
                        <X size={16} />
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default Tasks;