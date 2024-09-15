import React, { useState, useEffect } from "react";
import axios from "../../../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { useProject } from "../../../context/ProjectContext";
import "./ProjectsPage.css";

const ProjectsPage: React.FC = () => {
  const { setProjectId, setProjectName, projectName } = useProject(); // Access projectName from context
  const [projects, setProjects] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects", error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = async (projectId: string, projectName: string) => {
    // Update the project ID and name in the context
    setProjectId(projectId);
    setProjectName(projectName);

    try {
      const response = await axios.get(`/api/projects/${projectId}`);
      // Optionally handle project details here
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error fetching project details", error);
    }
  };

  const handleEditClick = (projectId: string, projectName: string) => {
    // Update the project ID and name in the context
    setProjectId(projectId);
    setProjectName(projectName);

    // Navigate to the edit page
    navigate(`/admin/edit-project/${projectId}`);
  };

  return (
    <div>
      <h1 className="projects-page-h1">Projects</h1>
      <h3 className="projects-page-h1">
        Current Project: {projectName || "None selected"}
      </h3>
      <p>
        Click <Link to="/admin/add-projects">here</Link> to add a new project
      </p>
      <div className="projects-table-container">
        <table className="projects-table">
          <thead>
            <tr>
              <th className="projects-th">Project Name</th>
              <th className="projects-th">Description</th>
              <th className="projects-th">Start Date</th>
              <th className="projects-th">End Date</th>
              <th className="projects-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td className="projects-td">{project.name}</td>
                <td className="projects-td">{project.description}</td>
                <td className="projects-td">
                  {new Date(project.startDate).toLocaleDateString()}
                </td>
                <td className="projects-td">
                  {new Date(project.endDate).toLocaleDateString()}
                </td>
                <td className="projects-td">
                  <button
                    className="edit-button"
                    onClick={() => handleEditClick(project._id, project.name)}
                  >
                    Edit
                  </button>
                  <button
                    className="select-button"
                    onClick={() =>
                      handleProjectClick(project._id, project.name)
                    }
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsPage;
