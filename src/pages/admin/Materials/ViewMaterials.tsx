import React, { useEffect, useState } from "react";
import axios from "../../../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useProject } from "../../../context/ProjectContext"; // Adjust path as needed
import "./ViewMaterials.css";

interface MaterialHistory {
  date: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitType: string;
  milestone: string;
}

interface Material {
  _id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unitType: string;
  milestone: string;
  history: MaterialHistory[];
}

const ViewMaterials: React.FC = () => {
  const { projectId } = useProject();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<string>("All");
  const navigate = useNavigate();

  // Predefined milestones
  const predefinedMilestones = [
    "Foundations",
    "Slab",
    "Walling",
    "Rinto",
    "Roofing",
    "Plumbing",
    "Electrical works",
    "Ceiling",
    "Pluster",
    "Tiling",
    "Fittings",
    "Doors",
    "Windows",
  ];

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!projectId)
        return (
          <p>
            Create a new project first. Click{" "}
            <Link to="/admin/add-projects">here</Link> to create a new project
          </p>
        );

      try {
        const response = await axios.get(
          `/api/supervisor/materials/${projectId}`
        );
        setMaterials(response.data);
      } catch (err) {
        toast.error("Failed to fetch materials.");
        setError("Failed to fetch materials.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [projectId]);

  const handleEdit = (id: string) => {
    navigate(`/supervisor/edit-material/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        await axios.delete(`/api/supervisor/material/${id}`);
        setMaterials(materials.filter((material) => material._id !== id));
        toast.success("Material deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete material.");
        setError("Failed to delete material.");
      }
    }
  };

  const handleMilestoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMilestone(e.target.value);
  };

  const userMilestones = Array.from(
    new Set(materials.map((material) => material.milestone))
  );
  const allMilestones = Array.from(
    new Set([...predefinedMilestones, ...userMilestones])
  );

  const filteredMaterials =
    selectedMilestone === "All"
      ? materials
      : materials.filter(
          (material) => material.milestone === selectedMilestone
        );

  const filteredHistory = materials.flatMap((material) =>
    material.history.filter(
      (entry) =>
        selectedMilestone === "All" || entry.milestone === selectedMilestone
    )
  );

  // Calculate the total cost of all materials
  const totalMaterialCost = filteredMaterials.reduce(
    (acc, material) => acc + material.unitPrice * material.quantity,
    0
  );

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1 className="view-materials-h1">View your available materials</h1>
      <p className="view-materials-p">
        Click
        <Link to={"/supervisor/add-materials"} className="view-materials-link">
          {" "}
          here{" "}
        </Link>
        to add more materials.
      </p>

      <div className="material-total-cost">
        <h2 className="material-total-cost-h2">
          Total Material Cost: {totalMaterialCost.toFixed(2)} KSH
        </h2>
      </div>
      <div className="material-list-container">
        <div className="milestone-filter">
          <label htmlFor="milestoneFilter">Filter by Milestone:</label>
          <select
            id="milestoneFilter"
            value={selectedMilestone}
            onChange={handleMilestoneChange}
          >
            <option value="All">All</option>
            {allMilestones.map((milestone, index) => (
              <option key={index} value={milestone}>
                {milestone}
              </option>
            ))}
          </select>
        </div>
        <h2 className="view-Materials-h2">Materials</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
                <th>Unit Type</th>
                <th>Milestone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((material) => (
                <tr key={material._id}>
                  <td>{material.name}</td>
                  <td>{material.quantity}</td>
                  <td>{material.unitPrice.toFixed(2)}</td>
                  <td>{(material.unitPrice * material.quantity).toFixed(2)}</td>
                  <td>{material.unitType}</td>
                  <td>{material.milestone}</td>
                  <td className="edit-delete-btns">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(material._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(material._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="material-history-container">
        <h2>Material History</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
                <th>Unit Type</th>
                <th>Milestone</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((entry, index) => (
                <tr key={`${entry.name}-${index}`}>
                  <td>{new Date(entry.date).toLocaleDateString()}</td>
                  <td>{entry.name}</td>
                  <td>{entry.quantity}</td>
                  <td>{entry.unitPrice.toFixed(2)}</td>
                  <td>{entry.totalPrice.toFixed(2)}</td>
                  <td>{entry.unitType}</td>
                  <td>{entry.milestone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewMaterials;
