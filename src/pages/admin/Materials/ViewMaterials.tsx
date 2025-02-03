import React, { useEffect, useState } from "react";
import axios from "../../../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useProject } from "../../../context/ProjectContext";
import * as XLSX from "xlsx"; // Importing XLSX for export to Excel
import jsPDF from "jspdf"; // Importing jsPDF for PDF export
import "jspdf-autotable"; // Importing autoTable for creating tables in PDF
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
  date: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unitType: string;
  milestone: string;
  history: MaterialHistory[];
}

const ViewMaterials: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const { projectId, setProjectId, setProjectName } = useProject();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<string>("All");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("All");
  const navigate = useNavigate();

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
    // Fetch projects to populate the dropdown
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

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMaterial(e.target.value);
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProject = projects.find(
      (project) => project._id === e.target.value
    );
    if (selectedProject) {
      setProjectId(selectedProject._id);
      setProjectName(selectedProject.name);
    }
  };

  const userMilestones = Array.from(
    new Set(materials.map((material) => material.milestone))
  );
  const allMilestones = Array.from(
    new Set([...predefinedMilestones, ...userMilestones])
  );

  const userMaterials = Array.from(
    new Set(materials.map((material) => material.name.trim().toLowerCase()))
  );

  const filteredMaterials = materials.filter((material) => {
    const milestoneMatch =
      selectedMilestone === "All" || material.milestone === selectedMilestone;

    const materialMatch =
      selectedMaterial === "All" ||
      material.name
        .trim()
        .toLowerCase()
        .includes(selectedMaterial.toLowerCase());

    return milestoneMatch && materialMatch;
  });

  const filteredHistory = materials.flatMap((material) =>
    material.history.filter(
      (entry) =>
        (selectedMilestone === "All" ||
          entry.milestone === selectedMilestone) &&
        (selectedMaterial === "All" ||
          entry.name
            .trim()
            .toLowerCase()
            .includes(selectedMaterial.toLowerCase()))
    )
  );

  const totalMaterialCost = filteredMaterials.reduce(
    (acc, material) => acc + material.unitPrice * material.quantity,
    0
  );

  // Function to handle export of filtered data to Excel
  const handleExport = () => {
    // Calculate total cost of filtered materials
    const totalFilteredCost = filteredMaterials.reduce(
      (acc, material) => acc + material.unitPrice * material.quantity,
      0
    );

    // Prepare data for export
    const exportData = filteredMaterials.map((material) => ({
      Date: material.date,
      Name: material.name,
      Quantity: material.quantity,
      "Unit Price": material.unitPrice.toFixed(2),
      "Total Price": (material.unitPrice * material.quantity).toFixed(2),
      "Unit Type": material.unitType,
      Milestone: material.milestone,
    }));

    // Add a total cost row at the end
    exportData.push({
      Date: "",
      Name: "Total Cost",
      Quantity: 0,
      "Unit Price": "",
      "Total Price": totalFilteredCost.toFixed(2),
      "Unit Type": "",
      Milestone: "",
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Materials");

    XLSX.writeFile(workbook, "Materials_Report.xlsx");
  };

  // Function to handle export of filtered data to PDF
  const handlePDFExport = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Date",
          "Name",
          "Quantity",
          "Unit Price",
          "Total Price",
          "Unit Type",
          "Milestone",
        ],
      ],
      body: filteredMaterials.map((material) => [
        material.date,
        material.name,
        material.quantity,
        material.unitPrice.toFixed(2),
        (material.unitPrice * material.quantity).toFixed(2),
        material.unitType,
        material.milestone,
      ]),
    });
    doc.text(
      `Total Material Cost: ${totalMaterialCost.toFixed(2)} KSH`,
      14,
      doc.lastAutoTable.finalY + 10
    );
    doc.save("Materials_Report.pdf");
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="viewmaterials">
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

      <div>
        <div className="material-list-container">
          <div className="material-filters">
            <div className="milestone-filter">
              <label htmlFor="milestoneFilter" className="filter-milestone">
                Filter by Milestone:
              </label>
              <select
                id="milestoneFilter"
                value={selectedMilestone}
                onChange={handleMilestoneChange}
                style={{ width: "140px" }}
              >
                <option value="All">All</option>
                {allMilestones.map((milestone, index) => (
                  <option key={index} value={milestone}>
                    {milestone}
                  </option>
                ))}
              </select>
            </div>

            <div className="milestone-filter">
              <label htmlFor="materialFilter">Filter by Material:</label>
              <select
                id="materialFilter"
                value={selectedMaterial}
                onChange={handleMaterialChange}
                style={{ width: "140px" }}
              >
                <option value="All">All</option>
                {userMaterials.map((material, index) => (
                  <option key={index} value={material}>
                    {material.charAt(0).toUpperCase() + material.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="project-filter">
              <label htmlFor="projectFilter">Select Project:</label>
              <select
                id="projectFilter"
                onChange={handleProjectChange}
                /* style={{ width: "140px" }} */
              >
                <option value="">Select a Project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="exporting-options">
          <div className="export-button-container">
            <label>Export to: </label>
            <button className="excel-export-button" onClick={handleExport}>
              <i className="fas fa-file-excel"></i> Excel
            </button>
          </div>

          <div className="export-button-container">
            <label>Export to: </label>
            <button onClick={handlePDFExport} className="pdf-button">
              <i className="fas fa-file-pdf" style={{ marginRight: "8px" }}></i>
              PDF
            </button>
          </div>
        </div>
        <h2 className="view-materials-h2">Materials</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Milestone</th>
                <th>Material Type</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
                <th>Unit Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((material) => (
                <tr key={material._id}>
                  <td>{material.date}</td> <td>{material.milestone}</td>
                  <td>{material.name}</td>
                  <td>{material.quantity}</td>
                  <td>{material.unitPrice.toFixed(2)}</td>
                  <td>{(material.unitPrice * material.quantity).toFixed(2)}</td>
                  <td>{material.unitType}</td>
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
                <th>Material Type</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
                <th>Unit Type</th>
                <th>Milestone</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.date}</td>
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
