import React, { useEffect, useState } from "react";
import axios from "../../../axiosConfig";
import "./AdminDashboard.css";

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
  const [materialTotalCost, setMaterialTotalCost] = useState<number>(0);
  const [labourTotalCost, setLabourTotalCost] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<string>("All");

  useEffect(() => {
    const fetchMaterialsAndLabour = async () => {
      try {
        const [materialsResponse, labourResponse] = await Promise.all([
          axios.get("/api/supervisor/materials"),
          axios.get("/api/supervisor/labours"),
        ]);

        const materialsData = materialsResponse.data;
        const labourData = labourResponse.data; // Ensure this is an array

        setMaterials(materialsData);
        setLabour(labourData);

        // Calculate total costs for materials
        const filteredMaterials =
          selectedMilestone === "All"
            ? materialsData
            : materialsData.filter(
                (material: Material) => material.milestone === selectedMilestone
              );

        const calculatedMaterialTotalCost = filteredMaterials.reduce(
          (acc: number, material: Material) => acc + material.totalPrice,
          0
        );
        setMaterialTotalCost(calculatedMaterialTotalCost);

        // Calculate total costs for labour
        if (Array.isArray(labourData)) {
          const filteredLabour =
            selectedMilestone === "All"
              ? labourData
              : labourData.filter(
                  (labour: Labour) => labour.milestone === selectedMilestone
                );

          const calculatedLabourTotalCost = filteredLabour.reduce(
            (acc: number, labour: Labour) => acc + labour.totalPay,
            0
          );
          setLabourTotalCost(calculatedLabourTotalCost);
        } else {
          console.error("Labour data is not an array:", labourData);
          setError("Labour data format is incorrect");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialsAndLabour();
  }, [selectedMilestone]);

  useEffect(() => {
    // Update the total cost when materialTotalCost or labourTotalCost changes
    setTotalCost(materialTotalCost + labourTotalCost);
  }, [materialTotalCost, labourTotalCost]);

  const handleMilestoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMilestone(e.target.value);
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  // Filter materials and labour based on selected milestone
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

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-cost">
        <h1>Admin Dashboard</h1>
        <div className="total-project-cost">
          <h2>Total Project Cost: {totalCost.toFixed(2)} KSH</h2>
        </div>
      </div>
      <p>
        Welcome to the admin dashboard. Manage materials, tools, and view
        workers here.
      </p>

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

      <div className="materials-summary">
        <h2 className="admin-dashboard-h2">Materials Summary</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Total Quantity</th>
                <th>Total Value (KSH)</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((material) => (
                <tr key={material._id}>
                  <td>{material.name}</td>
                  <td>{material.quantity}</td>
                  <td>{material.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="total-cost">
        <h2 className="admin-dashboard-h2">Total Costs Of Materials</h2>
        <p className="total-cost">
          You have spent a total of{" "}
          <span className="total-cost-span">
            {materialTotalCost.toFixed(2)} KSH
          </span>{" "}
          on materials
          {selectedMilestone !== "All" ? ` for ${selectedMilestone}` : ""}.
        </p>
      </div>

      <div className="labour-summary">
        <h2 className="admin-dashboard-h2">Labour Summary</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Milestone</th>
                <th>Total Payment (KSH)</th>
              </tr>
            </thead>
            <tbody>
              {filteredLabour.map((labour) => (
                <tr key={labour._id}>
                  <td>{labour.date}</td>
                  <td>{labour.milestone}</td>
                  <td>{labour.totalPay.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="total-labour-cost">
        <h2 className="admin-dashboard-h2">Total Costs Of Labour</h2>
        <p className="total-cost">
          You have spent a total of{" "}
          <span className="total-cost-span">
            {labourTotalCost.toFixed(2)} KSH
          </span>{" "}
          on labour
          {selectedMilestone !== "All" ? ` for ${selectedMilestone}` : ""}.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
