import React, { useState, useEffect } from 'react';
import { useGlobal } from '../../context/Global/useGlobal';
import { useAlert } from '../../context/Alert/UseAlert';
import { X, FolderPlus } from 'lucide-react';
import axiosInstance from '../../api/axiosinstance';

const AddProject = () => {
    const { showAlert } = useAlert();
    const { fetchTeamMembers, fetchLoading, teamMembers, fetchAllProjects } = useGlobal();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        desc: '',
        start: '',
        end: ''
    });

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedColor, setSelectedColor] = useState('#3B82F6');
    const [selectedPriority, setSelectedPriority] = useState('medium');

    // Validation states
    const [nameTouched, setNameTouched] = useState(false);
    const [startTouched, setStartTouched] = useState(false);
    const [endTouched, setEndTouched] = useState(false);

    const colors = [
        { name: 'blue', hex: '#3B82F6' },
        { name: 'green', hex: '#10B981' },
        { name: 'orange', hex: '#F97316' },
        { name: 'purple', hex: '#8B5CF6' },
        { name: 'red', hex: '#EF4444' },
        { name: 'cyan', hex: '#06B6D4' }
    ];
    const priorities = [
        { value: 'low', color: '#3B82F6', label: 'Low' },
        { value: 'medium', color: '#F97316', label: 'Medium' },
        { value: 'high', color: '#EF4444', label: 'High' }
    ];

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));

        // Mark fields as touched on change
        if (id === 'start') setStartTouched(true);
        if (id === 'end') setEndTouched(true);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        // Mark all relevant fields as touched on submit
        setNameTouched(true);
        setStartTouched(true);
        setEndTouched(true);

        // Validations
        if (!formData.name.trim()) {
            showAlert('Project name is required.', 'error');
            return;
        }

        if (formData.start && formData.end && new Date(formData.start) > new Date(formData.end)) {
            showAlert('End date must be after start date.', 'error');
            return;
        }

        if (!formData.start) {
            showAlert('Start date is required.', 'error');
            return;
        }

        if (!formData.end) {
            showAlert('End date is required.', 'error');
            return;
        }

        setLoading(true);
        axiosInstance.post('/projects/add', {
            ...formData,
            color: selectedColor,
            priority: selectedPriority,
            members: selectedMembers.map(m => m.uuid)
        })
            .then(res => {
                const response = res.data;

                if (response.status != 200) {
                    showAlert(response.message || 'Unable to create project', 'error');
                    return;
                }

                showAlert(response.message || 'Project Created', 'success');
                setFormData({
                    name: '',
                    desc: '',
                    start: '',
                    end: ''
                });
                setSelectedMembers([]);
                setSelectedColor('#3B82F6');
                setSelectedPriority('medium');
                setStartTouched(false);
                setEndTouched(false);
                fetchAllProjects();
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                const message = errRes.message || "Something went wrong. Please try again.";
                showAlert(message, 'error');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleAddMember = (e) => {
        const uuid = e.target.value;
        if (uuid && !selectedMembers.find(m => m.uuid === uuid)) {
            const member = teamMembers.find(m => m.uuid === uuid);
            if (member) {
                setSelectedMembers([...selectedMembers, member]);
            }
        }
        e.target.value = '';
    };

    const handleRemoveMember = (uuid) => {
        setSelectedMembers(selectedMembers.filter(m => m.uuid !== uuid));
    };

    const getPriorityClass = (priority) => {
        const priorityMap = {
            low: { border: 'border-blue-500', bg: 'bg-blue-100', text: 'text-blue-600' },
            medium: { border: 'border-orange-500', bg: 'bg-orange-100', text: 'text-orange-600' },
            high: { border: 'border-red-500', bg: 'bg-red-100', text: 'text-red-600' }
        };
        return priorityMap[priority] || priorityMap.medium;
    };

    const getMemberColor = (index) => {
        const memberColors = ['blue', 'green', 'orange', 'purple'];
        return memberColors[index % memberColors.length];
    };

    const getBorderForPriority = (priority) => {
        const map = {
            low: 'border-blue-500',
            medium: 'border-orange-500',
            high: 'border-red-500'
        };
        return map[priority] || 'border-gray-200';
    };

    const getHoverForPriority = (priority) => {
        const map = {
            low: 'hover:border-blue-300',
            medium: 'hover:border-orange-300',
            high: 'hover:border-red-300'
        };
        return map[priority] || '';
    };

    // Date validation helpers
    const showStartError = startTouched && !formData.start;
    const showEndError = endTouched && !formData.end;
    const showDateOrderError = startTouched && endTouched && formData.start && formData.end && new Date(formData.start) > new Date(formData.end);

    return (
        <>
            <>


                {/* Header */}
                <header className="header flex justify-between items-center mb-8 flex-col md:flex-row gap-4">
                    <div className="flex items-center gap-4 w-full">
                        <div>
                            <h1 className="text-3xl font-bold mb-1">Add New Project</h1>
                            <p className="text-gray-500 text-base">Create a new project to organize your tasks and collaborate with your team</p>
                        </div>
                    </div>
                </header>

                {/* Add Project Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                            <h2 className="text-xl font-bold mb-6">Project Details</h2>

                            <form id="add-project-form" onSubmit={onSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold mb-2">Project Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            onBlur={() => setNameTouched(true)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 transition-all"
                                            placeholder="Enter project name"
                                        />
                                        {nameTouched && !formData.name.trim() && <p className="text-red-500 text-xs mt-1">Required</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="project-color" className="block text-sm font-semibold mb-2">Project Color</label>
                                        <div className="flex gap-2">
                                            {colors.map(color => (
                                                <div
                                                    key={color.name}
                                                    onClick={() => setSelectedColor(color.hex)}
                                                    className={`color-option w-8 h-8  rounded-md cursor-pointer border-2 ${selectedColor === color.hex ? 'border-gray-800' : 'border-gray-200'}`}
                                                    style={{ backgroundColor: color.hex }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="desc" className="block text-sm font-semibold mb-2">Description</label>
                                    <textarea
                                        id="desc"
                                        value={formData.desc}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                                        placeholder="Describe the project goals and objectives"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="project-priority" className="block text-sm font-semibold mb-2">Priority Level</label>
                                        <div className="flex gap-2">
                                            {priorities.map(p => (
                                                <div
                                                    key={p.value}
                                                    onClick={() => setSelectedPriority(p.value)}
                                                    className={`priority-option flex-1 p-3 border-2 border-gray-200 rounded-lg cursor-pointer ${getHoverForPriority(p.value)} transition-all ${selectedPriority === p.value ? getBorderForPriority(p.value) : ''}`}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
                                                        <span className="text-sm font-medium">{p.label}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="start" className="block text-sm font-semibold mb-2">Start Date</label>
                                        <input
                                            type="date"
                                            id="start"
                                            value={formData.start}
                                            onChange={handleInputChange}
                                            onBlur={() => setStartTouched(true)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 transition-all"
                                        />
                                        {showStartError && <p className="text-red-500 text-xs mt-1">Required</p>}
                                    </div>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                                    <div>
                                        <label htmlFor="end" className="block text-sm font-semibold mb-2">End Date</label>
                                        <input
                                            type="date"
                                            id="end"
                                            value={formData.end}
                                            onChange={handleInputChange}
                                            onBlur={() => setEndTouched(true)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 transition-all"
                                        />
                                        {showEndError && <p className="text-red-500 text-xs mt-1">Required</p>}
                                        {showDateOrderError && <p className="text-red-500 text-xs mt-1">End date must be after start date</p>}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold mb-2">Team Members</label>
                                    {fetchLoading ? <p>Loading team members...</p> : (
                                        <>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {selectedMembers.map((member, idx) => {
                                                    const mColor = getMemberColor(idx);
                                                    return (
                                                        <div key={member.uuid} className={`flex items-center gap-2 bg-${mColor}-100 text-${mColor}-700 px-3 py-1.5 rounded-full text-sm`}>
                                                            <div className={`w-6 h-6 bg-${mColor}-500 rounded-full flex items-center justify-center text-xs text-white`}>{member.alias || ''}</div>
                                                            {member.fname} {member.lname}
                                                            <button type="button" onClick={() => handleRemoveMember(member.uuid)} className={`text-${mColor}-700 hover:text-${mColor}-900`}>
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="flex gap-2">
                                                <select onChange={handleAddMember} className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 transition-all">
                                                    <option value="">Select team member</option>
                                                    {teamMembers.map(member => (
                                                        <option key={member.uuid} value={member.uuid}>{member.fname} {member.lname} ({member.role})</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button type="button" className="px-6 py-3 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all flex items-center gap-2">
                                        {loading ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <>
                                                <FolderPlus className="w-4 h-4" />
                                                Create Project
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Project Preview */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                            <h2 className="text-xl font-bold mb-4">Project Preview</h2>

                            <div className="project-preview bg-white border-2 border-gray-200 rounded-xl p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-3 h-3 rounded-sm mt-1" style={{ backgroundColor: selectedColor }}></div>
                                </div>
                                <h3 className="text-base font-semibold mb-2">{formData.name || 'Project Name'}</h3>
                                <p className="text-gray-500 text-sm mb-4">{formData.desc || 'Project description will appear here'}</p>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`${getPriorityClass(selectedPriority).bg} ${getPriorityClass(selectedPriority).text} px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase`}>
                                        {selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)}
                                    </span>
                                </div>
                                <div className="mb-3">
                                    <div className="w-full h-1.5 bg-gray-100 rounded-sm overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-sm" style={{ width: '0%' }}></div>
                                    </div>
                                    <span className="text-xs text-gray-500">0% complete</span>
                                </div>
                                <div className="flex items-center">
                                    {selectedMembers.length === 0 ? (
                                        <div className="text-xs text-gray-500">No team members added</div>
                                    ) : (
                                        selectedMembers.map((member, idx) => (
                                            <div key={member.uuid} className={`w-7 h-7 bg-${getMemberColor(idx)}-500 rounded-full flex items-center justify-center font-semibold text-xs text-white border-2 border-white -ml-2 first:ml-0`}>
                                                {member.alias || ''}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </>
    );
};

export default AddProject;