import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface ProjectContextType {
  projectId: string | null;
  projectName: string | null;
  setProjectId: (projectId: string | null) => void;
  setProjectName: (projectName: string | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);

  // Load the projectId and projectName from localStorage when the component mounts
  useEffect(() => {
    const storedProjectId = localStorage.getItem("selectedProjectId");
    const storedProjectName = localStorage.getItem("selectedProjectName");

    if (storedProjectId) {
      setProjectId(storedProjectId);
    }
    if (storedProjectName) {
      setProjectName(storedProjectName);
    }
  }, []);

  // Save the projectId and projectName to localStorage whenever they change
  useEffect(() => {
    if (projectId) {
      localStorage.setItem("selectedProjectId", projectId);
    }
    if (projectName) {
      localStorage.setItem("selectedProjectName", projectName);
    }
  }, [projectId, projectName]);

  return (
    <ProjectContext.Provider
      value={{ projectId, projectName, setProjectId, setProjectName }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
