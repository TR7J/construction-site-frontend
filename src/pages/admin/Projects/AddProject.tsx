import React, { useState } from "react";
import axios from "../../../axiosConfig";
import { toast } from "react-toastify";
import "./AddProject.css";
import { useNavigate } from "react-router-dom";

const AddProject: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/projects", {
        name,
        description,
        startDate,
        endDate,
      });
      toast.success("Project created");
      navigate("/admin/projects");
    } catch (error) {
      console.error("Error creating project", error);
    }
  };

  return (
    <div className="project">
      <h1>Add New Project</h1>
      <form className="material-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-projects"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Description:
            <input
              type="text"
              value={description}
              className="input-projects"
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" className="submit-btn-project">
          Create Project
        </button>
      </form>
    </div>
  );
};

export default AddProject;
