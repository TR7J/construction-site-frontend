import { Link } from "react-router-dom";
import constructionSiteImage from "../../assets/images/construction-site1.jpg";
import "./HeroSection.css";

export default function Featured() {
  return (
    <div
      className="featured"
      /*  style={{ backgroundImage: `url(${constructionSiteImage})` }} */
    >
      <div className="featured-center">
        <div className="featured-columns-wrapper">
          <div className="column">
            <div className="featured-title-desc-btns">
              <h1 className="featured-title">Construction Manager</h1>
              <p className="featured-desc">
                Manage materials, workers, and projects efficiently by utilising
                our construction site management app, streamlining day to day
                activites in the construction site.
              </p>
              <div className="featured-buttons-wrapper">
                <Link to={`/login`} className="button-link outline white">
                  Get Started
                </Link>

                <Link to={"/search"} className="button white">
                  Learn More
                </Link>
              </div>

              <p className="featured-desc2">App is Available on all devices.</p>
            </div>
          </div>
          {/*           <div className="featured-image">
            <img src="/images/house-transparent.png" alt="house" />
          </div> */}
        </div>
      </div>
    </div>
  );
}
