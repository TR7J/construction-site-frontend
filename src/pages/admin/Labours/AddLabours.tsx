import React, { useState } from "react";
import axios from "../../../axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AddLabour.css";
import { useProject } from "../../../context/ProjectContext";

interface Labour {
  date: string;
  milestone: string;
  customMilestone?: string;
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

const AddLabour: React.FC = () => {
  const [labour, setLabour] = useState<Labour>({
    date: new Date().toISOString().split("T")[0], // Default to today's date
    milestone: "Foundations", // Default to Foundations
    labourType: "Setting up ground",
    mainSupervisor: { name: "", pay: 0 },
    fundis: [{ name: "", pay: 0 }],
    helpers: [{ name: "", pay: 0 }],
    totalFundisPay: 0,
    totalHelpersPay: 0,
    totalPay: 0,
  });

  const [useCustomMilestone, setUseCustomMilestone] = useState<boolean>(false); // Toggle for custom milestone
  const [customMilestone, setCustomMilestone] = useState<string>(""); // State for custom milestone
  const [useCustomLabourType, setUseCustomLabourType] =
    useState<boolean>(false); // Toggle for custom labour type
  const [customLabourType, setCustomLabourType] = useState<string>(""); // State for custom labour type
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent resubmission
  const navigate = useNavigate();
  const { projectId } = useProject();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLabour((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomMilestoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomMilestone(e.target.value);
    setLabour((prev) => ({
      ...prev,
      milestone: e.target.value, // Update milestone with custom value
    }));
  };

  const handleCustomLabourTypeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomLabourType(e.target.value);
    setLabour((prev) => ({
      ...prev,
      labourType: e.target.value,
    }));
  };

  const handleSupervisorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLabour((prev) => ({
      ...prev,
      mainSupervisor: {
        ...prev.mainSupervisor,
        [name]: value,
      },
      totalPay: Number(value) + prev.totalFundisPay + prev.totalHelpersPay,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLabour((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFundisChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedFundis = [...labour.fundis];

    if (name === "name") {
      updatedFundis[index].name = value;
    } else if (name === "pay") {
      updatedFundis[index].pay = parseFloat(value); // Assuming 'pay' is a number
    }

    const totalFundisPay = updatedFundis.reduce(
      (acc, fundi) => acc + fundi.pay,
      0
    );

    setLabour((prev) => ({
      ...prev,
      fundis: updatedFundis,
      totalFundisPay,
      totalPay:
        Number(prev.mainSupervisor.pay) + totalFundisPay + prev.totalHelpersPay,
    }));
  };

  const handleHelpersChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedHelpers = [...labour.helpers];

    if (name === "pay") {
      updatedHelpers[index][name as "pay"] = parseFloat(value);
    } else {
      updatedHelpers[index][name as "name"] = value;
    }

    const totalHelpersPay = updatedHelpers.reduce(
      (acc, helper) => acc + helper.pay,
      0
    );

    setLabour((prev) => ({
      ...prev,
      helpers: updatedHelpers,
      totalHelpersPay,
      totalPay:
        Number(prev.mainSupervisor.pay) + prev.totalFundisPay + totalHelpersPay,
    }));
  };

  const addFundiField = () => {
    setLabour((prev) => ({
      ...prev,
      fundis: [...prev.fundis, { name: "", pay: 0 }],
    }));
  };

  const addHelperField = () => {
    setLabour((prev) => ({
      ...prev,
      helpers: [...prev.helpers, { name: "", pay: 0 }],
    }));
  };

  const removeFundiField = (index: number) => {
    const updatedFundis = labour.fundis.filter((_, i) => i !== index);
    const totalFundisPay = updatedFundis.reduce(
      (acc, fundi) => acc + fundi.pay,
      0
    );

    setLabour((prev) => ({
      ...prev,
      fundis: updatedFundis,
      totalFundisPay,
      totalPay:
        Number(prev.mainSupervisor.pay) + totalFundisPay + prev.totalHelpersPay,
    }));
  };

  const removeHelperField = (index: number) => {
    const updatedHelpers = labour.helpers.filter((_, i) => i !== index);
    const totalHelpersPay = updatedHelpers.reduce(
      (acc, helper) => acc + helper.pay,
      0
    );

    setLabour((prev) => ({
      ...prev,
      helpers: updatedHelpers,
      totalHelpersPay,
      totalPay:
        Number(prev.mainSupervisor.pay) + prev.totalFundisPay + totalHelpersPay,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent resubmission if already submitting

    setIsSubmitting(true);

    // Set the correct milestone based on whether custom milestone is used
    const labourToSubmit = {
      ...labour,
      milestone: useCustomMilestone ? customMilestone : labour.milestone, // Correct milestone value
    };

    try {
      await axios.post(`/api/supervisor/labour/${projectId}`, labourToSubmit);
      setMessage(
        `Labour for milestone ${
          useCustomMilestone ? customMilestone : labour.milestone
        } added successfully!`
      );
      toast.success(
        `Labour for milestone ${
          useCustomMilestone ? customMilestone : labour.milestone
        } added successfully!`
      );
      navigate("/supervisor/view-labour");
    } catch (error: any) {
      setMessage(`Error adding labour: ${error.message}`);
      toast.error(`Error adding labour: ${error.message}`);
    } finally {
      setIsSubmitting(false); // Allow resubmission after request is complete
    }
  };

  return (
    <div className="labour-management">
      <h2 className="labour-management-h2">Manage Labour</h2>
      <form className="labour-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={labour.date}
            onChange={handleChange}
            className="input-labour"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="milestone">Milestone</label>
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
              value={labour.milestone}
              onChange={handleChange}
              className="input-labour"
              required
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
              <option value="Finishing">Finishing</option>
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
              placeholder="Enter custom milestone"
              className="input-labour"
              required
            />
          )}
        </div>
        {/*         {/* Labour Type 
        <label>
          Labour Type:
          <select
            name="labourType"
            value={labour.labourType}
            onChange={handleSelectChange}
            className="input-labour"
          >
            {/* Populate with the predefined labour types 
            <option value="Setting up ground">Setting up ground</option>
            <option value="Foundation Digging">Foundation Digging</option>
            <option value="Back Filling">Back Filling</option>
            <option value="Koroga">Koroga</option>
            <option value="Rinto">Rinto</option>
            <option value="Screeding">Screeding</option>
            <option value="Foundations">Foundations</option>
            <option value="Slab">Slab</option>
            <option value="Walling">Walling</option>
            <option value="Roofing">Roofing</option>
            <option value="Tiling">Tiling</option>
          </select>
        </label> */}

        {/* Labour Type Section */}
        <div className="form-group">
          <label htmlFor="labourType">Labour Type</label>
          <div>
            <label>
              <input
                type="radio"
                name="labourTypeOption"
                checked={!useCustomLabourType}
                onChange={() => setUseCustomLabourType(false)}
              />
              Select from options
            </label>
            <label>
              <input
                type="radio"
                name="labourTypeOption"
                checked={useCustomLabourType}
                onChange={() => setUseCustomLabourType(true)}
              />
              Enter custom labour type
            </label>
          </div>
          {!useCustomLabourType ? (
            <select
              id="labourType"
              name="labourType"
              value={labour.labourType}
              onChange={handleSelectChange}
              className="input-labour"
            >
              <option value="Setting up ground">Setting up ground</option>
              <option value="Foundation Digging">Foundation Digging</option>
              <option value="Back Filling">Back Filling</option>
              <option value="Koroga">Koroga</option>
              <option value="Rinto">Rinto</option>
              <option value="Finishing">Finishing</option>
              <option value="Plastering">Plastering</option>
              <option value="Screeding">Screeding</option>
              <option value="Foundations">Foundations</option>
              <option value="Slab">Slab</option>
              <option value="Walling">Walling</option>
              <option value="Roofing">Roofing</option>
              <option value="Tiling">Tiling</option>
            </select>
          ) : (
            <input
              type="text"
              id="customLabourType"
              value={customLabourType}
              onChange={handleCustomLabourTypeChange}
              className="input-labour"
              placeholder="Enter custom labour type"
            />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="mainSupervisor.name">Main Supervisor</label>
          <input
            type="text"
            id="mainSupervisor.name"
            name="name"
            value={labour.mainSupervisor.name}
            onChange={handleSupervisorChange}
            placeholder="Enter main supervisor name"
            className="input-labour"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="mainSupervisor.pay">Supervisor Pay</label>
          <input
            type="number"
            id="mainSupervisor.pay"
            name="pay"
            value={labour.mainSupervisor.pay}
            onChange={handleSupervisorChange}
            placeholder="Enter supervisor pay"
            className="input-labour"
            required
          />
        </div>
        <div className="form-group">
          <label>Fundis</label>
          {labour.fundis.map((fundi, index) => (
            <div key={index} className="fundi-inputs">
              <input
                type="text"
                name="name"
                placeholder={`Fundi ${index + 1} name`}
                value={fundi.name}
                onChange={(e) => handleFundisChange(index, e)}
                className="input-labour"
                required
              />
              <input
                type="number"
                name="pay"
                placeholder="Pay"
                value={fundi.pay}
                onChange={(e) => handleFundisChange(index, e)}
                className="input-labour"
                required
              />
              <button
                type="button"
                onClick={() => removeFundiField(index)}
                className="remove-field-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFundiField}
            className="add-field-btn"
          >
            Add Fundi
          </button>
        </div>
        <div className="form-group">
          <label>Helpers</label>
          {labour.helpers.map((helper, index) => (
            <div key={index} className="helper-inputs">
              <input
                type="text"
                name="name"
                placeholder={`Helper ${index + 1} name`}
                value={helper.name}
                onChange={(e) => handleHelpersChange(index, e)}
                className="input-labour"
                required
              />
              <input
                type="number"
                name="pay"
                placeholder="Pay"
                value={helper.pay}
                onChange={(e) => handleHelpersChange(index, e)}
                className="input-labour"
                required
              />
              <button
                type="button"
                onClick={() => removeHelperField(index)}
                className="remove-field-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addHelperField}
            className="add-field-btn"
          >
            Add Helper
          </button>
        </div>
        <div className="form-group">
          <label>Total Pay</label>
          <input
            type="number"
            name="totalPay"
            value={labour.totalPay}
            readOnly
            className="input-labour"
          />
        </div>
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default AddLabour;
