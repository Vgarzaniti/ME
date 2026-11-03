import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "../styles/About.css";

function About() {
  const { t } = useLanguage();

  // Interactive state for Frontend Bento card
  const [interactiveCount, setInteractiveCount] = useState(42);
  const [activeThemePreview, setActiveThemePreview] = useState("dark");

  // Interactive state for Backend Bento card
  const [sqlExecuted, setSqlExecuted] = useState(false);

  return (
    <section id="about" className="about-section">
      <div className="section-badge">{t.about.badge}</div>
      <h2 className="section-heading">{t.about.heading}</h2>

      {/* Intro & Credentials */}
      <div className="about-intro-card">
        <p className="about-bio">
          {t.about.bio.split("Valentín Augusto Garzaniti")[0]}
          <span className="accent-name">Valentín Augusto Garzaniti</span>
          {t.about.bio.split("Valentín Augusto Garzaniti")[1]}
        </p>

        <div className="about-metrics-grid">
          {t.about.metrics.map((metric, idx) => (
            <div key={idx} className="metric-box">
              <span className="metric-number">{metric.number}</span>
              <span className="metric-label">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3D Bento Grid: Skills Lab */}
      <div className="skills-bento-header">
        <span className="bento-subtitle">{t.about.bentoSubtitle}</span>
        <h3 className="bento-title">{t.about.bentoTitle}</h3>
      </div>

      <div className="bento-grid">
        {/* Bento 1: Backend & Scalable APIs */}
        <div className="bento-card bento-backend">
          <div className="bento-header">
            <div className="bento-icon-box">🐍</div>
            <div className="bento-title-group">
              <span className="bento-tag">{t.about.bento1.tag}</span>
              <h4 className="bento-card-title">{t.about.bento1.title}</h4>
            </div>
          </div>
          <p className="bento-desc">{t.about.bento1.desc}</p>

          {/* Server Blade Mockup */}
          <div className="bento-mockup server-mockup">
            <div className="mockup-top-bar">
              <div className="mockup-dots">
                <span className="m-dot dot-red" />
                <span className="m-dot dot-yellow" />
                <span className="m-dot dot-green" />
              </div>
              <span className="mockup-label">{t.about.bento1.clusterLabel}</span>
              <span className="latency-badge">{t.about.bento1.latency}</span>
            </div>

            <div className="server-monitor-body">
              <div className="sql-box">
                <span className="sql-comment">{t.about.bento1.sqlComment}</span>
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
                  {sqlExecuted ? t.about.bento1.sqlRerun : t.about.bento1.sqlRun}
                </button>
                <span className="sql-result">
                  {sqlExecuted
                    ? t.about.bento1.sqlSuccess
                    : t.about.bento1.sqlReady}
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
              <span className="bento-tag">{t.about.bento2.tag}</span>
              <h4 className="bento-card-title">{t.about.bento2.title}</h4>
            </div>
          </div>
          <p className="bento-desc">{t.about.bento2.desc}</p>

          {/* Mini Browser Mockup */}
          <div className="bento-mockup browser-mockup">
            <div className="browser-header">
              <div className="mockup-dots">
                <span className="m-dot dot-red" />
                <span className="m-dot dot-yellow" />
                <span className="m-dot dot-green" />
              </div>
              <span className="browser-url">{t.about.bento2.url}</span>
              <span className="fps-badge">{t.about.bento2.fps}</span>
            </div>

            <div className="browser-body">
              <div className="browser-interactive-component">
                <span className="preview-label">{t.about.bento2.testLabel}</span>
                <div className="interactive-controls">
                  <button
                    type="button"
                    onClick={() => setInteractiveCount((c) => c + 1)}
                    className="state-btn"
                  >
                    {t.about.bento2.stateLabel} <strong>{interactiveCount}</strong> (+1)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveThemePreview((theme) => (theme === "dark" ? "mint" : "dark"))
                    }
                    className="mode-toggle-btn"
                  >
                    {t.about.bento2.colorwayLabel} {activeThemePreview}
                  </button>
                </div>
                <div className="vitals-row">
                  <span className="vital-pill">{t.about.bento2.fcp}</span>
                  <span className="vital-pill">{t.about.bento2.lighthouse}</span>
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
              <span className="bento-tag">{t.about.bento3.tag}</span>
              <h4 className="bento-card-title">{t.about.bento3.title}</h4>
            </div>
          </div>
          <p className="bento-desc">{t.about.bento3.desc}</p>

          {/* Visual Node Graph Mockup */}
          <div className="bento-mockup n8n-canvas-mockup">
            <div className="canvas-header">
              <span className="canvas-pill">{t.about.bento3.canvasPill}</span>
              <span className="status-pulse-live">{t.about.bento3.statusLive}</span>
            </div>

            <div className="canvas-nodes-container">
              <div className="c-node c-node-trigger">
                <span className="c-icon">⚡</span>
                <span className="c-text">{t.about.bento3.nodeTrigger}</span>
              </div>
              <div className="c-wire">
                <span className="c-packet" />
              </div>
              <div className="c-node c-node-process">
                <span className="c-icon">🧠</span>
                <span className="c-text">{t.about.bento3.nodeProcess}</span>
              </div>
              <div className="c-wire">
                <span className="c-packet packet-2" />
              </div>
              <div className="c-node c-node-action">
                <span className="c-icon">📲</span>
                <span className="c-text">{t.about.bento3.nodeAction}</span>
              </div>
            </div>
            <div className="canvas-footer-stat">
              <span>{t.about.bento3.efficiency}</span>
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
              <span className="bento-tag">{t.about.bento4.tag}</span>
              <h4 className="bento-card-title">{t.about.bento4.title}</h4>
            </div>
          </div>
          <p className="bento-desc">{t.about.bento4.desc}</p>

          {/* Cloud Topology Mockup */}
          <div className="bento-mockup cloud-mockup">
            <div className="cloud-services-list">
              <div className="cloud-row">
                <span className="cloud-name">{t.about.bento4.service1}</span>
                <span className="cloud-status live">{t.about.bento4.status1}</span>
              </div>
              <div className="cloud-row">
                <span className="cloud-name">{t.about.bento4.service2}</span>
                <span className="cloud-status live">{t.about.bento4.status2}</span>
              </div>
              <div className="cloud-row">
                <span className="cloud-name">{t.about.bento4.service3}</span>
                <span className="cloud-status live">{t.about.bento4.status3}</span>
              </div>
              <div className="cloud-row">
                <span className="cloud-name">{t.about.bento4.service4}</span>
                <span className="cloud-status passed">{t.about.bento4.status4}</span>
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
