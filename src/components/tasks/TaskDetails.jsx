import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGlobal } from '../../context/Global/useGlobal';
import { useAlert } from '../../context/Alert/UseAlert';
import axiosInstance from '../../api/axiosinstance';
import { Folder, Calendar, Edit2, Trash2, ChevronDown, Save, X, Search, Bell, Settings } from 'lucide-react';

const TaskDetails = () => {
    const { taskId } = useParams();
    const { showAlert } = useAlert();
    const { getTaskDetails, taskDetailsFetchLoading, taskDetails } = useGlobal();

    useEffect(() => {
        getTaskDetails(taskId);
    }, [taskId]);

    const SkeletonLoader = () => (
        <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-3/4 rounded mb-4"></div>
            <div className="flex gap-3 mb-6">
                <div className="bg-gray-200 h-4 w-24 rounded"></div>
                <div className="bg-gray-200 h-4 w-16 rounded"></div>
                <div className="bg-gray-200 h-4 w-28 rounded"></div>
            </div>
            <div className="bg-gray-200 h-24 w-full rounded mb-6"></div>
            <div className="bg-gray-200 h-4 w-20 rounded mb-2"></div>
            <div className="bg-gray-200 h-6 w-24 rounded mb-6"></div>
            <div className="bg-gray-200 h-4 w-20 rounded mb-2"></div>
            <div className="bg-gray-200 h-6 w-32 rounded mb-6"></div>
            <div className="flex gap-3">
                <div className="bg-gray-200 h-10 w-32 rounded"></div>
                <div className="bg-gray-200 h-10 w-24 rounded"></div>
            </div>
        </div>
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getProjectStatus = (status) => {
        switch (status) {
            case 0:
                return 'Pending';
            case 1:
                return 'In Progress';
            case 2:
                return 'Completed';
            case 3:
                return 'Cancelled';
            default:
                return 'Unknown';
        }
    };



    return (
        <div className="bg-gray-100 text-slate-900">
            <main>
                <header className="flex justify-between items-center mb-8 flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-4 w-full">
                        <div>
                            <h1 className="text-3xl font-bold mb-1">Task Details</h1>
                            <p className="text-gray-500 text-base">View and manage your task</p>
                        </div>
                    </div>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
                            {taskDetailsFetchLoading ? (
                                <SkeletonLoader />
                            ) : taskDetails ? (
                                <>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold mb-2">{taskDetails.title}</h2>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                                    <Folder className="text-sm" />
                                                    {taskDetails.project_name}
                                                </div>
                                                <span
                                                    className={`task-priority px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase
                            ${taskDetails.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                                                            taskDetails.priority === 'high' ? 'bg-red-100 text-red-600' :
                                                                'bg-blue-100 text-blue-600'}`}
                                                >
                                                    {taskDetails.priority}
                                                </span>
                                                <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                    <Calendar className="text-sm" />
                                                    Due: {formatDate(taskDetails.due_date)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="icon-btn w-10 h-10 bg-blue-100 text-blue-500 border-none rounded-lg flex items-center justify-center hover:bg-blue-200 transition-all">
                                                <Edit2 className="text-lg" />
                                            </button>
                                            <button className="icon-btn w-10 h-10 bg-red-100 text-red-500 border-none rounded-lg flex items-center justify-center hover:bg-red-200 transition-all">
                                                <Trash2 className="text-lg" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-3">Description</h3>
                                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200 break-words">{taskDetails.description}</p>
                                    </div>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-3">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {taskDetails.tags.map((tag, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1.5 rounded-md text-sm font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-3">Status</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <select
                                                    className="appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
                                                    defaultValue={taskDetails.status}
                                                >
                                                    {/* <option value="todo">To Do</option> */}
                                                    <option value="in-progress">In Progress</option>
                                                    {/* <option value="review">In Review</option> */}
                                                    <option value="completed">Completed</option>
                                                    {/* <option value="blocked">Blocked</option>
                                                    <option value="on-hold">On Hold</option>
                                                    <option value="cancelled">Cancelled</option> */}
                                                    {/* <option value="pending">Pending</option> */}

                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                                    <ChevronDown className="text-gray-400" />
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-500">Last updated: {formatDate(taskDetails.created_at)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button className="py-2.5 px-5 bg-blue-500 text-white border-none rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-md transition-all">
                                            <Save />
                                            Save Changes
                                        </button>
                                        <button className="py-2.5 px-5 bg-white text-gray-700 border-2 border-gray-200 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-md transition-all">
                                            <X />
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-500">No task details available</div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        {taskDetailsFetchLoading ? (
                            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 animate-pulse">
                                <div className="bg-gray-200 h-6 w-32 rounded mb-4"></div>
                                <div className="space-y-4">
                                    <div className="bg-gray-200 h-4 w-24 rounded"></div>
                                    <div className="bg-gray-200 h-8 w-36 rounded"></div>
                                    <div className="bg-gray-200 h-4 w-24 rounded"></div>
                                    <div className="bg-gray-200 h-4 w-28 rounded"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                                <h3 className="text-lg font-semibold mb-4">Task Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Assignee</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-semibold text-xs text-white">
                                                You
                                            </div>
                                            <span className="text-sm font-medium">You</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Created</h4>
                                        <p className="text-sm font-medium">{formatDate(taskDetails.created_at)}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Due Date</h4>
                                        <p className="text-sm font-medium">{formatDate(taskDetails.due_date)}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Priority</h4>
                                        <span
                                            className={`task-priority px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase
                        ${taskDetails.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                                                    taskDetails.priority === 'high' ? 'bg-red-100 text-red-600' :
                                                        'bg-blue-100 text-blue-600'}`}
                                        >
                                            {taskDetails.priority}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {taskDetailsFetchLoading ? (
                            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 animate-pulse">
                                <div className="bg-gray-200 h-6 w-32 rounded mb-4"></div>
                                <div className="space-y-4">
                                    <div className="bg-gray-200 h-4 w-24 rounded"></div>
                                    <div className="bg-gray-200 h-4 w-48 rounded"></div>
                                    <div className="bg-gray-200 h-4 w-24 rounded"></div>
                                    <div className="bg-gray-200 h-4 w-32 rounded"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                                <h3 className="text-lg font-semibold mb-4">Project Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Project</h4>
                                        <p className="text-sm font-medium">{taskDetails.project_name}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Description</h4>
                                        <p className="text-sm break-words">{taskDetails.project_description}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Timeline</h4>
                                        <p className="text-sm">{formatDate(taskDetails.project_start_date)} - {formatDate(taskDetails.project_end_date)}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Priority</h4>
                                        <span
                                            className={`task-priority px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase
                        ${taskDetails.project_priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                                                    taskDetails.project_priority === 'high' ? 'bg-red-100 text-red-600' :
                                                        'bg-blue-100 text-blue-600'}`}
                                        >
                                            {taskDetails.project_priority}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-500 mb-1">Status</h4>
                                        <span
                                            className={`task-priority px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase
                        ${taskDetails.project_status === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                    taskDetails.project_status === 1 ? 'bg-blue-100 text-blue-600' :
                                                        taskDetails.project_status === 2 ? 'bg-green-100 text-green-600' :
                                                            'bg-red-100 text-red-600'}`}
                                        >
                                            {getProjectStatus(taskDetails.project_status)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TaskDetails;