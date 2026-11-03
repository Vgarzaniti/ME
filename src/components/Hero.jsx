import React from "react";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-badge">
        <span className="hero-status-pulse" />
        <span>Available for new projects & full-stack roles</span>
      </div>

      <h1 className="hero-title">
        Hi, I'm <span className="highlight-gradient">Valentín Augusto Garzaniti</span> 👋
      </h1>
      <h2 className="hero-role">Garzaniti IT • Full-Stack Engineer & Systems Specialist</h2>

      <p className="hero-description">
        I architect and engineer resilient web applications, RESTful APIs, and cloud deployments
        with <strong>React</strong>, <strong>Python / Django</strong>, and modern cloud infrastructure
        like <strong>Railway</strong>, <strong>Vercel</strong>, and <strong>AWS</strong>.
      </p>

      <div className="hero-actions">
        <a href="#projects" className="btn btn-primary">
          Explore Projects →
        </a>
        <a href="#contact" className="btn btn-secondary">
          Get in Touch
        </a>
      </div>

      <div className="hero-tech-strip">
        <span className="strip-label">Core Ecosystem:</span>
        <div className="strip-tags">
          <span className="strip-tag">React 19</span>
          <span className="strip-tag">Python</span>
          <span className="strip-tag">Django</span>
          <span className="strip-tag">PostgreSQL</span>
          <span className="strip-tag">Docker</span>
          <span className="strip-tag">Railway</span>
          <span className="strip-tag">Vercel</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
