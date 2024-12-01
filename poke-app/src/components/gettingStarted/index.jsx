import React from "react";
import "./gettingStarted.css"; // Import the CSS file, repurposing your existing home page CSS.

const GettingStarted = () => {
  return (
    <div className="page-container">
      <header className="app-header">
        <h1 className="app-title">Getting Started</h1>
      </header>
      <div className="app-container">
        <ol style={{ fontSize: "1.2rem", lineHeight: "1.8" }}>
          <li>
            Follow the instructions at this link to download your LinkedIn
            connections data:{" "}
            <a
              href="https://www.linkedin.com/help/linkedin/answer/a566336/export-connections-from-linkedin"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1E90FF" }}
            >
              Export Connections from LinkedIn
            </a>
          </li>
          <li>Create a Poke account.</li>
          <li>
            Unzip the file. From the home page, select the{" "}
            <strong>"Import Connections from CSV"</strong> option. Open the
            folder you just downloaded, and select the <strong>Connections</strong> file to
            upload.
          </li>
          <li>That's it! Now you can begin poking people you haven't chatted to in a while!</li>
        </ol>
      </div>
    </div>
  );
};

export default GettingStarted;
