import React from "react";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero" id="hero">
      <h1>
        Hi, I'm <span className="highlight">Valentín</span> 👋
      </h1>
      <h2>Full-Stack Developer </h2>
      <p>
        I build scalable web applications and APIs, and deploy them to cloud
        platforms like <strong>Railway</strong> , <strong>Vercel</strong> and <strong>AWS</strong>.
      </p>
      <a href="#projects" className="btn">
        See My Work
      </a>
    </section>
  );
}

export default Hero;
