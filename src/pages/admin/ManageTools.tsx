import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";

const ManageTools: React.FC = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [toolName, setToolName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const { data } = await axios.get("/api/admin/tools");
        setTools(data);
      } catch (error) {
        console.error("Error fetching tools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const handleAddTool = async () => {
    setLoading(true);
    try {
      await axios.post("/api/admin/tools", { name: toolName });
      setToolName("");
      const { data } = await axios.get("/api/admin/tools");
      setTools(data);
    } catch (error) {
      console.error("Error adding tool:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Manage Tools</h2>
      <input
        type="text"
        value={toolName}
        onChange={(e) => setToolName(e.target.value)}
        placeholder="Tool Name"
      />
      <button onClick={handleAddTool} disabled={loading}>
        {loading ? "Processing..." : "Add Tool"}
      </button>
      <ul>
        {loading ? (
          <p>Loading...</p>
        ) : (
          tools.map((tool) => <li key={tool._id}>{tool.name}</li>)
        )}
      </ul>
    </div>
  );
};

export default ManageTools;
