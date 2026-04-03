import React, { useState } from "react";
import "../styles/Projects.css";

import { projects } from "../data/projects";

function Projects() {
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const start = page * itemsPerPage;
  const shownProjects = projects.slice(start, start + itemsPerPage);

  const goPrev = () => setPage((p) => Math.max(p - 1, 0));
  const goNext = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  return (
    <section id="projects" className="projects">
      <h2>Projects</h2>
      <div className="carousel-controls">
        {totalPages > 1 && (
          <>
            <button onClick={goPrev} disabled={page === 0} className="carousel-btn">
              ← Anterior
            </button>
            <button onClick={goNext} disabled={page === totalPages - 1} className="carousel-btn">
              Siguiente →
            </button>
          </>
        )}
      </div>

      <div className="projects-grid">
        {shownProjects.map((p, i) => (
          <div key={start + i} className="project-card">
            <div className="project-content">
              <h3>{p.name}</h3>
              <p>{p.desc}</p>

              {!p.deployed && p.extra && (
                <div className="project-extra">
                  <p>{p.extra}</p>
                </div>
              )}
            </div>

            <div className="project-footer">
              <div className="project-actions">
                {p.deployed ? (
                  <a href={p.link} target="_blank" rel="noreferrer" className="project-link">
                    View Project →
                  </a>
                ) : (
                  <a href={p.github} target="_blank" rel="noreferrer" className="project-link">
                    GitHub Repo
                  </a>
                )}
              </div>

              <span className={`project-status ${p.deployed ? "status-deployed" : "status-repo"}`}>
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <p className="carousel-page">Página {page + 1} de {totalPages}</p>
      )}
    </section>
  );
}

export default Projects;
