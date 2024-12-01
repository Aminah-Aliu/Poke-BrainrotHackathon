import React from "react";
import "./about.css"; // Optional: Link to a CSS file for styling

const AboutPage = () => {
  return (
    <div className="page-container">
      <header className="app-header">
        <h1 className="app-title">About Poke</h1>
      </header>
      <div className="app-container">
      <img 
          src="/TeamPoke.png" 
          alt="Alex and Aminah pose for a virtual photo" 
          className="about-page-image" 
        />
        <p>
          This project was made by{" "}
          <a
            href="https://www.linkedin.com/in/aminah-aliu"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1E90FF" }}
          >
            Aminah Aliu
          </a>{" "}
          and{" "}
          <a
            href="https://www.linkedin.com/in/alexander-cholmsky/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1E90FF" }}
          >
            Alexander Cholmsky
          </a>{" "}
          for{" "}
          <a
            href="https://www.linkedin.com/in/audrey-chen-tech/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1E90FF" }}
          >
            Audrey Chen's
          </a>{" "}
          <a
            href="https://brainrot-jia-seed-hackathon.devpost.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1E90FF" }}
          >
            2024 Brainrot Hackathon
          </a>
          . Thanks for stopping by :)
        </p>
        <p>
          Fill out this Google Form to share feedback with the team!
        </p>
        <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc8BPG1bCx73H5G8DYrJOmHCqVdOT6S8tCsrPt9Nm1zBLv6Mg/viewform?embedded=true" width="640" height="1095" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
      </div>
    </div>
  );
};

export default AboutPage;
