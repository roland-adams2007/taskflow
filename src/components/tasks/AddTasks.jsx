import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // Add useSearchParams and Link
import { useGlobal } from '../../context/Global/useGlobal';
import { useAlert } from '../../context/Alert/UseAlert';
import axiosInstance from '../../api/axiosinstance';
import { Search, X, Tag, User, Calendar, Check, Loader2 } from 'lucide-react';

const AddTasks = () => {
    const { projects, fetchAllProjects, getProjectTeam, projectTeam, projectTeamFetchLoading, projectFetchLoading } = useGlobal();
    const { showAlert } = useAlert();
    const [searchParams] = useSearchParams(); // Get query parameters
    const projectUuid = searchParams.get('project'); // Extract project UUID from ?project

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        project: projectUuid || '', // Initialize project with query param if available
        priority: 'medium',
        dueDate: '',
        status: 'todo',
        assignee: '',
        tags: []
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dropdownRef = useRef(null);
    const tagInputRef = useRef(null);

    const priorities = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
    ];

    const statuses = [
        { value: 'todo', label: 'To Do' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'review', label: 'In Review' },
        { value: 'completed', label: 'Completed' },
        { value: 'blocked', label: 'Blocked' },
        { value: 'on-hold', label: 'On Hold' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'pending', label: 'Pending' }
    ];

    useEffect(() => {
        if (formData.project) {
            getProjectTeam(formData.project);
        }
    }, [formData.project]);



    useEffect(() => {
        setFormData(prev => ({ ...prev, assignee: '' }));
    }, [formData.project]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAssigneeSelect = (memberUuid) => {
        setFormData(prev => ({ ...prev, assignee: memberUuid }));
        setShowDropdown(false);
        setSearchTerm('');
    };

    const handleClearAssignee = () => {
        setFormData(prev => ({ ...prev, assignee: '' }));
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter' && newTag.trim()) {
            e.preventDefault();
            const trimmedTag = newTag.trim();
            if (!formData.tags.includes(trimmedTag)) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
            }
            setNewTag('');
        } else if (e.key === 'Backspace' && !newTag && formData.tags.length > 0) {
            setFormData(prev => ({ ...prev, tags: prev.tags.slice(0, -1) }));
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.project) {
            showAlert('Please select a project first', 'error');
            return;
        }

        setIsSubmitting(true);

        const submitData = {
            ...formData,
            projectId: formData.project
        };

        axiosInstance.post('/tasks/add', submitData)
            .then(response => {
                const res = response.data;
                if (res.code != 200) {
                    showAlert(res.message || 'Unable to create task', 'error');
                    return;
                }
                showAlert(res.message || 'Task created successfully!', 'success');
                setFormData({
                    title: '',
                    description: '',
                    project: projectUuid || '', // Preserve project UUID if present
                    priority: 'medium',
                    dueDate: '',
                    status: 'todo',
                    assignee: '',
                    tags: []
                });
                setNewTag('');
                setIsSubmitting(false);
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                const message = errRes.message || "Something went wrong";
                showAlert(message, 'error');
                setIsSubmitting(false);
            });
    };

    const filteredMembers = Array.isArray(projectTeam)
        ? projectTeam.filter(member =>
            member.fname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.lname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.alias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.team_role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.project_role?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const selectedMember = Array.isArray(projectTeam) ? projectTeam.find(m => m.uuid === formData.assignee) : null;
    const selectedProject = projects.find(p => p.uuid === formData.project);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Create New Task</h1>
                    <p className="text-gray-500 text-base">Add a new task to your project and assign it to a team member</p>
                </div>
                <Link
                    to="/tasks"
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                >
                    Back to Tasks
                </Link>
            </header>

            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold text-slate-900 mb-2">
                                Task Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., Design homepage mockup"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-slate-900 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Add detailed description of the task..."
                                rows="5"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="project" className="block text-sm font-semibold text-slate-900 mb-2">
                                Project * <span className="text-red-500">(Required first)</span>
                            </label>
                            {projectFetchLoading ? (
                                <div className="flex items-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg text-gray-500">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Loading projects...</span>
                                </div>
                            ) : (
                                <select
                                    id="project"
                                    name="project"
                                    value={formData.project}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                                    required
                                    disabled={!!projectUuid} // Disable if projectUuid is present
                                >
                                    <option value="">Select a project</option>
                                    {projects.map(project => (
                                        <option
                                            key={project.uuid}
                                            value={project.uuid}
                                            disabled={projectUuid && project.uuid !== projectUuid} // Disable other options if projectUuid exists
                                        >
                                            {project.name} {selectedProject?.uuid === project.uuid && '(Selected)'}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {selectedProject && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: selectedProject.color }}
                                    />
                                    <span>{selectedProject.description}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="priority" className="block text-sm font-semibold text-slate-900 mb-2">
                                Priority *
                            </label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                                required
                                disabled={!formData.project}
                            >
                                {priorities.map(p => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="dueDate" className="block text-sm font-semibold text-slate-900 mb-2">
                                    Due Date *
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        id="dueDate"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                                        required
                                        disabled={!formData.project}
                                    />
                                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-semibold text-slate-900 mb-2">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                                    disabled={!formData.project}
                                >
                                    {statuses.map(s => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {!formData.project ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
                                <User className="mx-auto mb-2 w-12 h-12 text-gray-400" />
                                <p className="text-sm">Please select a project first to see available team members</p>
                            </div>
                        ) : projectTeamFetchLoading ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Loading team members...</span>
                                </div>
                            </div>
                        ) : !Array.isArray(projectTeam) || projectTeam.length === 0 ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
                                <p className="text-sm">No team members available for this project</p>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">
                                    Assign To *
                                </label>
                                {selectedMember ? (
                                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-blue-50 flex items-center gap-3 justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                                {selectedMember.fname?.[0]}{selectedMember.lname?.[0]}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-sm truncate">
                                                    {selectedMember.fname} {selectedMember.lname} {selectedMember.alias && `(${selectedMember.alias})`}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {selectedMember.role} • {selectedMember.team_role} • {selectedMember.project_role}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleClearAssignee}
                                            className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative" ref={dropdownRef}>
                                        <div
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus-within:border-blue-500 transition-all flex items-center gap-3 cursor-pointer"
                                            onClick={() => setShowDropdown(!showDropdown)}
                                        >
                                            <User className="text-gray-400 w-5 h-5 flex-shrink-0" />
                                            <span className="text-gray-500 flex-1">
                                                {projectTeam.length} team member{projectTeam.length !== 1 ? 's' : ''} available
                                            </span>
                                            <Search className="ml-auto text-gray-400 w-5 h-5 transition-transform" />
                                        </div>
                                        {showDropdown && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                                                <div className="p-2 border-b border-gray-200">
                                                    <input
                                                        type="text"
                                                        placeholder={`Search among ${projectTeam.length} team members...`}
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                {filteredMembers.length > 0 ? (
                                                    filteredMembers.map(member => (
                                                        <div
                                                            key={member.uuid}
                                                            className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                                                            onClick={() => handleAssigneeSelect(member.uuid)}
                                                        >
                                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                                                {member.fname?.[0]}{member.lname?.[0]}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="font-medium text-sm truncate">
                                                                    {member.fname} {member.lname} {member.alias && `(${member.alias})`}
                                                                </p>
                                                                <p className="text-xs text-gray-500 truncate">
                                                                    {member.role} • {member.team_role} • {member.project_role}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-3 text-gray-500 text-sm text-center">No members found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">Tags</label>
                            <div className="border-2 border-gray-200 rounded-lg p-3 min-h-[80px] focus-within:border-blue-500 transition-all">
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {formData.tags.map(tag => (
                                        <div key={tag} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                                            <Tag size={14} />
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-1 hover:bg-blue-200 rounded-full p-1"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <input
                                    ref={tagInputRef}
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={handleTagInputKeyDown}
                                    placeholder={formData.tags.length === 0 ? "Type tags and press Enter to add..." : "Press Enter to add new tag"}
                                    className="flex-1 outline-none bg-transparent min-w-[200px]"
                                    disabled={!formData.project}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                            <button
                                type="submit"
                                disabled={!formData.project || projectFetchLoading || isSubmitting}
                                className="flex-1 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Check size={20} />
                                        Create Task
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({
                                        title: '',
                                        description: '',
                                        project: projectUuid || '',
                                        priority: 'medium',
                                        dueDate: '',
                                        status: 'todo',
                                        assignee: '',
                                        tags: []
                                    });
                                    setNewTag('');
                                }}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                                disabled={projectFetchLoading || isSubmitting}
                            >
                                Clear
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTasks;