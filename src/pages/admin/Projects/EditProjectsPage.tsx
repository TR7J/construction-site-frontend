import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "../../../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../../../context/ProjectContext";

const EditProjectPage: React.FC = () => {
  const { projectId } = useProject();
  const [project, setProject] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) {
      console.error("Project ID is undefined");
      return;
    }

    const fetchProject = async () => {
      try {
        const response = await axios.get(`/api/projects/${projectId}`);
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project details", error);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProject((prevProject: any) => ({
      ...prevProject,
      [name]: value,
    }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      console.error("Project ID is undefined");
      return;
    }
    try {
      await axios.put(`/api/projects/${projectId}`, project);
      navigate("/admin/projects");
    } catch (error) {
      console.error("Error updating project", error);
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="project">
      <h1>Edit Project</h1>
      <form onSubmit={handleSave} className="material-form">
        <div className="form-group">
          <label htmlFor="name">Project Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={project.name || ""}
            className="input-projects"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={project.description || ""}
            className="input-projects"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="input-projects"
            value={
              project.startDate
                ? new Date(project.startDate).toISOString().split("T")[0]
                : ""
            }
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className="input-projects"
            value={
              project.endDate
                ? new Date(project.endDate).toISOString().split("T")[0]
                : ""
            }
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <button type="submit" className="submit-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectPage;
