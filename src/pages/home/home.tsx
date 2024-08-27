import React from "react";
import HeroSection from "../../components/HeroSection/HeroSection";
import FeaturesSection from "../../components/FeaturesSection/FeaturesSection";
import TestimonialsSection from "../../components/TestimonialsSection/TestimonialsSection";
import Footer from "../../components/Footer/Footer";

const home: React.FC = () => {
  return (
    <div>
      <div>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <Footer />
      </div>
    </div>
  );
};

export default home;
