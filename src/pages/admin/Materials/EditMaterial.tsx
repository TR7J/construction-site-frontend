import React, { useEffect, useState } from "react";
import axios from "../../../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AddMaterials.css";
import { format } from "date-fns";

const EditMaterial: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [unitType, setUnitType] = useState<string>("Pieces");
  const [milestone, setMilestone] = useState<string>("Foundations");
  const [customMilestone, setCustomMilestone] = useState<string>(""); // Custom milestone state
  const [isCustomMilestone, setIsCustomMilestone] = useState<boolean>(false); // Track if custom milestone is used
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<string>("");

  // Fetch material details when component loads
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
        setDate(material.date ? format(new Date(material.date), "PPP") : "");

        if (
          ![
            "Foundations",
            "Slab",
            "Walling",
            "Lintel",
            "Roofing",
            "Plumbing",
            "Electrical works",
            "Ceiling",
            "Plaster",
            "Tiling",
            "Fittings",
            "Doors",
            "Windows",
          ].includes(material.milestone)
        ) {
          setIsCustomMilestone(true);
          setCustomMilestone(material.milestone);
        }
      } catch (err) {
        setError("Failed to fetch material details");
        toast.error("Failed to fetch material details");
      }
    };

    fetchMaterial();
  }, [id]);

  // Calculate total price when quantity or unit price changes
  const handleQuantityChange = (value: number) => {
    setQuantity(value);
    setTotalPrice(value * unitPrice);
  };

  const handleUnitPriceChange = (value: number) => {
    setUnitPrice(value);
    setTotalPrice(quantity * value);
  };

  // Handle the milestone selection (predefined or custom)
  const handleMilestoneChange = (value: string) => {
    if (value === "Custom") {
      setIsCustomMilestone(true);
      setMilestone("");
    } else {
      setIsCustomMilestone(false);
      setMilestone(value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/supervisor/material/${id}`, {
        name,
        quantity,
        unitPrice,
        totalPrice,
        unitType,
        milestone: isCustomMilestone ? customMilestone : milestone,
        date,
      });
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
            <option value="Wheelbarrows">Wheelbarrows</option>
            <option value="Litters">Litters</option>
          </select>
        </div>
        <div className="form-group">
          <label>Milestone</label>
          <select
            value={isCustomMilestone ? "Custom" : milestone}
            onChange={(e) => handleMilestoneChange(e.target.value)}
          >
            <option value="Foundations">Foundations</option>
            <option value="Slab">Slab</option>
            <option value="Walling">Walling</option>
            <option value="Lintel">Lintel</option>
            <option value="Roofing">Roofing</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical works">Electrical works</option>
            <option value="Ceiling">Ceiling</option>
            <option value="Plaster">Plaster</option>
            <option value="Tiling">Tiling</option>
            <option value="Fittings">Fittings</option>
            <option value="Doors">Doors</option>
            <option value="Windows">Windows</option>
            <option value="Custom">Custom Milestone</option>
          </select>
          {isCustomMilestone && (
            <input
              type="text"
              value={customMilestone}
              onChange={(e) => setCustomMilestone(e.target.value)}
              placeholder="Enter custom milestone"
              required
            />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date Added</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-material"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Update Material
        </button>
      </form>
      {date && <p>Last updated on: {date}</p>}
    </div>
  );
};

export default EditMaterial;
