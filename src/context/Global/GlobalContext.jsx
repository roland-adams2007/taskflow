import { createContext, useEffect, useState, useRef } from 'react';
import { Cookies } from "react-cookie";
import axiosInstance from '../../api/axiosinstance';
import { useAlert } from '../Alert/UseAlert';


const GlobalContext = createContext();


export const GlobalProvider = ({ children }) => {
    const { showAlert } = useAlert();
    const [teamMembers, setTeamMembers] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [projectFetchLoading, setProjectFetchLoading] = useState(true);
    const [projectDetails, setProjectDetails] = useState([]);
    const [projectDetailsFetchLoading, setProjectDetailsFetchLoading] = useState(true);
    const [projectTeam, setProjectTeam] = useState([]);
    const [projectTeamFetchLoading, setProjectTeamFetchLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [taskFetchLoading, setTaskFetchLoading] = useState(true);
    const [taskDetails, setTaskDetails] = useState(null);
    const [taskDetailsFetchLoading, setTaskDetailsFetchLoading] = useState(true);
    const [taskCount, setTaskCount] = useState(0);
    const [user, setUser] = useState([]);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        fetchCurrentUser();
    }, [])

    const fetchCurrentUser = async () => {
        try {
            setUserLoading(true);
            const response = await axiosInstance.get('/users/current');
            const res = response.data;
            setUser(res.data);
        } catch (error) {
            setUser([]);
            console.error('Error fetching current user:', error);
        } finally {
            setUserLoading(false);
        }
    };

    const fetchTeamMembers = () => {
        setFetchLoading(true);
        axiosInstance.get("/teams")
            .then(response => {
                const res = response.data;
                if (res.status === 200 && res.data) {
                    setTeamMembers(res.data);
                } else {
                    showAlert(res.message || 'Unable to fetch team members.', 'error');
                }
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                const message = errRes.message || "Failed to load team members.";
                showAlert(message, 'error');
            })
            .finally(() => {
                setFetchLoading(false);
            });
    };

    const fetchAllProjects = () => {
        setProjectFetchLoading(true);
        axiosInstance.get("/projects")
            .then(response => {
                const res = response.data;
                if (res.status == 200 && res.data) {
                    setProjects(res.data);
                } else {
                    showAlert(res.message || 'Unable to fetch team members.', 'error');
                }
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                const message = errRes.message || "Failed to load team members.";
                showAlert(message, 'error');
            })
            .finally(() => {
                setProjectFetchLoading(false);
            });
    };

    const getProjectDetails = (projectId) => {
        setProjectDetailsFetchLoading(true);
        axiosInstance.get(`/projects/${projectId}`)
            .then(response => {
                const res = response.data;
                if (res.status == 200 && res.data) {
                    setProjectDetails(res.data);
                } else {
                    showAlert(res.message || 'Unable to fetch team members.', 'error');
                }
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                const message = errRes.message || "Failed to load team members.";
                showAlert(message, 'error');
            })
            .finally(() => {
                setProjectDetailsFetchLoading(false);
            });
    }

    const getProjectTeam = (projectUUid) => {
        setProjectTeamFetchLoading(true);

        axiosInstance.get(`/projects/team/${projectUUid}`)
            .then(response => {
                const res = response.data;
                if (res.status == 200 && res.data) {
                    setProjectTeam(res.data);
                } else {
                    showAlert(res.message || 'Unable to fetch project team.', 'error');
                }
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                const message = errRes.message || "Failed to load project team.";
                showAlert(message, 'error');
            })
            .finally(() => {
                setProjectTeamFetchLoading(false);
            });
    }

    const getTasks = () => {
        setTaskFetchLoading(true);
        axiosInstance.get("/tasks")
            .then(response => {
                const res = response.data;
                if (res.status == 200 && res.data) {
                    setTasks(res.data);
                } else {
                    showAlert(res.message || 'Unable to fetch team members.', 'error');
                }
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                const message = errRes.message || "Failed to load team members.";
                showAlert(message, 'error');
            })
            .finally(() => {
                setTaskFetchLoading(false);
            });
    }

    const getTaskDetails = (taskId) => {
        setTaskDetailsFetchLoading(true);
        axiosInstance.get(`/tasks/${taskId}`)
            .then(response => {
                const res = response.data;
                if (res.status == 200 && res.data) {
                    setTaskDetails(res.data);
                } else {
                    showAlert(res.message || 'Unable to fetch team members.', 'error');
                }
            })
            .catch(error => {
                const errRes = error.response?.data || {};
                const message = errRes.message || "Failed to load team members.";
                showAlert(message, 'error');
            })
            .finally(() => {
                setTaskDetailsFetchLoading(false);
            });
    }

    const getTaskCounts = () => {
        axiosInstance.get("/tasks/counts")
            .then(response => {
                const res = response.data;
                if (res.status == 200 && res.data) {
                    setTaskCount(res.data);
                } else {
                    setTaskCount(0);
                }
            })
            .catch(error => {
                setTaskCount(0);
            })
    }

    const logout = () => {
        return axiosInstance.post('/users/logout')
            .then(response => {
                return response;
            })
            .catch(error => {
                throw error;
            });
    };




    return (
        <GlobalContext.Provider
            value={{
                teamMembers,
                fetchLoading,
                fetchTeamMembers,
                fetchAllProjects,
                projects,
                projectFetchLoading,
                getProjectTeam,
                projectTeam,
                projectTeamFetchLoading,
                taskCount,
                getTaskCounts,
                getTasks,
                tasks,
                taskFetchLoading,
                getTaskDetails,
                taskDetailsFetchLoading,
                taskDetails,
                projectDetails,
                projectDetailsFetchLoading,
                getProjectDetails,
                user,
                userLoading,
                logout

            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContext };
