import React from "react";
import "../styles/About.css";

const SKILL_CATEGORIES = [
  {
    title: "Frontend Engineering",
    icon: "⚛️",
    skills: ["React 19", "JavaScript (ES6+)", "Vite", "HTML5 & CSS3", "Responsive UI", "REST Integration"],
  },
  {
    title: "Backend & Systems",
    icon: "🐍",
    skills: ["Python", "Django", "Django REST Framework", "API Design", "Authentication (JWT)", "Microservices"],
  },
  {
    title: "Databases & Storage",
    icon: "🗄️",
    skills: ["PostgreSQL (Neon)", "MySQL", "Relational Modeling", "ORM Optimization", "Redis Caching"],
  },
  {
    title: "DevOps & Cloud",
    icon: "🚀",
    skills: ["Railway", "Vercel", "AWS", "Git & GitHub", "CI/CD Actions", "Agile Methodologies"],
  },
];

function About() {
  return (
    <section id="about" className="about-section">
      <div className="section-badge">Engineering & Architecture</div>
      <h2 className="section-heading">About Me</h2>

      <div className="about-intro-card">
        <p className="about-bio">
          I'm <span className="accent-name">Valentín Augusto Garzaniti</span>, the founder and developer behind <strong>Garzaniti IT</strong>.
          As an Information Systems Engineering student in Argentina, I blend solid computer science foundations
          with modern software architecture to engineer robust, high-availability digital products.
        </p>

        <div className="about-metrics-grid">
          <div className="metric-box">
            <span className="metric-number">UTN</span>
            <span className="metric-label">Information Systems Engineering</span>
          </div>
          <div className="metric-box">
            <span className="metric-number">Full-Stack</span>
            <span className="metric-label">React + Python/Django</span>
          </div>
          <div className="metric-box">
            <span className="metric-number">Cloud Ready</span>
            <span className="metric-label">Railway • Vercel • AWS</span>
          </div>
        </div>
      </div>

      <div className="skills-grid">
        {SKILL_CATEGORIES.map((cat, idx) => (
          <div key={idx} className="skill-category-card">
            <div className="category-header">
              <span className="category-icon">{cat.icon}</span>
              <h3>{cat.title}</h3>
            </div>
            <div className="category-tags">
              {cat.skills.map((s, sIdx) => (
                <span key={sIdx} className="category-tag">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default About;
