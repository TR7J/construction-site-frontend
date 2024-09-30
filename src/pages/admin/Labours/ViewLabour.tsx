import React, { useState, useEffect, useRef } from "react";
import axios from "../../../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ViewLabour.css";
import { useProject } from "../../../context/ProjectContext";
import * as XLSX from "xlsx"; // Import XLSX for Excel export
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

interface Labour {
  _id: string;
  date: string;
  milestone: string;
  labourType: string;
  mainSupervisor: {
    name: string;
    pay: number;
  };
  fundis: {
    name: string;
    pay: number;
  }[];
  helpers: {
    name: string;
    pay: number;
  }[];
  totalFundisPay: number;
  totalHelpersPay: number;
  totalPay: number;
}

const ViewLabour: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const { projectId, setProjectId, setProjectName } = useProject();
  const [labours, setLabours] = useState<Labour[]>([]);
  const [filteredMilestone, setFilteredMilestone] = useState<string>("");
  const [filteredLabourType, setFilteredLabourType] = useState<string>("");
  const navigate = useNavigate();
  const dashboardRef = useRef<HTMLDivElement>(null);

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
    const fetchLabours = async () => {
      if (!projectId)
        return (
          <p>
            Create a new project first. Click{" "}
            <Link to="/admin/add-projects">here</Link> to create a new project
          </p>
        );
      try {
        const { data } = await axios.get(
          `/api/supervisor/labours/${projectId}`
        );
        setLabours(data);
      } catch (error) {
        toast.error("Error fetching labours.");
        console.error("Error fetching labours:", error);
      }
    };
    fetchLabours();
  }, [projectId]);

  const handleMilestoneFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilteredMilestone(e.target.value);
  };

  const handleLabourTypeFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilteredLabourType(e.target.value);
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
    new Set(labours.map((labour) => labour.milestone))
  );

  const allMilestones = Array.from(
    new Set([...predefinedMilestones, ...userMilestones])
  );

  const handleEdit = (id: string) => {
    navigate(`/supervisor/edit-labour/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/supervisor/labour/${id}`);
      setLabours(labours.filter((labour) => labour._id !== id));
      toast.success("Labour deleted successfully!");
    } catch (error) {
      toast.error("Error deleting labour.");
      console.error("Error deleting labour:", error);
    }
  };

  const filteredLabours = labours.filter(
    (labour) =>
      (filteredMilestone ? labour.milestone === filteredMilestone : true) &&
      (filteredLabourType ? labour.labourType === filteredLabourType : true)
  );

  const totalLabourCost = filteredLabours.reduce(
    (acc, labour) => acc + labour.totalPay,
    0
  );

  // Function to handle export of filtered labour data to Excel
  const handleExport = () => {
    // Calculate total cost of filtered labours
    const totalFilteredCost = filteredLabours.reduce(
      (acc, labour) => acc + labour.totalPay,
      0
    );

    // Prepare data for export
    const exportData = filteredLabours.map((labour) => ({
      Date: labour.date,
      Milestone: labour.milestone,
      "Labour Type": labour.labourType,
      "Main Supervisor": `${labour.mainSupervisor.name} - ${labour.mainSupervisor.pay} KSH`,
      "Total Pay (KSH)": labour.totalPay.toFixed(2),
      Fundis: labour.fundis
        .map((fundi) => `${fundi.name} - ${fundi.pay} KSH`)
        .join(", "),
      Helpers: labour.helpers
        .map((helper) => `${helper.name} - ${helper.pay} KSH`)
        .join(", "),
    }));

    // Add a total cost row at the end
    exportData.push({
      Date: "",
      Milestone: "Total Cost",
      "Labour Type": "",
      "Main Supervisor": "",
      "Total Pay (KSH)": totalFilteredCost.toFixed(2),
      Fundis: "",
      Helpers: "",
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Labour");

    XLSX.writeFile(workbook, "Labour_Report.xlsx");
  };

  // Function to handle export of filtered labour data to PDF
  const handlePDFExport = () => {
    const doc = new jsPDF();

    // Define the table headers
    doc.autoTable({
      head: [
        [
          "Date",
          "Milestone",
          "Labour Type",
          "Main Supervisor",
          "Fundis [Name - Pay]",
          "Helpers [Name - Pay]",
          "Total Pay (KSH)",
        ],
      ],
      body: filteredLabours.map((labour) => [
        format(new Date(labour.date), "yyyy-MM-dd"),
        labour.milestone,
        labour.labourType,
        `${labour.mainSupervisor.name} - ${labour.mainSupervisor.pay} KSH`,
        labour.fundis
          .map((fundi) => `${fundi.name} - ${fundi.pay} KSH`)
          .join(", "),
        labour.helpers
          .map((helper) => `${helper.name} - ${helper.pay} KSH`)
          .join(", "),
        labour.totalPay.toFixed(2),
      ]),
    });

    // Add the total cost text below the table
    doc.text(
      `Total Labour Cost: ${totalLabourCost.toFixed(2)} KSH`,
      14,
      doc.lastAutoTable.finalY + 10 // Adjust as necessary
    );

    // Save the PDF
    doc.save("Labour_Report.pdf");
  };

  return (
    <div className="view-labour-container" ref={dashboardRef}>
      <h1 className="view-labour-h1">View the available labour</h1>
      <p className="view-labour-p">
        Click
        <Link to={"/supervisor/add-labour"} className="view-labour-link">
          {" "}
          here{" "}
        </Link>
        to add more labour.
      </p>

      <div className="labour-total-cost">
        <h2 className="labour-total-cost-h2">
          Total Labour Cost: {totalLabourCost.toFixed(2)} KSH
        </h2>
      </div>

      <div className="filters">
        <div className="milestone-filter">
          <label htmlFor="milestoneFilter">Filter by Milestone</label>
          <select
            id="milestoneFilter"
            value={filteredMilestone}
            onChange={handleMilestoneFilterChange}
            style={{ width: "140px" }}
          >
            <option value="">All Milestones</option>
            {allMilestones.map((milestone, index) => (
              <option key={index} value={milestone}>
                {milestone}
              </option>
            ))}
          </select>
        </div>

        <div className="milestone-filter">
          <label htmlFor="labourTypeFilter">Filter by Labour Type</label>
          <select
            id="labourTypeFilter"
            value={filteredLabourType}
            onChange={handleLabourTypeFilterChange}
            style={{ width: "140px" }}
          >
            <option value="">All Labour Types</option>
            {Array.from(
              new Set(labours.map((labour) => labour.labourType))
            ).map((labourType, index) => (
              <option key={index} value={labourType}>
                {labourType}
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

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Milestone</th>
              <th>Labour Type</th>
              <th>Main Supervisor</th>
              <th>Fundis [Name - Pay]</th>
              <th>Helpers [Name - Pay]</th>
              <th>Total Pay (KSH)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLabours.map((labour) => (
              <tr key={labour._id}>
                <td>{labour.date}</td>
                <td>{labour.milestone}</td>
                <td>{labour.labourType}</td>
                <td className="labour-info">
                  <div className="flex-container">
                    <span className="name">{labour.mainSupervisor.name}</span>
                    <span className="pay">{labour.mainSupervisor.pay} KSH</span>
                  </div>
                </td>
                <td className="labour-info">
                  {labour.fundis.map((fundi, idx) => (
                    <div key={idx} className="flex-container">
                      <span className="name">{fundi.name}</span>
                      <span className="pay">{fundi.pay} KSH</span>
                    </div>
                  ))}
                </td>
                <td className="labour-info">
                  {labour.helpers.map((helper, idx) => (
                    <div key={idx} className="flex-container">
                      <span className="name">{helper.name}</span>
                      <span className="pay">{helper.pay} KSH</span>
                    </div>
                  ))}
                </td>
                <td>{labour.totalPay.toFixed(2)} KSH</td>
                <td className="edit-delete-btns">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(labour._id)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(labour._id)}
                    className="delete-button"
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
  );
};

export default ViewLabour;
