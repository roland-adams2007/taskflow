import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../context/Global/useGlobal';
import { useAlert } from '../context/Alert/UseAlert';
import axiosInstance from '../api/axiosinstance';
import {
    ChevronLeft,
    ChevronRight,
    Settings,
    Folder,
    Clock,
    AlertCircle,
    Check
} from 'lucide-react';

const Calendar = () => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const { user } = useGlobal();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [groupedTasks, setGroupedTasks] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [projectFilter, setProjectFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const { projects } = useGlobal();

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/tasks/t/calendar', {
                params: {
                    month: currentDate.getMonth() + 1,
                    year: currentDate.getFullYear(),
                },
            });
            const { status, message, data } = response.data;
            if (status == 200 && data.data) {
                setTasks(data.data);
                setGroupedTasks(data.grouped_by_date);
                const uniqueProjects = [...new Set(data.data.map(task => task.project_name))].map(name => ({
                    name,
                    value: name.toLowerCase().replace(/\s+/g, '-'),
                }));
            } else {
                showAlert(message || 'Failed to fetch tasks', 'error');
            }
        } catch (error) {
            showAlert('Error fetching calendar tasks', 'error');
            setTasks([]);
            setGroupedTasks({});
        } finally {
            setLoading(false);
        }
    }, [currentDate, showAlert]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date().toISOString().split('T')[0]);
    };

    const isToday = (dateStr) => {
        const today = new Date();
        return dateStr === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    };

    const renderCalendarDays = () => {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDay = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        const days = [];

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-1 sm:p-2"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayTasks = groupedTasks[dateStr] || [];
            days.push(
                <div
                    key={dateStr}
                    className={`p-1 sm:p-2 text-center cursor-pointer rounded-lg hover:bg-gray-50 transition-all min-h-[40px] sm:min-h-[60px] flex flex-col justify-start ${isToday(dateStr) ? 'bg-blue-100 text-blue-600 font-semibold' : ''}`}
                    onClick={() => setSelectedDate(dateStr)}
                >
                    <div className="text-xs sm:text-sm">{day}</div>
                    {dayTasks.length > 0 && (
                        <div className="flex flex-col items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                            <div className="flex justify-center gap-0.5 sm:gap-1 flex-wrap">
                                {dayTasks.slice(0, 3).map((task, idx) => (
                                    <div
                                        key={`dot-${task.id}-${idx}`}
                                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${task.project_color || 'bg-gray-500'}`}
                                    ></div>
                                ))}
                                {dayTasks.length > 3 && (
                                    <div className="text-[8px] sm:text-[10px] text-gray-500">+{dayTasks.length - 3}</div>
                                )}
                            </div>
                            <div
                                className={`text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full ${dayTasks.length >= 5 ? 'bg-red-100 text-red-600' :
                                    dayTasks.length >= 3 ? 'bg-orange-100 text-orange-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}
                            >
                                {dayTasks.length}
                            </div>
                        </div>
                    )}
                </div>
            );
        }
        return days;
    };

    const renderTasks = () => {
        if (!selectedDate) return <p className="text-gray-500 text-sm">Select a date to view tasks</p>;
        const filteredTasks = groupedTasks[selectedDate]?.filter(
            (task) => projectFilter === 'all' || task.project_uuid == projectFilter
        ) || [];
        if (loading) {
            return (
                <div className="flex flex-col gap-3">
                    {[...Array(3)].map((_, idx) => (
                        <div key={`skeleton-${idx}`} className="animate-pulse flex items-center gap-4 p-3 sm:p-4 rounded-xl border-2 border-gray-100">
                            <div className="w-5 h-5 rounded-md bg-gray-200"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="flex gap-2">
                                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/5"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
        if (filteredTasks.length === 0) {
            return <p className="text-gray-500 text-sm">No tasks for this date.</p>;
        }
        return filteredTasks.map((task) => (
            <div
                key={task.id}
                className={`task-item flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer ${task.status === 'completed' ? 'opacity-60' : ''}`}
                onClick={() => navigate(`/tasks/${task.id}`)}
            >
                <div
                    className={`task-checkbox w-5 h-5 rounded-md border-2 border-gray-300 cursor-pointer mt-0.5 flex-shrink-0 flex items-center justify-center ${task.status === 'completed' ? 'border-blue-500 bg-blue-500' : ''}`}
                >
                    {task.status === 'completed' && <Check size={14} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className={`task-title text-sm sm:text-base font-semibold mb-1.5 break-words ${task.status === 'completed' ? 'line-through' : ''}`}>
                        {task.title}
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs sm:text-sm">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${task.project_color || 'bg-gray-500'}`}></span>
                            <Folder size={14} className="flex-shrink-0" />
                            <span className="truncate max-w-[120px] sm:max-w-none">{task.project_name}</span>
                        </div>
                        <span
                            className={`task-priority px-2 sm:px-2.5 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold uppercase ${task.priority === 'high' ? 'bg-red-100 text-red-600' :
                                task.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                                    'bg-blue-100 text-blue-600'
                                }`}
                        >
                            {task.priority}
                        </span>
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs sm:text-sm">
                            <Clock size={14} className="flex-shrink-0" />
                            {new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {new Date(task.due_date) < new Date() && task.status !== 'completed' && (
                            <div className="flex items-center gap-1.5 text-red-600 text-xs sm:text-sm font-semibold">
                                <AlertCircle size={14} className="flex-shrink-0" />Overdue
                            </div>
                        )}
                        <div className="task-assignee sm:ml-auto flex items-center gap-1.5">
                            <div className={`w-6 h-6 sm:w-7 sm:h-7 ${task.project_color || 'bg-gray-500'} rounded-full flex items-center justify-center font-semibold text-[10px] sm:text-xs text-white flex-shrink-0`}>
                                {task.assignee_name.split(' ').map(n => n[0]).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <main className="bg-gray-100 text-slate-900 ">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
                <div className="flex items-center gap-4 w-full">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Calendar</h1>
                        <p className="text-gray-500 text-sm sm:text-base">Track your tasks and deadlines</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
                    <select
                        id="projectFilter"
                        className="flex-1 md:flex-none px-3 py-2 border-2 border-gray-200 rounded-lg text-xs sm:text-sm bg-gray-50 hover:border-gray-300 hover:bg-white focus:outline-none focus:border-blue-500 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg width=%2712%27 height=%278%27 viewBox=%270 0 12 8%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M1 1.5L6 6.5L11 1.5%27 stroke=%27%2364748b%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center] pr-8"
                        value={projectFilter}
                        onChange={(e) => setProjectFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        {projects.map((project) => (
                            <option key={project.uuid} value={project.uuid}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 rounded-lg bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                        <ChevronLeft size={18} className="text-gray-600" />
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 rounded-lg bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                        <ChevronRight size={18} className="text-gray-600" />
                    </button>
                    <button
                        onClick={handleToday}
                        className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-600 transition-all"
                    >
                        Today
                    </button>
                    <h2 className="text-base sm:text-xl font-bold">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-600 transition-all"
                    >
                        Month
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-2 sm:p-4 mb-4 sm:mb-6 overflow-x-auto">
                <div className="min-w-[280px]">
                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center text-[10px] sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>
                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                        {renderCalendarDays()}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 break-words">
                    Tasks for{' '}
                    <span className="block sm:inline mt-1 sm:mt-0">
                        {selectedDate
                            ? new Date(selectedDate).toLocaleDateString('default', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })
                            : 'Select a date'}
                    </span>
                </h2>
                <div className="flex flex-col gap-3">
                    {renderTasks()}
                </div>
            </div>
        </main>
    );
};

export default Calendar;