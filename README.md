# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

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
\_id: string;
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

// Predefined milestones
const predefinedMilestones = [
"Foundations",
"Slab",
"Walling",
"Rinto",
"Roofing",
"Plumbing",
"Electrical works",
"Roofing",
"Ceiling",
"Pluster",
"Tiling",
"Fittings",
"Doors",
"Windows",
];

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
setMaterials(materials.filter((material) => material.\_id !== id));
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

// Extract unique milestones from the materials list
const userMilestones = Array.from(
new Set(materials.map((material) => material.milestone))
);

// Combine predefined and user-added milestones
const allMilestones = Array.from(
new Set([...predefinedMilestones, ...userMilestones])
);

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
const [useCustomMilestone, setUseCustomMilestone] = useState<boolean>(false); // Toggle for custom milestone
const [customMilestone, setCustomMilestone] = useState<string>(""); // State for custom milestone
const navigate = useNavigate();

const handleChange = (
e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
const { name, value } = e.target;
setMaterial((prev) => {
const updatedMaterial = { ...prev, [name]: value };
if (name === "quantity" || name === "unitPrice") {
updatedMaterial.totalPrice =
updatedMaterial.quantity \* updatedMaterial.unitPrice;
}
return updatedMaterial;
});
};

const handleCustomMilestoneChange = (
e: React.ChangeEvent<HTMLInputElement>
) => {
setCustomMilestone(e.target.value);
};

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

    if (isSubmitting) return; // Prevent resubmission if the form is already being submitted

    setIsSubmitting(true); // Set submitting state to true

    // If using a custom milestone, set it in the material object
    const materialToSubmit = {
      ...material,
      milestone: useCustomMilestone ? customMilestone : material.milestone,
    };

    try {
      await axios.post("/api/supervisor/material", materialToSubmit);
      setMessage(`Material ${material.name} added successfully!`);
      toast.success(`Material ${material.name} added successfully!`);
    } catch (error: any) {
      setMessage(`Error while adding material.`);
      toast.error(`Error adding material: ${error.message}`);
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
              <option value="Roofing">Roofing</option>
              <option value="Ceiling">Ceiling</option>
              <option value="Pluster">Pluster</option>
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
          className="submit-btn"
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
