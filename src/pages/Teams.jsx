import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users, CheckCircle, ListChecks, Mail, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import axiosInstance from '../api/axiosinstance';
import { useAlert } from '../context/Alert/UseAlert';
import { useGlobal } from '../context/Global/useGlobal';

const Teams = () => {
    const { showAlert } = useAlert();
    const { fetchTeamMembers, fetchLoading, teamMembers } = useGlobal();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [editForm, setEditForm] = useState({
        alias: '',
        role: ''
    });
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch team members
    useEffect(() => {
        fetchTeamMembers();
    }, []);



    const handleAddMember = (e) => {
        e.preventDefault();
        if (!email) {
            showAlert('Email is required', 'error');
            return;
        }

        setLoading(true);

        axiosInstance.post("/teams/invite", { email })
            .then(response => {
                const res = response.data;
                if (res.status !== 200) {
                    showAlert(res.message || 'Unable to send invitation.', 'error');
                    return;
                }

                showAlert(res.message || 'Invitation sent.', 'success');
                setEmail('');
                setIsModalOpen(false);
                fetchTeamMembers(); // Refresh the list
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

    // Open edit modal
    const handleEditClick = (member) => {
        setSelectedMember(member);
        setEditForm({
            alias: member.alias || '',
            role: member.role || ''
        });
        setIsEditModalOpen(true);
    };

    // Handle edit form submission
    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!selectedMember) return;

        setEditLoading(true);

        axiosInstance.post(`/teams/${selectedMember.uuid}`, editForm)
            .then(response => {
                const res = response.data;
                if (res.status == 200) {
                    showAlert('Team member updated successfully.', 'success');
                    setIsEditModalOpen(false);
                    setSelectedMember(null);
                    fetchTeamMembers();
                } else {
                    showAlert(res.message || 'Unable to update team member.', 'error');
                }
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                const message = errRes.message || "Something went wrong. Please try again.";
                showAlert(message, 'error');
            })
            .finally(() => {
                setEditLoading(false);
            });
    };

    // Open delete confirmation modal
    const handleDeleteClick = (member) => {
        setSelectedMember(member);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!selectedMember) return;

        setDeleteLoading(true);

        axiosInstance.delete(`/teams/${selectedMember.uuid}`)
            .then(response => {
                const res = response.data;
                if (res.status === 200) {
                    showAlert('Team member removed successfully.', 'success');
                    setIsDeleteModalOpen(false);
                    setSelectedMember(null);
                    fetchTeamMembers();
                } else {
                    showAlert(res.message || 'Unable to remove team member.', 'error');
                }
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                const message = errRes.message || "Something went wrong. Please try again.";
                showAlert(message, 'error');
            })
            .finally(() => {
                setDeleteLoading(false);
            });
    };

    // Filter team members based on search
    const filteredMembers = teamMembers.filter(member => {
        const query = searchQuery.toLowerCase();
        return (
            member.fname?.toLowerCase().includes(query) ||
            member.lname?.toLowerCase().includes(query) ||
            member.email?.toLowerCase().includes(query) ||
            member.role?.toLowerCase().includes(query)
        );
    });

    // Pagination logic
    const totalItems = filteredMembers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Reset to first page on search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Get initials
    const getInitials = (fname, lname) => {
        const first = fname?.charAt(0) || '';
        const last = lname?.charAt(0) || '';
        return (first + last).toUpperCase() || '?';
    };

    return (
        <>
            {/* Header */}
            <header className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold">Team Members</h1>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="text"
                            placeholder="Search team members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all flex items-center gap-2"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <UserPlus className="w-5 h-5" />
                            Add Member
                        </button>
                    </div>
                </div>
            </header>

            {/* Add Member Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Invite Team Member</h2>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email address"
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all mb-4"
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddMember}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Invitation'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Member Modal */}
            {isEditModalOpen && selectedMember && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Team Member</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label htmlFor="alias" className="block text-sm font-medium text-gray-700 mb-2">
                                    Alias
                                </label>
                                <input
                                    type="text"
                                    id="alias"
                                    value={editForm.alias}
                                    onChange={(e) => setEditForm({ ...editForm, alias: e.target.value })}
                                    placeholder="Enter alias (optional)"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    id="role"
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                    placeholder="Enter role"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all"
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setSelectedMember(null);
                                    }}
                                    disabled={editLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all ${editLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                    disabled={editLoading}
                                >
                                    {editLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Member'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && selectedMember && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-red-600">Remove Team Member</h2>
                        <div className="mb-6">
                            <p className="text-gray-700 mb-2">
                                Are you sure you want to remove <strong>{selectedMember.fname} {selectedMember.lname}</strong> from your team?
                            </p>
                            <p className="text-sm text-gray-500">
                                This action cannot be undone. The member will lose access to all team resources.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setSelectedMember(null);
                                }}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteConfirm}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all ${deleteLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                        Removing...
                                    </>
                                ) : (
                                    'Remove Member'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-sm transition-all">
                    <div className="flex justify-between items-center mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500 text-xl">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold mb-1">{teamMembers.length}</div>
                    <div className="text-gray-500 text-xs">Total Members</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-sm transition-all">
                    <div className="flex justify-between items-center mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-500 text-xl">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold mb-1">{teamMembers.filter(m => m.status === 'active').length || 0}</div>
                    <div className="text-gray-500 text-xs">Active Members</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-sm transition-all">
                    <div className="flex justify-between items-center mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-500 text-xl">
                            <ListChecks className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold mb-1">-</div>
                    <div className="text-gray-500 text-xs">Tasks Assigned</div>
                </div>
            </div>

            {/* Team Table */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden w-full">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold">All Team Members</h2>
                </div>

                {fetchLoading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-gray-500">Loading team members...</p>
                    </div>
                ) : filteredMembers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {searchQuery ? 'No team members match your search.' : 'No team members found.'}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Member</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {paginatedMembers.map((member) => (
                                        <tr key={member.uuid} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-semibold text-sm text-white">
                                                        {getInitials(member.fname, member.lname)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">
                                                            {member.fname} {member.lname}
                                                        </div>
                                                        {member.alias && (
                                                            <div className="text-xs text-gray-500">@{member.alias}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{member.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${member.role ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                                    {member.role || 'No Role'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(member.joined_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                                        title="Edit"
                                                        onClick={() => handleEditClick(member)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Remove"
                                                        onClick={() => handleDeleteClick(member)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                                <div className="text-sm text-gray-700">
                                    Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-lg transition-all ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-lg transition-all ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default Teams;