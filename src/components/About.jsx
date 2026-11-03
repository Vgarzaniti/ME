import React, { useState } from "react";
import "../styles/About.css";

function About() {
  // Interactive state for Frontend Bento card
  const [interactiveCount, setInteractiveCount] = useState(42);
  const [activeThemePreview, setActiveThemePreview] = useState("dark");

  // Interactive state for Backend Bento card
  const [sqlExecuted, setSqlExecuted] = useState(false);

  return (
    <section id="about" className="about-section">
      <div className="section-badge">Engineering & Architecture</div>
      <h2 className="section-heading">About Me & Skills Lab</h2>

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

      {/* 3D Bento Grid: Skills Lab */}
      <div className="skills-bento-header">
        <span className="bento-subtitle">Interactive Architecture Showcase</span>
        <h3 className="bento-title">Core Technical Pillars</h3>
      </div>

      <div className="bento-grid">
        {/* Bento 1: Backend & Scalable APIs */}
        <div className="bento-card bento-backend">
          <div className="bento-header">
            <div className="bento-icon-box">🐍</div>
            <div className="bento-title-group">
              <span className="bento-tag">Backend & Systems</span>
              <h4 className="bento-card-title">Python, Django REST & PostgreSQL</h4>
            </div>
          </div>
          <p className="bento-desc">
            Architecting high-availability APIs with Django REST Framework, relational schema design, connection pooling, and JWT authentication.
          </p>

          {/* Server Blade Mockup */}
          <div className="bento-mockup server-mockup">
            <div className="mockup-top-bar">
              <div className="mockup-dots">
                <span className="m-dot dot-red" />
                <span className="m-dot dot-yellow" />
                <span className="m-dot dot-green" />
              </div>
              <span className="mockup-label">sa-east-1 • PostgreSQL Neon Cluster</span>
              <span className="latency-badge">18ms</span>
            </div>

            <div className="server-monitor-body">
              <div className="sql-box">
                <span className="sql-comment">-- Optimized ORM Query Benchmark</span>
                <code>
                  SELECT id, title, status FROM core_projects WHERE is_active=true;
                </code>
              </div>
              <div className="sql-action-row">
                <button
                  type="button"
                  onClick={() => setSqlExecuted((prev) => !prev)}
                  className="sql-run-btn"
                >
                  {sqlExecuted ? "↺ Re-run Query" : "▶ Execute Query"}
                </button>
                <span className="sql-result">
                  {sqlExecuted
                    ? "✔ 4 rows returned (Execution: 1.2ms • 0 index scans)"
                    : "Status: Ready • Caching: Redis"}
                </span>
              </div>
            </div>
          </div>

          <div className="bento-tags">
            <span className="b-tag">Python 3.12</span>
            <span className="b-tag">Django REST</span>
            <span className="b-tag">PostgreSQL</span>
            <span className="b-tag">Neon Serverless</span>
            <span className="b-tag">MySQL</span>
            <span className="b-tag">Redis</span>
            <span className="b-tag">JWT Auth</span>
          </div>
        </div>

        {/* Bento 2: Frontend Engineering */}
        <div className="bento-card bento-frontend">
          <div className="bento-header">
            <div className="bento-icon-box">⚛️</div>
            <div className="bento-title-group">
              <span className="bento-tag">Frontend & UI</span>
              <h4 className="bento-card-title">React 19, Modern CSS 3D & State</h4>
            </div>
          </div>
          <p className="bento-desc">
            Engineering ultra-fast single page applications and mobile interfaces with React 19, Vite, responsive glassmorphism, and 60 FPS scroll animations.
          </p>

          {/* Mini Browser Mockup */}
          <div className="bento-mockup browser-mockup">
            <div className="browser-header">
              <div className="mockup-dots">
                <span className="m-dot dot-red" />
                <span className="m-dot dot-yellow" />
                <span className="m-dot dot-green" />
              </div>
              <span className="browser-url">https://garzaniti-it.dev/live-ui</span>
              <span className="fps-badge">60 FPS</span>
            </div>

            <div className="browser-body">
              <div className="browser-interactive-component">
                <span className="preview-label">Live React 19 Component Test:</span>
                <div className="interactive-controls">
                  <button
                    type="button"
                    onClick={() => setInteractiveCount((c) => c + 1)}
                    className="state-btn"
                  >
                    State: <strong>{interactiveCount}</strong> (+1)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveThemePreview((t) => (t === "dark" ? "mint" : "dark"))
                    }
                    className="mode-toggle-btn"
                  >
                    Colorway: {activeThemePreview}
                  </button>
                </div>
                <div className="vitals-row">
                  <span className="vital-pill">⚡ FCP: 0.5s</span>
                  <span className="vital-pill">💯 Lighthouse: 99</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bento-tags">
            <span className="b-tag">React 19</span>
            <span className="b-tag">JavaScript (ES6+)</span>
            <span className="b-tag">Vite</span>
            <span className="b-tag">CSS 3D</span>
            <span className="b-tag">React Router 7</span>
            <span className="b-tag">Vitest</span>
          </div>
        </div>

        {/* Bento 3: n8n Workflow Automation */}
        <div className="bento-card bento-automation">
          <div className="bento-header">
            <div className="bento-icon-box">🔄</div>
            <div className="bento-title-group">
              <span className="bento-tag">Workflow Automation</span>
              <h4 className="bento-card-title">n8n Engine, Webhooks & Integrations</h4>
            </div>
          </div>
          <p className="bento-desc">
            Connecting isolated tools into seamless automated systems. Triggering actions from forms, payment webhooks, CRM sync, and WhatsApp/Slack alerts.
          </p>

          {/* Visual Node Graph Mockup */}
          <div className="bento-mockup n8n-canvas-mockup">
            <div className="canvas-header">
              <span className="canvas-pill">n8n Active Canvas</span>
              <span className="status-pulse-live">● Running</span>
            </div>

            <div className="canvas-nodes-container">
              <div className="c-node c-node-trigger">
                <span className="c-icon">⚡</span>
                <span className="c-text">Webhook</span>
              </div>
              <div className="c-wire">
                <span className="c-packet" />
              </div>
              <div className="c-node c-node-process">
                <span className="c-icon">🧠</span>
                <span className="c-text">Filter & AI</span>
              </div>
              <div className="c-wire">
                <span className="c-packet packet-2" />
              </div>
              <div className="c-node c-node-action">
                <span className="c-icon">📲</span>
                <span className="c-text">WhatsApp</span>
              </div>
            </div>
            <div className="canvas-footer-stat">
              <span>Operational Efficiency Gain: <strong>~85% manual hours saved</strong></span>
            </div>
          </div>

          <div className="bento-tags">
            <span className="b-tag">n8n Workflows</span>
            <span className="b-tag">Webhooks</span>
            <span className="b-tag">WhatsApp API</span>
            <span className="b-tag">Slack Bots</span>
            <span className="b-tag">ETL Pipelines</span>
            <span className="b-tag">JSON Schema</span>
          </div>
        </div>

        {/* Bento 4: DevOps & Cloud Infrastructure */}
        <div className="bento-card bento-cloud">
          <div className="bento-header">
            <div className="bento-icon-box">☁️</div>
            <div className="bento-title-group">
              <span className="bento-tag">Cloud Infrastructure</span>
              <h4 className="bento-card-title">Railway, Vercel, Docker & CI/CD</h4>
            </div>
          </div>
          <p className="bento-desc">
            Production deployment setups that guarantee continuous uptime, automated testing on GitHub push, and instant global edge distribution.
          </p>

          {/* Cloud Topology Mockup */}
          <div className="bento-mockup cloud-mockup">
            <div className="cloud-services-list">
              <div className="cloud-row">
                <span className="cloud-name">🚀 Vercel Edge</span>
                <span className="cloud-status live">Production • 100%</span>
              </div>
              <div className="cloud-row">
                <span className="cloud-name">🚂 Railway App Engine</span>
                <span className="cloud-status live">Online • 99.98%</span>
              </div>
              <div className="cloud-row">
                <span className="cloud-name">🐳 Docker Container</span>
                <span className="cloud-status live">Isolated • Port 8000</span>
              </div>
              <div className="cloud-row">
                <span className="cloud-name">⚡ GitHub Actions Pipeline</span>
                <span className="cloud-status passed">CI Tests Passed ✔</span>
              </div>
            </div>
          </div>

          <div className="bento-tags">
            <span className="b-tag">Railway</span>
            <span className="b-tag">Vercel</span>
            <span className="b-tag">AWS</span>
            <span className="b-tag">Docker</span>
            <span className="b-tag">GitHub Actions</span>
            <span className="b-tag">Linux</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
