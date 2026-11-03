import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Services.css";

export default function Services() {
  const { t } = useLanguage();
  const servicesList = t.services.items;
  const [selectedServiceId, setSelectedServiceId] = useState("automation");
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeSimulationStep, setActiveSimulationStep] = useState(null);
  const [simulationLogs, setSimulationLogs] = useState([]);
  const [livePayload, setLivePayload] = useState(null);

  const currentService =
    servicesList.find((s) => s.id === selectedServiceId) || servicesList[0];

  // Set default initial payload on service change
  useEffect(() => {
    setIsSimulating(false);
    setActiveSimulationStep(null);
    setSimulationLogs([]);
    if (currentService.simulationStages && currentService.simulationStages.length > 0) {
      setLivePayload(
        currentService.simulationStages[currentService.simulationStages.length - 1].payload
      );
    }
  }, [selectedServiceId, currentService]);

  const handleSimulatePipeline = () => {
    if (isSimulating || !currentService.simulationStages) return;
    setIsSimulating(true);
    setSimulationLogs([]);

    // Execute stage 0 immediately
    setActiveSimulationStep(0);
    setSimulationLogs([currentService.simulationStages[0].log]);
    setLivePayload(currentService.simulationStages[0].payload);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < currentService.simulationStages.length) {
        setActiveSimulationStep(currentStep);
        setSimulationLogs((prev) => [
          ...prev,
          currentService.simulationStages[currentStep].log,
        ]);
        setLivePayload(currentService.simulationStages[currentStep].payload);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsSimulating(false);
        }, 1000);
      }
    }, 750);
  };

  return (
    <section id="services" className="services-section">
      <div className="section-badge">{t.services.badge}</div>
      <h2 className="section-heading">{t.services.heading}</h2>
      <p className="services-subheading">{t.services.subheading}</p>

      {/* Interactive Service Switcher */}
      <div className="services-switcher">
        {servicesList.map((srv) => (
          <button
            key={srv.id}
            type="button"
            onClick={() => setSelectedServiceId(srv.id)}
            className={`service-tab-btn ${selectedServiceId === srv.id ? "active" : ""}`}
          >
            <span className="tab-srv-icon">{srv.icon}</span>
            <div className="tab-srv-text">
              <span className="tab-srv-title">{srv.title.split("&")[0].split("y")[0]}</span>
              <span className="tab-srv-badge">{srv.badge}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Dynamic Interactive Service Studio */}
      <div className="service-studio-card">
        {/* Header */}
        <div className="studio-header">
          <div className="studio-title-box">
            <span className="studio-icon-big">{currentService.icon}</span>
            <div>
              <span className="studio-pill">{currentService.badge}</span>
              <h3 className="studio-title">{currentService.title}</h3>
              <p className="studio-tagline">{currentService.tagline}</p>
            </div>
          </div>

          <a href="#contact" className="studio-cta-btn">
            {t.services.discussCta}
          </a>
        </div>

        {/* Interactive Pipeline Visualizer */}
        <div className="pipeline-container">
          <div className="pipeline-top-bar">
            <div className="pipeline-header-title">
              <span className="pipeline-label">{t.services.pipelineLabel}</span>
              <span className="pipeline-hint">
                {isSimulating
                  ? t.services.pipelineHintSimulating
                  : t.services.pipelineHintIdle}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSimulatePipeline}
              disabled={isSimulating}
              className={`simulate-btn ${isSimulating ? "simulating" : ""}`}
            >
              {isSimulating ? t.services.btnSimulating : t.services.btnSimulate}
            </button>
          </div>

          {/* Flow Nodes */}
          <div className="pipeline-nodes-row">
            {currentService.pipelineSteps.map((step, idx) => {
              const isCurrentActive = activeSimulationStep === idx;
              const isPassed = activeSimulationStep !== null && activeSimulationStep > idx;

              return (
                <div
                  key={idx}
                  className={`pipeline-node ${isCurrentActive ? "node-active" : ""} ${
                    isPassed ? "node-passed" : ""
                  }`}
                >
                  <div className="node-badge-step">
                    {step.step}
                    {isCurrentActive && <span className="node-active-pulse" />}
                  </div>
                  <h4 className="node-title">{step.title}</h4>
                  <p className="node-desc">{step.desc}</p>
                  {idx < currentService.pipelineSteps.length - 1 && (
                    <div className="node-arrow">➔</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Live Execution Console & Output */}
          <div className="simulation-live-panel">
            {/* Live Terminal Log Stream */}
            <div className="live-logs-container">
              <div className="logs-header">
                <span className="terminal-dot-live" />
                <span>{t.services.logsHeader}</span>
                {simulationLogs.length > 0 && (
                  <span className="logs-count">
                    {simulationLogs.length}/4 {t.services.logsStepsComplete}
                  </span>
                )}
              </div>
              <div className="logs-body">
                {simulationLogs.length === 0 ? (
                  <div className="logs-placeholder">{t.services.logsPlaceholder}</div>
                ) : (
                  simulationLogs.map((log, lIdx) => (
                    <div key={lIdx} className="log-line">
                      <span className="log-arrow">➜</span> {log}
                    </div>
                  ))
                )}
                {activeSimulationStep === 3 && (
                  <div className="log-line log-success">{t.services.logsCompleted}</div>
                )}
              </div>
            </div>

            {/* Dynamic Payload JSON Inspector */}
            <div className="payload-inspector">
              <div className="payload-header">
                <span className="payload-dot" />
                <span>{t.services.payloadHeader}</span>
                {activeSimulationStep !== null && (
                  <span className="step-tag">
                    {t.services.stepOutput} {activeSimulationStep + 1}
                  </span>
                )}
              </div>
              <pre className="payload-code">
                <code>{JSON.stringify(livePayload, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Value Proposition & Deliverables */}
        <div className="studio-details-grid">
          <div className="studio-detail-box">
            <h4>{t.services.problemHeading}</h4>
            <p>{currentService.description}</p>
            <div className="roi-highlight">
              <strong>{t.services.roiPrefix}</strong> {currentService.roi}
            </div>
          </div>

          <div className="studio-detail-box">
            <h4>{t.services.includedHeading}</h4>
            <ul className="deliverables-list">
              {currentService.deliverables.map((item, idx) => (
                <li key={idx}>
                  <span className="check-icon">✔</span> {item}
                </li>
              ))}
            </ul>

            <div className="studio-tech-chips">
              {currentService.techStack.map((tech, idx) => (
                <span key={idx} className="tech-chip">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
