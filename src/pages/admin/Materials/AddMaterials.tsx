import React, { useState, useEffect } from "react";
import axios from "../../../axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useProject } from "../../../context/ProjectContext"; // Import the project context
import "./AddMaterials.css";

interface Material {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitType: string;
  milestone: string;
  dateAdded: string; // New dateAdded field
}

const AddMaterials: React.FC = () => {
  const { projectId } = useProject(); // Get projectId from context
  const [material, setMaterial] = useState<Material>({
    name: "",
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    unitType: "Pieces",
    milestone: "Foundations",
    dateAdded: "", // Initialize dateAdded
  });
  const [customMilestone, setCustomMilestone] = useState<string>("");
  const [useCustomMilestone, setUseCustomMilestone] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Calculate total price whenever quantity or unit price changes
  useEffect(() => {
    if (material.quantity && material.unitPrice) {
      setMaterial((prev) => ({
        ...prev,
        totalPrice: prev.quantity * prev.unitPrice,
      }));
    }
  }, [material.quantity, material.unitPrice]);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMaterial((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle custom milestone input change
  const handleCustomMilestoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomMilestone(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }

    setIsSubmitting(true);

    const materialToSubmit = {
      ...material,
      milestone: useCustomMilestone ? customMilestone : material.milestone,
    };

    try {
      await axios.post(
        `/api/supervisor/material/${projectId}`,
        materialToSubmit
      );
      setMessage(`Material ${material.name} added successfully!`);
      toast.success(`Material ${material.name} added successfully!`);
      navigate("/supervisor/view-materials");
    } catch (error: any) {
      setMessage(`Error while adding material.`);
      toast.error(`Error adding material: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="material-management">
      <h2 className="material-management-h2">Manage Materials</h2>
      <form className="material-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Material Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={material.name}
            onChange={handleChange}
            className="input-material"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={material.quantity}
            onChange={handleChange}
            className="input-material"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="unitPrice">Unit Price</label>
          <input
            type="number"
            id="unitPrice"
            name="unitPrice"
            value={material.unitPrice}
            onChange={handleChange}
            className="input-material"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="unitType">Unit Type</label>
          <select
            id="unitType"
            name="unitType"
            value={material.unitType}
            onChange={handleChange}
            className="input-material"
            required
          >
            <option value="Pieces">Pieces</option>
            <option value="Lorries">Lorries</option>
            <option value="Bags">Bags</option>
            <option value="Feet">Feet</option>
            <option value="KGs">KGs</option>
            <option value="Tonnes">Tonnes</option>
            <option value="Wheelbarrows">Wheelbarrows</option>
            <option value="Litters">Litters</option>
          </select>
        </div>

        <div className="form-group">
          <label>Milestone</label>
          <div>
            <label>
              <input
                type="radio"
                name="milestoneOption"
                checked={!useCustomMilestone}
                onChange={() => setUseCustomMilestone(false)}
              />
              Select from options
            </label>
            <label>
              <input
                type="radio"
                name="milestoneOption"
                checked={useCustomMilestone}
                onChange={() => setUseCustomMilestone(true)}
              />
              Add custom milestone
            </label>
          </div>

          {!useCustomMilestone ? (
            <select
              id="milestone"
              name="milestone"
              value={material.milestone}
              onChange={handleChange}
              className="input-material"
              required
            >
              <option value="Foundations">Foundations</option>
              <option value="Slab">Slab</option>
              <option value="Walling">Walling</option>
              <option value="Rinto">Rinto</option>
              <option value="Roofing">Roofing</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical works">Electrical works</option>
              <option value="Ceiling">Ceiling</option>
              <option value="Plaster">Plaster</option>
              <option value="Tiling">Tiling</option>
              <option value="Fittings">Fittings</option>
              <option value="Doors">Doors</option>
              <option value="Windows">Windows</option>
            </select>
          ) : (
            <input
              type="text"
              id="customMilestone"
              value={customMilestone}
              onChange={handleCustomMilestoneChange}
              className="input-material"
              placeholder="Enter custom milestone"
              required={useCustomMilestone}
            />
          )}
        </div>

        {/* Date Added Field */}
        <div className="form-group">
          <label htmlFor="dateAdded">Date Added</label>
          <input
            type="date"
            id="dateAdded"
            name="dateAdded"
            value={material.dateAdded}
            onChange={handleChange}
            className="input-material"
            required
          />
        </div>

        <div className="form-group">
          <label>Total Price</label>
          <input
            type="text"
            value={material.totalPrice.toFixed(2)}
            className="input-material"
            readOnly
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default AddMaterials;
