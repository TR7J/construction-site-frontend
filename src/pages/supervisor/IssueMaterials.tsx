import React, { useState } from "react";
import axios from "../../axiosConfig";

const IssueMaterials: React.FC = () => {
  const [workerId, setWorkerId] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [round, setRound] = useState(1); // Default round
  const [loading, setLoading] = useState(false);

  const handleIssueMaterials = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/supervisor/issue-materials/${round}`, {
        workerId,
        materialId,
        quantity,
      });
      setWorkerId("");
      setMaterialId("");
      setQuantity(0);
    } catch (error) {
      console.error("Error issuing materials:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Issue Materials</h2>
      <input
        type="text"
        value={workerId}
        onChange={(e) => setWorkerId(e.target.value)}
        placeholder="Worker ID"
      />
      <input
        type="text"
        value={materialId}
        onChange={(e) => setMaterialId(e.target.value)}
        placeholder="Material ID"
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        placeholder="Quantity"
      />
      <input
        type="number"
        value={round}
        onChange={(e) => setRound(Number(e.target.value))}
        placeholder="Round"
      />
      <button onClick={handleIssueMaterials} disabled={loading}>
        {loading ? "Processing..." : "Issue Materials"}
      </button>
    </div>
  );
};

export default IssueMaterials;
