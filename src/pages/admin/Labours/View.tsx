import React, { useState, useEffect } from "react";
import axios from "../../../axiosConfig";
import "./ViewLabour.css";

interface Labour {
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
  const [labours, setLabours] = useState<Labour[]>([]);
  const [filteredMilestone, setFilteredMilestone] = useState<string>("");

  useEffect(() => {
    const fetchLabours = async () => {
      try {
        const { data } = await axios.get("/api/supervisor/labours");
        setLabours(data);
      } catch (error) {
        console.error("Error fetching labours:", error);
      }
    };
    fetchLabours();
  }, []);

  const handleMilestoneFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilteredMilestone(e.target.value);
  };

  const filteredLabours = labours.filter((labour) =>
    filteredMilestone ? labour.milestone === filteredMilestone : true
  );

  return (
    <div className="labour-view">
      <h2 className="labour-view-h2">View Labours</h2>

      <div className="filter-container">
        <label htmlFor="milestoneFilter">Filter by Milestone</label>
        <select
          id="milestoneFilter"
          value={filteredMilestone}
          onChange={handleMilestoneFilterChange}
          className="input-labour"
        >
          <option value="">All Milestones</option>
          <option value="Foundations">Foundations</option>
          <option value="Slab">Slab</option>
          <option value="Wailing">Wailing</option>
          <option value="Rinto">Rinto</option>
          <option value="Roofing">Roofing</option>
        </select>
      </div>

      <table className="labour-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Milestone</th>
            <th>Labour Type</th>
            <th>Main Supervisor</th>
            <th>Fundis</th>
            <th>Helpers</th>
            <th>Total Pay (KSH)</th>
          </tr>
        </thead>
        <tbody>
          {filteredLabours.map((labour, index) => (
            <tr key={index}>
              <td>{labour.date}</td>
              <td>{labour.milestone}</td>
              <td>{labour.labourType}</td>
              <td>
                {labour.mainSupervisor.name} ({labour.mainSupervisor.pay})
              </td>
              <td>
                {labour.fundis.map((fundi, idx) => (
                  <div key={idx}>
                    {fundi.name} ({fundi.pay})
                  </div>
                ))}
              </td>
              <td>
                {labour.helpers.map((helper, idx) => (
                  <div key={idx}>
                    {helper.name} ({helper.pay})
                  </div>
                ))}
              </td>
              <td>{labour.totalPay.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewLabour;
