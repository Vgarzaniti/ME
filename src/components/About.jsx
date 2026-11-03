import React from "react";
import ArchitectureRig from "./ArchitectureRig";
import "../styles/About.css";

function About() {
  return (
    <section id="about" className="about-section">
      <div className="section-badge">Engineering & Architecture</div>
      <h2 className="section-heading">About Me & Skills Architecture</h2>

      {/* Intro & Credentials */}
      <div className="about-intro-card">
        <p className="about-bio">
          I'm <span className="accent-name">Valentín Augusto Garzaniti</span>, the developer and founder behind <strong>Garzaniti IT</strong>.
          As an Information Systems Engineering student at <strong>UTN (Universidad Tecnológica Nacional)</strong>,
          I combine computer science principles, clean hexagonal design, and modern tooling to build dependable software.
        </p>

        <div className="about-metrics-grid">
          <div className="metric-box">
            <span className="metric-number">UTN FRLP</span>
            <span className="metric-label">Information Systems Engineering</span>
          </div>
          <div className="metric-box">
            <span className="metric-number">Full-Stack Core</span>
            <span className="metric-label">React 19 • Python / Django</span>
          </div>
          <div className="metric-box">
            <span className="metric-number">Automation & Cloud</span>
            <span className="metric-label">n8n • PostgreSQL • Railway • Vercel</span>
          </div>
        </div>
      </div>

      {/* Unified 3D Architecture Workstation (Zero Cards) */}
      <ArchitectureRig />
    </section>
  );
}

export default About;
