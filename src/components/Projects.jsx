import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Projects.css";

function Projects() {
  const { t } = useLanguage();
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;

  const projectList = t.projects.items;
  const totalPages = Math.ceil(projectList.length / itemsPerPage);
  const start = page * itemsPerPage;
  const shownProjects = projectList.slice(start, start + itemsPerPage);

  const goPrev = () => setPage((p) => Math.max(p - 1, 0));
  const goNext = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  return (
    <section id="projects" className="projects-section">
      <div className="section-badge">{t.projects.badge}</div>
      <h2 className="section-heading">{t.projects.heading}</h2>

      {totalPages > 1 && (
        <div className="carousel-controls">
          <button
            type="button"
            onClick={goPrev}
            disabled={page === 0}
            className="carousel-btn"
            aria-label={t.projects.prevBtn}
          >
            {t.projects.prevBtn}
          </button>
          <span className="carousel-page-indicator">
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={page === totalPages - 1}
            className="carousel-btn"
            aria-label={t.projects.nextBtn}
          >
            {t.projects.nextBtn}
          </button>
        </div>
      )}

      <div className="projects-grid">
        {shownProjects.map((p, i) => (
          <div key={start + i} className="project-card">
            <div className="card-top-row">
              <span className={`project-status ${p.deployed ? "status-deployed" : "status-repo"}`}>
                <span className="status-dot" />
                {p.deployed ? t.projects.statusDeployed : t.projects.statusRepo}
              </span>
              {p.metric && <span className="project-metric-pill">{p.metric}</span>}
            </div>

            {p.architecture && (
              <div className="project-arch-pipeline" aria-label={t.projects.archLabel}>
                {p.architecture.map((node, nIdx) => (
                  <React.Fragment key={nIdx}>
                    <span className="arch-node">{node}</span>
                    {nIdx < p.architecture.length - 1 && (
                      <span className="arch-arrow">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            <div className="project-content">
              <h3 className="project-title">{p.name}</h3>
              <p className="project-desc">{p.desc}</p>

              {p.tags && (
                <div className="project-tags">
                  {p.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {!p.deployed && p.extra && (
                <div className="project-extra">
                  <p>{p.extra}</p>
                </div>
              )}
            </div>

            <div className="project-footer">
              {p.link && (
                <a href={p.link} target="_blank" rel="noreferrer" className="project-action-btn btn-view">
                  {t.projects.launchDemo}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              )}
              {p.github && (
                <a href={p.github} target="_blank" rel="noreferrer" className="project-action-btn btn-repo">
                  {t.projects.viewCode}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
