import React from "react";
import "./TestimonialsSection.css";
import person1 from "../../assets/images/person1.jpg";
/* import person2 from "../../assets/images/person2.jpg";
import person3 from "../../assets/images/person3.jpg";
 */
const testimonials = [
  {
    photo: person1,
    name: "Caroline Makena",
    title: "Project Manager",
    quote:
      "The app has revolutionized the way we manage our construction projects. I Highly recommend it!",
  },
  /*   {
    photo: person2,
    name: "John Smith",
    title: "Construction Supervisor",
    quote:
      "An invaluable tool for managing materials and managing workers. A must-have for any construction site.",
  },
  {
    photo: person3,
    name: "Oscar Jo",
    title: "Worker",
    quote:
      "The app has enabled me to view and receive my due payments according to the work I have done.",
  }, */
];

const TestimonialsSection: React.FC = () => {
  return (
    <>
      <h1 className="testimonials-h1">Testimonials From Our Users</h1>
      <section className="testimonials">
        <div className="testimonials-carousel">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <img
                src={testimonial.photo}
                alt={testimonial.name}
                className="testimonial-photo"
              />
              <h4 className="testimonial-name">{testimonial.name}</h4>
              <p className="testimonial-title">{testimonial.title}</p>
              <p className="testimonial-quote">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default TestimonialsSection;
