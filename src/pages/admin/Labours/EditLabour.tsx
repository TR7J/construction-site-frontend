import React, { useState, useEffect } from "react";
import axios from "../../../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./EditLabour.css";

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

const EditLabour: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [labour, setLabour] = useState<Labour | null>(null);
  const [formState, setFormState] = useState<Labour | null>(null);
  const [customMilestone, setCustomMilestone] = useState<string>(""); // State for custom milestone
  const [useCustomMilestone, setUseCustomMilestone] = useState<boolean>(false); // Toggle between custom and pre-defined milestone

  useEffect(() => {
    const fetchLabour = async () => {
      try {
        const { data } = await axios.get(`/api/supervisor/labour/${id}`);
        setLabour(data);
        setFormState(data);
      } catch (error) {
        console.error("Error fetching labour:", error);
        toast.error("Failed to load labour details.");
      }
    };
    fetchLabour();
  }, [id]);

  const updateTotals = (updatedFormState: Labour) => {
    const totalFundisPay = updatedFormState.fundis.reduce(
      (acc, fundi) => acc + fundi.pay,
      0
    );
    const totalHelpersPay = updatedFormState.helpers.reduce(
      (acc, helper) => acc + helper.pay,
      0
    );
    const totalPay =
      updatedFormState.mainSupervisor.pay + totalFundisPay + totalHelpersPay;

    setFormState({
      ...updatedFormState,
      totalFundisPay,
      totalHelpersPay,
      totalPay,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number,
    type?: "fundis" | "helpers"
  ) => {
    if (formState) {
      const { name, value } = e.target;
      let updatedFormState = { ...formState };

      if (type && index !== undefined) {
        updatedFormState = {
          ...formState,
          [type]: formState[type]?.map((item, i) =>
            i === index
              ? {
                  ...item,
                  [name]:
                    value === ""
                      ? item[name as keyof typeof item]
                      : parseFloat(value) || 0,
                }
              : item
          ),
        };
      } else if (name in formState.mainSupervisor) {
        updatedFormState = {
          ...formState,
          mainSupervisor: {
            ...formState.mainSupervisor,
            [name]:
              value === ""
                ? formState.mainSupervisor[
                    name as keyof typeof formState.mainSupervisor
                  ]
                : parseFloat(value) || 0,
          },
        };
      } else {
        updatedFormState = {
          ...formState,
          [name]: value,
        };
      }

      updateTotals(updatedFormState);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (formState) {
      const { name, value } = e.target;
      setFormState({
        ...formState,
        [name]: value,
      });
    }
  };

  const handleCustomMilestoneToggle = () => {
    setUseCustomMilestone(!useCustomMilestone);
    if (useCustomMilestone) {
      setCustomMilestone("");
    }
  };

  const handleCustomMilestoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomMilestone(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState) {
      try {
        const updatedLabour = {
          ...formState,
          milestone: useCustomMilestone ? customMilestone : formState.milestone,
        };
        await axios.put(`/api/supervisor/labour/${id}`, updatedLabour);
        toast.success("Labour details updated successfully.");
        navigate("/supervisor/view-labour");
      } catch (error) {
        console.error("Error updating labour:", error);
        toast.error("Failed to update labour details.");
      }
    }
  };

  const addFundi = () => {
    if (formState) {
      setFormState({
        ...formState,
        fundis: [...(formState.fundis || []), { name: "", pay: 0 }],
      });
    }
  };

  const removeFundi = (index: number) => {
    if (formState) {
      setFormState({
        ...formState,
        fundis: formState.fundis?.filter((_, i) => i !== index) || [],
      });
      updateTotals(formState);
    }
  };

  const addHelper = () => {
    if (formState) {
      setFormState({
        ...formState,
        helpers: [...(formState.helpers || []), { name: "", pay: 0 }],
      });
    }
  };

  const removeHelper = (index: number) => {
    if (formState) {
      setFormState({
        ...formState,
        helpers: formState.helpers?.filter((_, i) => i !== index) || [],
      });
      updateTotals(formState);
    }
  };

  if (!formState) return <p>Loading...</p>;

  return (
    <div className="edit-labour-container">
      <h1 className="edit-labour-heading">Edit Labour</h1>
      <form className="edit-labour-form" onSubmit={handleSubmit}>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formState.date}
            onChange={(e) => handleInputChange(e)}
          />
        </label>

        {/* Milestone Section */}
        <label>
          Milestone:
          <select
            name="milestone"
            value={formState.milestone}
            onChange={handleSelectChange}
            disabled={useCustomMilestone} // Disable select if using custom milestone
          >
            <option value="Foundations">Foundations</option>
            <option value="Slab">Slab</option>
            <option value="Wailing">Wailing</option>
            <option value="Rinto">Rinto</option>
            <option value="Roofing">Roofing</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical works">Electrical works</option>
            <option value="Ceiling">Ceiling</option>
            <option value="Pluster">Pluster</option>
            <option value="Tiling">Tiling</option>
            <option value="Fittings">Fittings</option>
            <option value="Doors">Doors</option>
            <option value="Windows">Windows</option>
          </select>
        </label>

        {/* Custom Milestone */}
        <label>
          Use Custom Milestone:
          <input
            type="checkbox"
            checked={useCustomMilestone}
            onChange={handleCustomMilestoneToggle}
          />
        </label>

        {useCustomMilestone && (
          <label>
            Custom Milestone:
            <input
              type="text"
              value={customMilestone}
              onChange={handleCustomMilestoneChange}
            />
          </label>
        )}

        {/* Labour Type */}
        <label>
          Labour Type:
          <select
            name="labourType"
            value={formState.labourType}
            onChange={handleSelectChange}
          >
            {/* Populate with the predefined labour types */}
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
        </label>

        {/* Supervisor */}
        <h3>Supervisor</h3>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formState.mainSupervisor.name}
            onChange={(e) => handleInputChange(e)}
          />
        </label>
        <label>
          Pay:
          <input
            type="number"
            name="pay"
            value={formState.mainSupervisor.pay}
            onChange={(e) => handleInputChange(e)}
          />
        </label>

        {/* Fundis */}
        <h3>Fundis</h3>
        {formState.fundis?.map((fundi, index) => (
          <div key={index} className="fundi-inputs">
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={fundi.name}
                onChange={(e) => handleInputChange(e, index, "fundis")}
              />
            </label>
            <label>
              Pay:
              <input
                type="number"
                name="pay"
                value={fundi.pay}
                onChange={(e) => handleInputChange(e, index, "fundis")}
              />
            </label>
            <button type="button" onClick={() => removeFundi(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addFundi}>
          Add Fundi
        </button>

        {/* Helpers */}
        <h3>Helpers</h3>
        {formState.helpers?.map((helper, index) => (
          <div key={index} className="helper-inputs">
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={helper.name}
                onChange={(e) => handleInputChange(e, index, "helpers")}
              />
            </label>
            <label>
              Pay:
              <input
                type="number"
                name="pay"
                value={helper.pay}
                onChange={(e) => handleInputChange(e, index, "helpers")}
              />
            </label>
            <button type="button" onClick={() => removeHelper(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addHelper}>
          Add Helper
        </button>

        <h3>Total Payments</h3>
        <p>Total Fundis Pay: {formState.totalFundisPay}</p>
        <p>Total Helpers Pay: {formState.totalHelpersPay}</p>
        <p>Total Pay: {formState.totalPay}</p>

        <button type="submit">Update Labour</button>
      </form>
    </div>
  );
};

export default EditLabour;
