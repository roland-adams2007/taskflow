import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "../components/utils/Loader";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";

const Layout = lazy(() => import("../layouts/Layout"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Teams = lazy(() => import("../pages/Teams"));
const Tasks = lazy(() => import("../pages/Tasks"));
const Projects = lazy(() => import("../pages/Projects"));
const Calendar = lazy(() => import('../pages/Calander'));
const Settings = lazy(() => import('../pages/Settings'));

const AddProject = lazy(() => import("../components/projects/AddProjects"));
const AddTasks = lazy(() => import("../components/tasks/AddTasks"));
const TaskDetails = lazy(() => import("../components/tasks/TaskDetails"));
const ProjectDetails = lazy(() => import('../components/projects/ProjectDetails'))


export default function AppRoutes() {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/projects/add" element={<AddProject />} />
                    <Route path="/tasks/add" element={<AddTasks />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/tasks/:taskId" element={<TaskDetails />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:projectId" element={<ProjectDetails />} />
                </Route>


                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}
