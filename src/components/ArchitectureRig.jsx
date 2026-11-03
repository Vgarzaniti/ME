import React, { useState } from "react";
import "../styles/ArchitectureRig.css";

export default function ArchitectureRig() {
  const [activeMode, setActiveMode] = useState("live"); // live | database | automation | cloud
  const [queryCount, setQueryCount] = useState(1);
  const [packetTrigger, setPacketTrigger] = useState(0);

  const handleTriggerAutomation = () => {
    setActiveMode("automation");
    setPacketTrigger((prev) => prev + 1);
  };

  const handleExecuteDatabase = () => {
    setActiveMode("database");
    setQueryCount((prev) => prev + 1);
  };

  return (
    <div className="unified-rig-stage">
      <div className="stage-header">
        <span className="stage-pill">Unified System Canvas • Zero Cards</span>
        <h3 className="stage-title">The Full-Stack Architecture Rig</h3>
        <p className="stage-subtitle">
          An interconnected 3D engineering workstation. The database rack, n8n data conduits, UI viewport, and cloud towers operate as one single machine.
        </p>

        {/* Hardware Mode Controls */}
        <div className="rig-mode-bar">
          <button
            type="button"
            onClick={() => setActiveMode("live")}
            className={`rig-mode-btn ${activeMode === "live" ? "active" : ""}`}
          >
            ⚡ Full System Live
          </button>
          <button
            type="button"
            onClick={handleExecuteDatabase}
            className={`rig-mode-btn ${activeMode === "database" ? "active" : ""}`}
          >
            🗄️ Query Database Blade
          </button>
          <button
            type="button"
            onClick={handleTriggerAutomation}
            className={`rig-mode-btn ${activeMode === "automation" ? "active" : ""}`}
          >
            🔄 Fire n8n Data Pulse
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("cloud")}
            className={`rig-mode-btn ${activeMode === "cloud" ? "active" : ""}`}
          >
            ☁️ Inspect Cloud Towers
          </button>
        </div>
      </div>

      {/* 3D Physical Rig Scene */}
      <div className="rig-3d-scene">
        {/* Ambient Floor Glow */}
        <div className="rig-floor-grid" />
        <div className="rig-ambient-glow" />

        <div className={`rig-chassis mode-${activeMode}`}>
          {/* 1. LEFT TOWER: PHYSICAL SERVER RACK BLADES */}
          <div className="rig-unit server-blade-unit">
            <div className="unit-header-bar">
              <span className="unit-title">SERVER RACK</span>
              <span className="unit-led-pulse" />
            </div>

            <div className="blade-slots">
              {/* Slot 1: PostgreSQL Neon */}
              <div className="rack-slot slot-active">
                <div className="slot-led-cluster">
                  <span className="led-green" />
                  <span className="led-blue" />
                </div>
                <div className="slot-meta">
                  <span className="slot-name">PostgreSQL (Neon)</span>
                  <span className="slot-stat">
                    {activeMode === "database"
                      ? `Q#${queryCount} • 18ms latency`
                      : "Serverless Cluster • 99.9%"}
                  </span>
                </div>
              </div>

              {/* Slot 2: Django REST Engine */}
              <div className="rack-slot">
                <div className="slot-led-cluster">
                  <span className="led-green" />
                </div>
                <div className="slot-meta">
                  <span className="slot-name">Python / Django REST</span>
                  <span className="slot-stat">ORM Worker Pool</span>
                </div>
              </div>

              {/* Slot 3: Redis In-Memory Cache */}
              <div className="rack-slot">
                <div className="slot-led-cluster">
                  <span className="led-yellow" />
                </div>
                <div className="slot-meta">
                  <span className="slot-name">Redis Cache & Queues</span>
                  <span className="slot-stat">Sub-millisecond TTL</span>
                </div>
              </div>
            </div>

            <div className="rack-vent-grill">
              <span className="vent-line" />
              <span className="vent-line" />
              <span className="vent-line" />
            </div>
          </div>

          {/* 2. FIBER-OPTIC DATA CABLES (n8n Pipeline Conduits) */}
          <div className="data-conduit-system">
            <svg
              className="conduit-svg"
              viewBox="0 0 500 180"
              preserveAspectRatio="none"
            >
              {/* Left Conduit (Server -> Center UI) */}
              <path
                className="conduit-line"
                d="M 10 90 C 120 40, 160 140, 240 90"
              />
              {/* Right Conduit (Center UI -> Cloud) */}
              <path
                className="conduit-line conduit-accent"
                d="M 260 90 C 340 40, 380 140, 490 90"
              />
            </svg>

            {/* Glowing Traveling Data Packets */}
            <div key={`p1-${packetTrigger}`} className="glowing-packet packet-left-to-center" />
            <div key={`p2-${packetTrigger}`} className="glowing-packet packet-center-to-right" />

            <div className="n8n-bus-badge">
              <span className="bus-icon">🔄</span>
              <span>n8n Workflow Bus • Webhooks Active</span>
            </div>
          </div>

          {/* 3. CENTER: HOLOGRAPHIC CURVED UI DISPLAY */}
          <div className="rig-unit holographic-display-unit">
            <div className="holo-bezel">
              <div className="holo-topbar">
                <div className="holo-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <span className="holo-url">React 19 Frontend Viewport</span>
                <span className="holo-fps">60 FPS</span>
              </div>

              <div className="holo-screen-content">
                <div className="holo-status-row">
                  <span className="holo-label">State Hydration:</span>
                  <span className="holo-val">Instant (Vite 7)</span>
                </div>

                <div className="holo-interactive-widget">
                  <div className="widget-header">
                    <span>⚡ Live UI State Controller</span>
                    <span className="widget-pill">Connected</span>
                  </div>
                  <div className="widget-action-row">
                    <button
                      type="button"
                      onClick={handleExecuteDatabase}
                      className="widget-cta"
                    >
                      Trigger Database Query (x{queryCount})
                    </button>
                    <button
                      type="button"
                      onClick={handleTriggerAutomation}
                      className="widget-cta cta-n8n"
                    >
                      Fire Webhook Pulse
                    </button>
                  </div>
                </div>

                <div className="holo-metric-chips">
                  <span className="chip">FCP: 0.5s</span>
                  <span className="chip">Lighthouse: 99</span>
                  <span className="chip">CSS 3D Engine</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. RIGHT TOWER: CLOUD & EDGE CONTAINERS */}
          <div className="rig-unit cloud-tower-unit">
            <div className="unit-header-bar">
              <span className="unit-title">CLOUD TOWER</span>
              <span className="unit-led-pulse led-blue" />
            </div>

            <div className="cloud-pods-stack">
              <div className="cloud-pod pod-vercel">
                <div className="pod-header">
                  <span className="pod-logo">▲</span>
                  <span className="pod-name">Vercel Edge</span>
                  <span className="pod-state live">Global CDN</span>
                </div>
                <span className="pod-desc">Instant static assets & edge routing</span>
              </div>

              <div className="cloud-pod pod-railway">
                <div className="pod-header">
                  <span className="pod-logo">🚂</span>
                  <span className="pod-name">Railway App</span>
                  <span className="pod-state live">99.98%</span>
                </div>
                <span className="pod-desc">API worker instances & automated deploys</span>
              </div>

              <div className="cloud-pod pod-docker">
                <div className="pod-header">
                  <span className="pod-logo">🐳</span>
                  <span className="pod-name">Docker Pods</span>
                  <span className="pod-state live">Healthy</span>
                </div>
                <span className="pod-desc">Isolated containers & n8n workflow engine</span>
              </div>
            </div>

            <div className="tower-footer">
              <span className="ci-badge">✔ GitHub Actions CI/CD Active</span>
            </div>
          </div>
        </div>

        {/* Rig Hardware Base / Glowing Foundation Pedestal */}
        <div className="rig-pedestal">
          <div className="pedestal-vent" />
          <div className="pedestal-specs">
            <span>Garzaniti IT • Systems Architecture Rig v2.4</span>
            <span className="pedestal-accent">End-to-End Scalability</span>
          </div>
        </div>
      </div>
    </div>
  );
}
