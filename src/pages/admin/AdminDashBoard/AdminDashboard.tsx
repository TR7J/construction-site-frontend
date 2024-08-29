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
  }, []);

  const handleMilestoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMilestone(e.target.value);
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const milestones = [
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
          {milestones.map((milestone) => (
            <option key={milestone} value={milestone}>
              {milestone}
            </option>
          ))}
        </select>
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
              {milestones.map((milestone) => {
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
            {filteredMaterials
              .reduce((acc, material) => acc + material.totalPrice, 0)
              .toFixed(2)}{" "}
            KSH
          </span>
          {selectedMilestone !== "All" && ` for ${selectedMilestone}`}
        </p>
        <p className="total-cost">
          Total Labour Cost:{" "}
          <span className="total-cost-span">
            {filteredLabour
              .reduce((acc, labour) => acc + labour.totalPay, 0)
              .toFixed(2)}{" "}
            KSH
          </span>
          {selectedMilestone !== "All" && ` for ${selectedMilestone}`}
        </p>
        <p className="total-cost">
          Total Combined Cost:{" "}
          <span className="total-cost-span">
            {(
              filteredMaterials.reduce(
                (acc, material) => acc + material.totalPrice,
                0
              ) +
              filteredLabour.reduce((acc, labour) => acc + labour.totalPay, 0)
            ).toFixed(2)}{" "}
            KSH
          </span>
          {selectedMilestone !== "All" && ` for ${selectedMilestone}`}
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;