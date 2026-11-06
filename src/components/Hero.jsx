import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Hero.css";

function Hero() {
  const { t } = useLanguage();
  const [showCvModal, setShowCvModal] = useState(false);

  const cv = t.hero.cvModal;

  const handlePrintCv = () => {
    window.print();
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-badge">
        <span className="hero-status-pulse" />
        <span>{t.hero.badge}</span>
      </div>

      <h1 className="hero-title">
        {t.hero.greeting} <span className="highlight-gradient">{t.hero.name}</span> 👋
      </h1>
      <h2 className="hero-role">{t.hero.role}</h2>

      <p className="hero-description">{t.hero.description}</p>

      <div className="hero-actions">
        <a href="#projects" className="btn btn-primary">
          {t.hero.exploreBtn}
        </a>
        <a href="#contact" className="btn btn-secondary">
          {t.hero.contactBtn}
        </a>
        <button
          type="button"
          className="btn btn-cv"
          onClick={() => setShowCvModal(true)}
        >
          {t.hero.cvBtn}
        </button>
      </div>

      <div className="hero-tech-strip">
        <span className="strip-label">{t.hero.ecosystemLabel}</span>
        <div className="strip-tags">
          <span className="strip-tag">React 19</span>
          <span className="strip-tag">Python</span>
          <span className="strip-tag">Django</span>
          <span className="strip-tag">PostgreSQL</span>
          <span className="strip-tag">n8n</span>
          <span className="strip-tag">Docker</span>
          <span className="strip-tag">Railway</span>
          <span className="strip-tag">Vercel</span>
        </div>
      </div>

      {showCvModal && cv && (
        <div
          className="cv-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={cv.title}
          onClick={() => setShowCvModal(false)}
        >
          <div
            className="cv-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cv-modal-toolbar no-print">
              <span className="cv-toolbar-badge">Garzaniti IT • Executive Dossier</span>
              <div className="cv-toolbar-actions">
                <button
                  type="button"
                  className="cv-btn-print"
                  onClick={handlePrintCv}
                >
                  {cv.printBtn}
                </button>
                <button
                  type="button"
                  className="cv-btn-close"
                  onClick={() => setShowCvModal(false)}
                >
                  ✕ {cv.closeBtn}
                </button>
              </div>
            </div>

            <div className="cv-sheet">
              <header className="cv-header">
                <div>
                  <h2 className="cv-name">{cv.title}</h2>
                  <p className="cv-role">{cv.subtitle}</p>
                  <p className="cv-location">📍 {cv.location}</p>
                </div>
                <div className="cv-links">
                  <a href="mailto:valentingarzaniti@gmail.com">valentingarzaniti@gmail.com</a>
                  <a href="https://github.com/Vgarzaniti" target="_blank" rel="noreferrer">
                    github.com/Vgarzaniti
                  </a>
                  <a
                    href="https://www.linkedin.com/in/valent%C3%ADn-garzaniti-216946238/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    linkedin.com/in/valentín-garzaniti
                  </a>
                  <span>+54 9 221 591-3144</span>
                </div>
              </header>

              <section className="cv-section">
                <h3 className="cv-section-title">{cv.summaryTitle}</h3>
                <p className="cv-summary-text">{cv.summaryText}</p>
              </section>

              <section className="cv-section">
                <h3 className="cv-section-title">{cv.stackTitle}</h3>
                <div className="cv-stack-grid">
                  {cv.stackItems.map((item, idx) => (
                    <div key={idx} className="cv-stack-row">
                      <span className="cv-stack-label">{item.label}:</span>
                      <span className="cv-stack-val">{item.val}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="cv-section">
                <h3 className="cv-section-title">{cv.experienceTitle}</h3>
                {cv.experienceItems.map((exp, idx) => (
                  <div key={idx} className="cv-exp-block">
                    <div className="cv-exp-header">
                      <strong>{exp.role}</strong>
                      <span className="cv-exp-period">{exp.period}</span>
                    </div>
                    <ul className="cv-exp-list">
                      {exp.highlights.map((h, hIdx) => (
                        <li key={hIdx}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              <section className="cv-section">
                <h3 className="cv-section-title">{cv.educationTitle}</h3>
                <div className="cv-edu-block">
                  <strong>{cv.educationDegree}</strong> — <span>{cv.educationSchool}</span>
                  <p className="cv-edu-status">{cv.educationStatus}</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Hero;
