import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";

const ViewIssuedMaterials: React.FC = () => {
  const [issuedMaterials, setIssuedMaterials] = useState<any[]>([]);
  const [workerId, setWorkerId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssuedMaterials = async () => {
      try {
        const { data } = await axios.get("/api/supervisor/issued-materials");
        setIssuedMaterials(data);
      } catch (error) {
        console.error("Error fetching issued materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssuedMaterials();
  }, []);

  const handleFetchWorkerMaterials = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/supervisor/issued-materials/${workerId}`
      );
      setIssuedMaterials(data);
    } catch (error) {
      console.error("Error fetching worker materials:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Issued Materials</h2>
      <input
        type="text"
        value={workerId}
        onChange={(e) => setWorkerId(e.target.value)}
        placeholder="Worker ID"
      />
      <button onClick={handleFetchWorkerMaterials} disabled={loading}>
        {loading ? "Fetching..." : "Fetch Worker Materials"}
      </button>
      <ul>
        {loading ? (
          <p>Loading...</p>
        ) : (
          issuedMaterials.map((item) => (
            <li key={item._id}>
              Worker: {item.workerId} - Material: {item.materialId} - Quantity:{" "}
              {item.quantity} - Round: {item.round}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ViewIssuedMaterials;
