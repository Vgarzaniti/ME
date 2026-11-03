import React from "react";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Hero.css";

function Hero() {
  const { t } = useLanguage();

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
      </div>

      <div className="hero-tech-strip">
        <span className="strip-label">{t.hero.ecosystemLabel}</span>
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
