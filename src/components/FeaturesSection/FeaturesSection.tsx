import React from "react";
import "./FeaturesSection.css";
import material from "../../assets/images/construction-site1.jpg";
import worker from "../../assets/images/construction-site2.jpg";
import dashboards from "../../assets/images/construction-site3.jpg";

const features = [
  {
    icon: material,
    title: "Material Management",
    description: "Easily track and manage construction materials.",
  },
  {
    icon: worker,
    title: "Worker Management",
    description: "Efficiently manage worker schedules, tasks, and payments.",
  },
  {
    icon: dashboards,
    title: "Dashboards",
    description:
      "Access comprehensive dashboards tailored for admins and supervisors.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <>
      <h1 className="features-h1">Our Main Features</h1>
      <section id="features" className="features">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="card">
              {/* <img src={feature.icon} alt="Feature" /> */}
              <div className="card-content">
                <div className="category">{feature.title}</div>
                <div className="title">{feature.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default FeaturesSection;
