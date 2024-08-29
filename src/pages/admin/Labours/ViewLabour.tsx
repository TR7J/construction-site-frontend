import React, { useState, useEffect } from "react";
import axios from "../../../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ViewLabour.css";

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
  const [labours, setLabours] = useState<Labour[]>([]);
  const [filteredMilestone, setFilteredMilestone] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLabours = async () => {
      try {
        const { data } = await axios.get("/api/supervisor/labours");
        setLabours(data);
      } catch (error) {
        toast.error("Error fetching labours.");
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

  // Calculate the total cost of all labours
  const totalLabourCost = labours.reduce(
    (acc, labour) => acc + labour.totalPay,
    0
  );

  const filteredLabours = labours.filter((labour) =>
    filteredMilestone ? labour.milestone === filteredMilestone : true
  );

  return (
    <div className="view-labour-container">
      <h1 className="view-labour-h1">View the available labours</h1>
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

      <div className="milestone-filter">
        <label htmlFor="milestoneFilter">Filter by Milestone</label>
        <select
          id="milestoneFilter"
          value={filteredMilestone}
          onChange={handleMilestoneFilterChange}
        >
          <option value="">All Milestones</option>
          <option value="Foundations">Foundations</option>
          <option value="Slab">Slab</option>
          <option value="Wailing">Wailing</option>
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
                    className="action-button"
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
