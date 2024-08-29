import React, { useEffect, useState } from "react";
import axios from "../../../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AddMaterials.css";

const EditMaterial: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [unitType, setUnitType] = useState<string>("Pieces");
  const [milestone, setMilestone] = useState<string>("Foundations");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const response = await axios.get(`/api/supervisor/material/${id}`);
        const material = response.data;
        setName(material.name);
        setQuantity(material.quantity);
        setUnitPrice(material.unitPrice);
        setTotalPrice(material.totalPrice);
        setUnitType(material.unitType);
        setMilestone(material.milestone);
      } catch (err) {
        setError("Failed to fetch material details");
        toast.error("Failed to fetch material details");
      }
    };

    fetchMaterial();
  }, [id]);

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
    setTotalPrice(value * unitPrice);
  };

  const handleUnitPriceChange = (value: number) => {
    setUnitPrice(value);
    setTotalPrice(quantity * value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/supervisor/material/${id}`, {
        name,
        quantity,
        unitPrice,
        totalPrice,
        unitType,
        milestone, // Include milestone in the update
      });
      // Display success toast
      toast.success("Material updated successfully!");

      navigate("/supervisor/view-materials");
    } catch (err) {
      toast.error("Failed to update material");
      setError("Failed to update material");
    }
  };

  return (
    <div className="material-management">
      <h2>Edit Material</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="material-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(Number(e.target.value))}
            required
          />
        </div>
        <div className="form-group">
          <label>Unit Price</label>
          <input
            type="number"
            step="0.01"
            value={unitPrice}
            onChange={(e) => handleUnitPriceChange(Number(e.target.value))}
            required
          />
        </div>
        <div className="form-group">
          <label>Total Price</label>
          <input type="number" step="0.01" value={totalPrice} readOnly />
        </div>
        <div className="form-group">
          <label>Unit Type</label>
          <select
            value={unitType}
            onChange={(e) => setUnitType(e.target.value)}
          >
            <option value="Pieces">Pieces</option>
            <option value="Lorries">Lorries</option>
            <option value="Bags">Bags</option>
            <option value="Feet">Feet</option>
          </select>
        </div>
        <div className="form-group">
          <label>Milestone</label>
          <select
            value={milestone}
            onChange={(e) => setMilestone(e.target.value)}
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
        <button type="submit" className="submit-button">
          Update Material
        </button>
      </form>
    </div>
  );
};

export default EditMaterial;