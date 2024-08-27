import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";

const RecordRemainingMaterials: React.FC = () => {
  const [remainingMaterials, setRemainingMaterials] = useState<any[]>([]);
  const [materialId, setMaterialId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRemainingMaterials = async () => {
      try {
        const { data } = await axios.get("/api/supervisor/remaining-materials");
        setRemainingMaterials(data);
      } catch (error) {
        console.error("Error fetching remaining materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRemainingMaterials();
  }, []);

  const handleRecordRemainingMaterials = async () => {
    setLoading(true);
    try {
      await axios.post("/api/supervisor/remaining-materials", {
        materialId,
        quantity,
      });
      setMaterialId("");
      setQuantity(0);
      const { data } = await axios.get("/api/supervisor/remaining-materials");
      setRemainingMaterials(data);
    } catch (error) {
      console.error("Error recording remaining materials:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Record Remaining Materials</h2>
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
      <button onClick={handleRecordRemainingMaterials} disabled={loading}>
        {loading ? "Processing..." : "Record Remaining Materials"}
      </button>
      <ul>
        {loading ? (
          <p>Loading...</p>
        ) : (
          remainingMaterials.map((item) => (
            <li key={item._id}>
              Material: {item.materialId} - Quantity: {item.quantity}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RecordRemainingMaterials;
