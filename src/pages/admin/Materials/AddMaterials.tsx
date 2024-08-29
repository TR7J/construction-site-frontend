import React, { useState } from "react";
import axios from "../../../axiosConfig";
import "./AddMaterials.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Material {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitType: string;
  milestone: string;
}

const AddMaterials: React.FC = () => {
  const [material, setMaterial] = useState<Material>({
    name: "",
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    unitType: "Pieces",
    milestone: "Foundations",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // State to track submission
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMaterial((prev) => {
      const updatedMaterial = { ...prev, [name]: value };
      if (name === "quantity" || name === "unitPrice") {
        updatedMaterial.totalPrice =
          updatedMaterial.quantity * updatedMaterial.unitPrice;
      }
      return updatedMaterial;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent resubmission if the form is already being submitted

    setIsSubmitting(true); // Set submitting state to true

    try {
      // Check if material already exists to update or create a new one
      const existingMaterial = await axios.get(
        `/api/supervisor/material/${material.name}`
      );
      const updatedMaterial = {
        ...material,
        quantity: existingMaterial.data.quantity + material.quantity,
        history: [
          ...existingMaterial.data.history,
          {
            date: new Date().toISOString(),
            name: material.name,
            quantity: material.quantity,
            unitPrice: material.unitPrice,
            totalPrice: material.totalPrice,
            unitType: material.unitType,
            milestone: material.milestone,
          },
        ],
      };

      await axios.put(
        `/api/supervisor/material/${material.name}`,
        updatedMaterial
      );
      setMessage(`Material ${material.name} updated successfully!`);
      toast.success(`Material ${material.name} updated successfully!`);
    } catch (error) {
      await axios.post("/api/supervisor/material", material);
      setMessage(`Material ${material.name} added successfully!`);
      toast.success(`Material ${material.name} added successfully!`);
    } finally {
      setIsSubmitting(false); // Reset submitting state to false after submission
      navigate("/supervisor/view-materials");
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
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="milestone">Milestone</label>
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
            <option value="Roofing">Roofing</option>
            <option value="Ceiling">Ceiling</option>
            <option value="Pluster">Pluster</option>
            <option value="Tiling">Tiling</option>
            <option value="Fittings">Fittings</option>
            <option value="Doors">Doors</option>
            <option value="Windows">Windows</option>
          </select>
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

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting} // Disable the submit button during submission
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddMaterials;
