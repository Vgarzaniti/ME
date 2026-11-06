import React from "react";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Process.css";

function Process() {
  const { t } = useLanguage();
  const proc = t.process;

  if (!proc) return null;

  return (
    <section id="process" className="process-section">
      <div className="section-badge">{proc.badge}</div>
      <h2 className="section-heading">{proc.heading}</h2>
      <p className="process-subheading">{proc.subheading}</p>

      <div className="process-grid">
        {proc.steps.map((step, idx) => (
          <div key={idx} className="process-card">
            <div className="process-card-top">
              <span className="process-step-num">{step.num}</span>
              <span className="process-step-duration">{step.duration}</span>
            </div>
            <h3 className="process-step-title">{step.title}</h3>
            <p className="process-step-desc">{step.desc}</p>
            <div className="process-deliverable">
              <span className="deliverable-dot" />
              <span>{step.deliverable}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Process;
