import React, { useEffect, useRef, useState } from "react";
import axios from "../../../axiosConfig";
import "./AdminDashboard.css";
import { useProject } from "../../../context/ProjectContext";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Material {
  _id: string;
  name: string;
  quantity: number;
  totalPrice: number;
  milestone: string;
}

interface Labour {
  _id: string;
  date: string;
  milestone: string;
  totalPay: number;
}

const AdminDashboard: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [labour, setLabour] = useState<Labour[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedMilestone, setSelectedMilestone] = useState<string>("All");
  const { projectId, projectName, setProjectId, setProjectName } = useProject();
  const dashboardRef = useRef<HTMLDivElement>(null);

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
    const fetchMaterialsAndLabour = async () => {
      if (!projectId)
        return (
          <div>
            <h1>Dashboard</h1>
            <p>
              Create a new project first. Click{" "}
              <Link to="/admin/add-projects">here</Link> to create a new project
            </p>
          </div>
        );
      try {
        const [materialsResponse, labourResponse] = await Promise.all([
          axios.get(`/api/supervisor/materials/${projectId}`),
          axios.get(`/api/supervisor/labours/${projectId}`),
        ]);

        const materialsData = materialsResponse.data;
        const labourData = labourResponse.data;

        setMaterials(materialsData);
        setLabour(labourData);

        const totalMaterialsCost = materialsData.reduce(
          (acc: number, material: Material) => acc + material.totalPrice,
          0
        );

        const totalLabourCost = labourData.reduce(
          (acc: number, labour: Labour) => acc + labour.totalPay,
          0
        );

        setTotalCost(totalMaterialsCost + totalLabourCost);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialsAndLabour();
  }, [projectId]);

  const handleMilestoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMilestone(e.target.value);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Export to Excel functionality
  const exportToExcel = () => {
    // Prepare the data that is displayed in the "Costs Summary by Milestone" table
    const exportData: Array<{
      Milestone: string;
      "Total Material Cost (KSH)": string;
      "Total Labour Cost (KSH)": string;
      "Combined Cost (KSH)": string;
    }> = [];

    milestones.forEach((milestone) => {
      if (selectedMilestone !== "All" && milestone !== selectedMilestone) {
        return;
      }

      const { materialCost, labourCost, combinedCost } =
        calculateCostsByMilestone(milestone);

      exportData.push({
        Milestone: milestone,
        "Total Material Cost (KSH)": materialCost.toFixed(2),
        "Total Labour Cost (KSH)": labourCost.toFixed(2),
        "Combined Cost (KSH)": combinedCost.toFixed(2),
      });
    });

    // Add totals to the export data
    const totalMaterialCost = filteredMaterials.reduce(
      (acc, material) => acc + material.totalPrice,
      0
    );

    const totalLabourCost = filteredLabour.reduce(
      (acc, labour) => acc + labour.totalPay,
      0
    );

    const totalCombinedCost = totalMaterialCost + totalLabourCost;

    exportData.push({
      Milestone: "Total",
      "Total Material Cost (KSH)": totalMaterialCost.toFixed(2),
      "Total Labour Cost (KSH)": totalLabourCost.toFixed(2),
      "Combined Cost (KSH)": totalCombinedCost.toFixed(2),
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Costs Summary");

    // Export the workbook
    XLSX.writeFile(workbook, `${projectName}_Costs_Summary.xlsx`);
  };

  // Export to PDF functionality
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Milestone",
      "Total Material Cost (KSH)",
      "Total Labour Cost (KSH)",
      "Combined Cost (KSH)",
    ];
    const tableRows: string[][] = [];

    milestones.forEach((milestone) => {
      if (selectedMilestone !== "All" && milestone !== selectedMilestone) {
        return;
      }

      const { materialCost, labourCost, combinedCost } =
        calculateCostsByMilestone(milestone);

      const rowData = [
        milestone,
        materialCost.toFixed(2),
        labourCost.toFixed(2),
        combinedCost.toFixed(2),
      ];
      tableRows.push(rowData);
    });

    const totalMaterialCost = filteredMaterials.reduce(
      (acc, material) => acc + material.totalPrice,
      0
    );
    const totalLabourCost = filteredLabour.reduce(
      (acc, labour) => acc + labour.totalPay,
      0
    );
    const totalCombinedCost = totalMaterialCost + totalLabourCost;

    tableRows.push([
      "Total",
      totalMaterialCost.toFixed(2),
      totalLabourCost.toFixed(2),
      totalCombinedCost.toFixed(2),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
    });

    doc.save(`${projectName}_Costs_Summary.pdf`);
  };

  if (!projectId)
    return (
      <div>
        <h1>Dashboard</h1>
        <p>
          Select an existing project first or Click{" "}
          <Link to="/admin/add-projects">here</Link> to create a new project
        </p>
      </div>
    );
  if (loading) return <div className="loader">Loading...</div>;
  /*   if (error) return <div className="error">{error}</div>; */

  const milestones = [
    "Foundations",
    "Slab",
    "Walling",
    "Lintel",
    "Roofing",
    "Plumbing",
    "Electrical works",
    "Ceiling",
    "Pluster",
    "Tiling",
    "Fittings",
    "Doors",
    "Windows",
    "Fencing",
    "Landscaping",
  ];

  // Extract unique milestones from the materials list
  const userMilestones = Array.from(
    new Set(materials.map((material) => material.milestone))
  );

  // Combine predefined and user-added milestones
  const allMilestones = Array.from(new Set([...milestones, ...userMilestones]));

  const filteredMaterials =
    selectedMilestone === "All"
      ? materials
      : materials.filter(
          (material) => material.milestone === selectedMilestone
        );

  const filteredLabour =
    selectedMilestone === "All"
      ? labour
      : labour.filter((labour) => labour.milestone === selectedMilestone);

  // Calculate total costs for each milestone
  const calculateCostsByMilestone = (milestone: string) => {
    const materialCost = materials
      .filter((material) => material.milestone === milestone)
      .reduce((acc, material) => acc + material.totalPrice, 0);

    const labourCost = labour
      .filter((labour) => labour.milestone === milestone)
      .reduce((acc, labour) => acc + labour.totalPay, 0);

    const combinedCost = materialCost + labourCost;

    return { materialCost, labourCost, combinedCost };
  };

  return (
    <div className="admin-dashboard" ref={dashboardRef}>
      <div className="admin-dashboard-cost">
        <h1>Dashboard</h1>
        <div className="total-project-cost">
          <h2>
            {projectName} Cost: {formatCurrency(totalCost)}
          </h2>
        </div>
      </div>
      <p className="admin-dashboard-p">
        Welcome to the admin dashboard. Manage materials, tools, and view
        workers here.
      </p>

      <div className="project-filters">
        <div className="milestone-filter">
          <label htmlFor="milestoneFilter">Filter by Milestone:</label>
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
      <div className="exporting-options">
        <div className="dashboard-export-buttons">
          <label>Export to: </label>
          <button className="excel-export-button" onClick={exportToExcel}>
            <i className="fas fa-file-excel"></i> Excel
          </button>
        </div>
        <div className="dashboard-export-buttons">
          <label>Export to: </label>
          <button onClick={exportToPDF} className="pdf-button">
            <i className="fas fa-file-pdf" style={{ marginRight: "8px" }}></i>
            PDF
          </button>
        </div>
      </div>
      <div className="costs-summary">
        <h2 className="admin-dashboard-h2">Costs Summary by Milestone</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Milestone</th>
                <th>Total Material Cost (KSH)</th>
                <th>Total Labour Cost (KSH)</th>
                <th>Combined Cost (KSH)</th>
              </tr>
            </thead>
            <tbody>
              {allMilestones.map((milestone) => {
                const { materialCost, labourCost, combinedCost } =
                  calculateCostsByMilestone(milestone);

                if (
                  selectedMilestone !== "All" &&
                  milestone !== selectedMilestone
                ) {
                  return null;
                }

                return (
                  <tr key={milestone}>
                    <td>{milestone}</td>
                    <td>{materialCost.toFixed(2)}</td>
                    <td>{labourCost.toFixed(2)}</td>
                    <td>{combinedCost.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td>
                  {filteredMaterials
                    .reduce((acc, material) => acc + material.totalPrice, 0)
                    .toFixed(2)}{" "}
                  KSH
                </td>
                <td>
                  {filteredLabour
                    .reduce((acc, labour) => acc + labour.totalPay, 0)
                    .toFixed(2)}{" "}
                  KSH
                </td>
                <td>
                  {(
                    filteredMaterials.reduce(
                      (acc, material) => acc + material.totalPrice,
                      0
                    ) +
                    filteredLabour.reduce(
                      (acc, labour) => acc + labour.totalPay,
                      0
                    )
                  ).toFixed(2)}{" "}
                  KSH
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="total-cost">
        <h2 className="admin-dashboard-h2">Total Costs</h2>
        <p className="total-cost">
          Total Material Cost:{" "}
          <span className="total-cost-span">
            {formatCurrency(
              filteredMaterials.reduce(
                (acc, material) => acc + material.totalPrice,
                0
              )
            )}
          </span>
          {selectedMilestone !== "All" && ` for ${selectedMilestone}`}
        </p>
        <p className="total-cost">
          Total Labour Cost:{" "}
          <span className="total-cost-span">
            {formatCurrency(
              filteredLabour.reduce((acc, labour) => acc + labour.totalPay, 0)
            )}
          </span>
          {selectedMilestone !== "All" && ` for ${selectedMilestone}`}
        </p>
        <p className="total-cost">
          Total Combined Cost:{" "}
          <span className="total-cost-span">
            {formatCurrency(
              filteredMaterials.reduce(
                (acc, material) => acc + material.totalPrice,
                0
              ) +
                filteredLabour.reduce((acc, labour) => acc + labour.totalPay, 0)
            )}
          </span>
          {selectedMilestone !== "All" && ` for ${selectedMilestone}`}
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
