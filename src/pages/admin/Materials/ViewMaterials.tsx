import React, { useEffect, useState } from "react";
import axios from "../../../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import "./ViewMaterials.css";
import { toast } from "react-toastify";

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
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<string>("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get("/api/supervisor/materials");
        setMaterials(response.data);
      } catch (err) {
        toast.error("Failed to fetch materials.");
        setError("Failed to fetch materials.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

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

  // Filter materials based on the selected milestone
  const filteredMaterials =
    selectedMilestone === "All"
      ? materials
      : materials.filter(
          (material) => material.milestone === selectedMilestone
        );

  // Filter history based on the selected milestone
  const filteredHistory = materials.flatMap((material) =>
    material.history.filter(
      (entry) =>
        selectedMilestone === "All" || entry.milestone === selectedMilestone
    )
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

      {/* Materials Table */}
      <div className="material-list-container">
        <div className="milestone-filter">
          <label htmlFor="milestoneFilter">Filter by Milestone:</label>
          <select
            id="milestoneFilter"
            value={selectedMilestone}
            onChange={handleMilestoneChange}
          >
            <option value="All">All</option>
            <option value="Foundations">Foundations</option>
            <option value="Slab">Slab</option>
            <option value="Walling">Walling</option>
            <option value="Rinto">Rinto</option>
            <option value="Roofing">Roofing</option>
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

      {/* Material History Table */}
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
