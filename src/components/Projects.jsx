import React from "react";
import "./Projects.css";

function Projects() {
  const projects = [
    {
      name: "Suchus-Design",
      desc: "Full-Stack web application (React + Django + MySQL) developed for a photocopy shop. The project is currently in progress and deployed on Railway for testing.",
      link: "https://suchus-design.vercel.app/",
      status: "In Progress",
    },
  ];

  return (
    <section id="projects" className="projects">
      <h2>Projects</h2>
      <div className="projects-grid">
        {projects.map((p, i) => (
          <div key={i} className="project-card">
            <h3>{p.name}</h3>
            <p>{p.desc}</p>
            <a href={p.link} target="_blank" rel="noreferrer">
              View Project →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
