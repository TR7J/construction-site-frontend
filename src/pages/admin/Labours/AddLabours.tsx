import React, { useState } from "react";
import axios from "../../../axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AddLabour.css";

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

const AddLabour: React.FC = () => {
  const [labour, setLabour] = useState<Labour>({
    date: new Date().toISOString().split("T")[0], // Default to today's date
    milestone: "Foundations",
    labourType: "Setting up ground",
    mainSupervisor: { name: "", pay: 0 },
    fundis: [{ name: "", pay: 0 }],
    helpers: [{ name: "", pay: 0 }],
    totalFundisPay: 0,
    totalHelpersPay: 0,
    totalPay: 0,
  });

  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // State to prevent resubmission
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLabour((prev) => ({
      ...prev,
      [name]: value,
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

    try {
      await axios.post("/api/supervisor/labour", labour);
      setMessage(
        `Labour for milestone ${labour.milestone} added successfully!`
      );
      toast.success(
        `Labour for milestone ${labour.milestone} added successfully!`
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
            <option value="Wailing">Wailing</option>
            <option value="Rinto">Rinto</option>
            <option value="Roofing">Roofing</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="labourType">Labour Type</label>
          <select
            id="labourType"
            name="labourType"
            value={labour.labourType}
            onChange={handleChange}
            className="input-labour"
            required
          >
            <option value="Setting up ground">Setting up ground</option>
            <option value="Foundation Digging">Foundation Digging</option>
            <option value="Back Filling">Back Filling</option>
            <option value="Koroga">Koroga</option>
            <option value="Rinto">Rinto</option>
            <option value="Screeding">Screeding</option>
            <option value="Walling">Walling</option>
            <option value="Stone dressing">Stone dressing</option>
            <option value="Vibrator">Vibrator</option>
            <option value="Compactor">Compactor</option>
            <option value="Plumbing">Plumbing</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="supervisorName">Main Supervisor Name</label>
          <input
            type="text"
            id="supervisorName"
            name="name"
            value={labour.mainSupervisor.name}
            onChange={handleSupervisorChange}
            className="input-labour"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="supervisorPay">Main Supervisor Pay (KSH)</label>
          <input
            type="number"
            id="supervisorPay"
            name="pay"
            value={labour.mainSupervisor.pay}
            onChange={handleSupervisorChange}
            className="input-labour"
            required
          />
        </div>

        <div className="form-group">
          <h3>Fundis</h3>
          {labour.fundis.map((fundi, index) => (
            <div key={index} className="fundi-group">
              <label htmlFor={`fundiName-${index}`}>Fundi Name</label>
              <input
                type="text"
                id={`fundiName-${index}`}
                name="name"
                value={fundi.name}
                onChange={(e) => handleFundisChange(index, e)}
                className="input-labour"
                required
              />
              <label htmlFor={`fundiPay-${index}`}>Fundi Pay (KSH)</label>
              <input
                type="number"
                id={`fundiPay-${index}`}
                name="pay"
                value={fundi.pay}
                onChange={(e) => handleFundisChange(index, e)}
                className="input-labour"
                required
              />
              <button
                type="button"
                onClick={() => removeFundiField(index)}
                className="remove-btn"
              >
                Remove Fundi
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFundiField}
            className="add-more-btn"
          >
            Add Fundi
          </button>
        </div>

        <div className="form-group">
          <h3>Helpers</h3>
          {labour.helpers.map((helper, index) => (
            <div key={index} className="helper-group">
              <label htmlFor={`helperName-${index}`}>Helper Name</label>
              <input
                type="text"
                id={`helperName-${index}`}
                name="name"
                value={helper.name}
                onChange={(e) => handleHelpersChange(index, e)}
                className="input-labour"
                required
              />
              <label htmlFor={`helperPay-${index}`}>Helper Pay (KSH)</label>
              <input
                type="number"
                id={`helperPay-${index}`}
                name="pay"
                value={helper.pay}
                onChange={(e) => handleHelpersChange(index, e)}
                className="input-labour"
                required
              />
              <button
                type="button"
                onClick={() => removeHelperField(index)}
                className="remove-btn"
              >
                Remove Helper
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addHelperField}
            className="add-more-btn"
          >
            Add Helper
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="totalPay">Total Pay (KSH)</label>
          <input
            type="number"
            id="totalPay"
            name="totalPay"
            value={labour.totalPay}
            readOnly
            className="input-labour"
          />
        </div>

        {message && <div className="message">{message}</div>}

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddLabour;
