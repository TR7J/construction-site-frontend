import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";

const ManageMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [materialName, setMaterialName] = useState("");
  const [materialQuantity, setMaterialQuantity] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const { data } = await axios.get("/api/supervisor/materials");
        setMaterials(data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const handleAddOrUpdateMaterial = async () => {
    setLoading(true);
    try {
      await axios.post("/api/supervisor/materials", {
        name: materialName,
        quantity: materialQuantity,
      });
      setMaterialName("");
      setMaterialQuantity(0);
      const { data } = await axios.get("/api/supervisor/materials");
      setMaterials(data);
    } catch (error) {
      console.error("Error adding or updating material:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Manage Materials</h2>
      <input
        type="text"
        value={materialName}
        onChange={(e) => setMaterialName(e.target.value)}
        placeholder="Material Name"
      />
      <input
        type="number"
        value={materialQuantity}
        onChange={(e) => setMaterialQuantity(Number(e.target.value))}
        placeholder="Material Quantity"
      />
      <button onClick={handleAddOrUpdateMaterial} disabled={loading}>
        {loading ? "Processing..." : "Add/Update Material"}
      </button>
      <ul>
        {loading ? (
          <p>Loading...</p>
        ) : (
          materials.map((material) => (
            <li key={material._id}>
              {material.name} - {material.quantity}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ManageMaterials;
