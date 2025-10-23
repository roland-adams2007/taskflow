import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosinstance';
import { useAlert } from '../context/Alert/UseAlert';
import { useGlobal } from '../context/Global/useGlobal';
import { Menu, Search, Calendar, PlusCircle, MoreVertical } from 'lucide-react';

const Projects = () => {
    const { showAlert } = useAlert();
    const { fetchAllProjects, projects, projectFetchLoading } = useGlobal();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllProjects();
    }, []);

    // Filter and sort projects
    const filteredProjects = projects
        .filter(project =>
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (statusFilter === 'all' || project.status === statusFilter)
        )
        .sort((a, b) => {
            if (sortBy === 'deadline') {
                return new Date(a.end_date) - new Date(b.end_date);
            } else if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });

    // Skeleton loader component
    const SkeletonLoader = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-5 animate-pulse">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-3 h-3 bg-gray-300 rounded-sm mt-1"></div>
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="mb-3">
                        <div className="w-full h-1.5 bg-gray-200 rounded-sm overflow-hidden">
                            <div className="h-full bg-gray-300 rounded-sm" style={{ width: '50%' }}></div>
                        </div>
                        <div className="h-3 bg-gray-300 rounded w-1/4 mt-1"></div>
                    </div>
                    <div className="h-3 bg-gray-300 rounded w-1/3 mb-3"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
                        <div className="w-7 h-7 bg-gray-300 rounded-full -ml-2"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('default', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <main className="flex-1">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-4 w-full">
                    <div>
                        <h1 className="font-['Space_Grotesk'] text-3xl font-bold mb-1">Projects</h1>
                        <p className="text-gray-500 text-base">Manage your projects and track progress</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto flex-col sm:flex-row">
                    <div className="search-bar relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="text"
                            id="projectSearch"
                            placeholder="Search projects..."
                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        id="statusFilter"
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 hover:border-gray-300 hover:bg-white focus:outline-none focus:border-blue-500 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width=%2712%27%20height=%278%27%20viewBox=%270%200%2012%208%27%20fill=%27none%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath%20d=%27M1%201.5L6%206.5L11%201.5%27%20stroke=%27%2364748b%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center]"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="0">Active</option>
                        <option value="1">Completed</option>
                    </select>
                    <select
                        id="sortBy"
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 hover:border-gray-300 hover:bg-white focus:outline-none focus:border-blue-500 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width=%2712%27%20height=%278%27%20viewBox=%270%200%2012%208%27%20fill=%27none%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath%20d=%27M1%201.5L6%206.5L11%201.5%27%20stroke=%27%2364748b%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center]"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="name">Sort by Name</option>
                        <option value="deadline">Sort by Deadline</option>
                    </select>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all flex items-center gap-2"
                        onClick={() => navigate('/projects/add')}
                    >
                        <PlusCircle className="h-4 w-4" />
                        New Project
                    </button>
                </div>
            </header>

            {projectFetchLoading ? (
                <SkeletonLoader />
            ) : (
                <div id="projectsGrid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                    {filteredProjects.map(project => (
                        <div
                            key={project.uuid}
                            className="project-card bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer"
                            onClick={() => navigate(`/projects/${project.uuid}`)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-3 h-3 rounded-sm mt-1" style={{ backgroundColor: project.color }}></div>
                                <MoreVertical className="text-gray-400 text-lg" />
                            </div>
                            <h3 className="text-base font-semibold mb-2">{project.name}</h3>
                            <p className="text-gray-500 text-sm mb-4">{project.description}</p>
                            <div className="mb-3">
                                <div className="w-full h-1.5 bg-gray-100 rounded-sm overflow-hidden">
                                    <div className="h-full rounded-sm" style={{ width: '0%', backgroundColor: project.color }}></div>
                                </div>
                                <span className="text-xs text-gray-500">0% complete</span>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar className="text-sm text-gray-500" />
                                <span className="text-xs text-gray-500">Due: {formatDate(project.end_date)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default Projects;