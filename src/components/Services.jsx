import React, { useState, useEffect } from "react";
import "../styles/Services.css";

const SERVICES_DATA = [
  {
    id: "automation",
    badge: "Most Requested",
    icon: "🔄",
    title: "n8n & Business Automation",
    tagline: "Replace manual operational hours with automated, self-healing pipelines.",
    description:
      "I design and deploy end-to-end automation workflows using n8n and webhooks. I connect your payment gateways, CRMs, WhatsApp/Email notifications, and databases so your business operates 24/7 without manual intervention.",
    roi: "Reduces repetitive manual tasks by up to 80% with zero recurring SaaS markups.",
    pipelineSteps: [
      { step: "1. Trigger", title: "Inquiry / Webhook", desc: "Form submit or payment event captured" },
      { step: "2. Process", title: "n8n Workflow Engine", desc: "Data enrichment, formatting & validation" },
      { step: "3. Database", title: "CRM & DB Sync", desc: "Instant write to PostgreSQL / Notion" },
      { step: "4. Action", title: "WhatsApp Alert", desc: "Instant alert dispatched to team & client" },
    ],
    simulationStages: [
      {
        log: "⚡ [00:00.012] Incoming webhook: POST /webhook/lead-capture (Payload: { client: 'Comercio Local', budget: '$1,500' })",
        payload: {
          event: "webhook_received",
          source: "Landing Form",
          client: "Comercio Local",
          serviceRequested: "n8n Automation",
          timestamp: new Date().toISOString(),
        },
      },
      {
        log: "🧠 [00:00.045] n8n Engine: Validating schema, calculating priority score (Score: 98/100) -> High Priority",
        payload: {
          event: "data_enriched",
          workflowId: "n8n_flow_lead_pipeline",
          validation: "passed",
          leadScore: 98,
          priority: "HIGH",
        },
      },
      {
        log: "🗄️ [00:00.089] Neon PostgreSQL: INSERT INTO clients_leads (lead_id: 1042) [Status: 200 OK - 18ms]",
        payload: {
          event: "database_committed",
          database: "PostgreSQL (Neon Serverless)",
          recordId: "LEAD-1042",
          latency: "18ms",
          persisted: true,
        },
      },
      {
        log: "📲 [00:00.142] WhatsApp Cloud API: Confirmation sent to owner & client [Status: Delivered 200 OK]",
        payload: {
          event: "pipeline_completed",
          totalTime: "142ms",
          manualTimeSaved: "~25 minutes",
          whatsappStatus: "Delivered",
          status: "SUCCESS_ZERO_ERRORS",
        },
      },
    ],
    deliverables: [
      "Custom self-hosted n8n instance (Docker / Cloud)",
      "Multi-channel alerts (WhatsApp, Telegram, Email, Slack)",
      "Automated invoice & receipt generation",
      "Robust error handling & automatic retry mechanisms",
    ],
    techStack: ["n8n", "Webhooks", "PostgreSQL", "REST APIs", "Docker", "JavaScript"],
  },
  {
    id: "fullstack",
    badge: "Core Engineering",
    icon: "🌐",
    title: "Custom Full-Stack Web Apps & MVPs",
    tagline: "Tailor-made web applications engineered for performance and scalability.",
    description:
      "From institutional platforms (like CLUD2025) to commercial platforms (like Suchus-Design), I engineer complete web applications with modern React frontends and solid Python/Django backends ready for production.",
    roi: "Clean, maintainable architecture built on open standards that scale as your user base grows.",
    pipelineSteps: [
      { step: "1. Client", title: "React 19 Frontend", desc: "Ultra-responsive, mobile-first UI with instant state" },
      { step: "2. Security", title: "JWT & Role Auth", desc: "Fine-grained permissions for admins & staff" },
      { step: "3. Backend", title: "Django REST API", desc: "Rock-solid business logic & ORM endpoints" },
      { step: "4. Cloud", title: "Automated Deploy", desc: "Continuous deployment on Railway & Neon DB" },
    ],
    simulationStages: [
      {
        log: "⚛️ [00:00.010] User action: Client requests dashboard metrics on React 19 SPA",
        payload: {
          view: "DashboardView",
          action: "fetch_overview",
          cache: "stale-while-revalidate",
        },
      },
      {
        log: "🛡️ [00:00.035] Auth Gateway: Verifying JWT bearer token & role permissions -> Authorized: Admin",
        payload: {
          auth: "Bearer eyJhbGciOi...",
          role: "workspace_admin",
          status: "authenticated",
        },
      },
      {
        log: "🐍 [00:00.075] Django REST Framework: Executing optimized query with select_related() [24ms]",
        payload: {
          endpoint: "/api/v1/projects/summary",
          engine: "Python 3.12 / Django 5",
          queryTime: "24ms",
        },
      },
      {
        log: "🚀 [00:00.118] Edge Response: 200 OK serialized with Gzip compression [Latency: 28ms]",
        payload: {
          httpStatus: 200,
          region: "sa-east-1 (Railway / Vercel)",
          payloadSize: "2.4 KB",
          renderDuration: "12ms",
        },
      },
    ],
    deliverables: [
      "Interactive SPA frontend (React + Vite)",
      "RESTful API backend (Python & Django)",
      "Relational database design & schema migrations",
      "Production cloud deployment & monitoring",
    ],
    techStack: ["React", "Python", "Django", "PostgreSQL", "Railway", "Vercel"],
  },
  {
    id: "management",
    badge: "Custom Solutions",
    icon: "💼",
    title: "Tailored Management Systems (ERP/CRM)",
    tagline: "Software that adapts to your exact business rules, not the other way around.",
    description:
      "When commercial software is too generic or expensive, I build bespoke management tools. From medical history trackers (DocTor-History) to print shop operations (Suchus-Design), I streamline your day-to-day operations.",
    roi: "100% ownership of your software, no per-user licensing fees, zero bloat.",
    pipelineSteps: [
      { step: "1. Intake", title: "Bespoke Forms", desc: "Custom fields tailored to your industry" },
      { step: "2. Storage", title: "Encrypted Records", desc: "Structured data storage with audit trails" },
      { step: "3. Workflow", title: "Status Pipeline", desc: "Track orders or clinical history live" },
      { step: "4. Reporting", title: "Automated Exports", desc: "One-click PDF invoices & metric charts" },
    ],
    simulationStages: [
      {
        log: "📋 [00:00.015] Operator creates new patient record in DocTor-History management module",
        payload: {
          module: "PatientManagement",
          action: "create_record",
          doctor: "Dr. Juan Augusto Garzaniti",
        },
      },
      {
        log: "🔒 [00:00.048] Data Engine: Encrypting sensitive medical history with AES-256 before storage",
        payload: {
          encryption: "AES-256-GCM",
          integrityCheck: "SHA-256 verified",
          compliance: "HIPAA / Health Standards",
        },
      },
      {
        log: "🗄️ [00:00.092] Database: Patient history committed to relational storage with rollback backup",
        payload: {
          recordId: "DOC-2026-941",
          status: "committed",
          auditTrail: "logged_user_id_1",
        },
      },
      {
        log: "🧾 [00:00.135] Report Engine: Automated PDF clinical summary generated & ready for print/export",
        payload: {
          pdfFile: "Historia_Clinica_941.pdf",
          pages: 3,
          downloadReady: true,
          status: "SUCCESS",
        },
      },
    ],
    deliverables: [
      "Patient, client, or order management interfaces",
      "Automated PDF reporting & invoice exports",
      "Role-based access control for team members",
      "Automated daily database backups",
    ],
    techStack: ["Python", "Django / Desktop UI", "MySQL", "PostgreSQL", "ReportLab", "Docker"],
  },
  {
    id: "landing",
    badge: "High Conversion",
    icon: "🚀",
    title: "High-Converting Web Presence & Showcases",
    tagline: "Fast, modern web landing pages that convert visitors into paying clients.",
    description:
      "I create sleek, modern digital experiences (like Iron Bull Gym) that load instantaneously, look breathtaking on mobile and desktop, and guide visitors straight to contacting or booking your services.",
    roi: "95+ Lighthouse performance score to maximize SEO ranking and customer trust.",
    pipelineSteps: [
      { step: "1. Visual", title: "Interactive 3D UI", desc: "Engaging scroll micro-interactions" },
      { step: "2. Speed", title: "Edge Performance", desc: "Sub-second load times on mobile" },
      { step: "3. Funnel", title: "Conversion Triggers", desc: "Direct WhatsApp booking integrations" },
      { step: "4. SEO", title: "Search Optimization", desc: "Structured semantic HTML & OpenGraph" },
    ],
    simulationStages: [
      {
        log: "🎨 [00:00.010] Visitor opens landing page on mobile via Instagram or Google Search",
        payload: {
          referrer: "google_search",
          device: "Mobile Safari (iOS)",
          viewport: "390x844",
        },
      },
      {
        log: "⚡ [00:00.038] Vercel Edge Network: Assets delivered in 38ms (FCP: 0.5s, LCP: 0.8s)",
        payload: {
          lighthouseScore: "99/100",
          firstContentfulPaint: "0.5s",
          status: "cache_hit_edge",
        },
      },
      {
        log: "📱 [00:00.082] Visitor clicks primary CTA 'Contact via WhatsApp' on membership package",
        payload: {
          conversionAction: "whatsapp_booking_click",
          packageName: "Pase Full Gym",
        },
      },
      {
        log: "📈 [00:00.120] Conversion registered: Direct WhatsApp chat launched with prefilled inquiry message",
        payload: {
          funnelStatus: "converted",
          chatOpened: true,
          status: "CLIENT_ACQUIRED",
        },
      },
    ],
    deliverables: [
      "Custom responsive design (Mobile, Tablet, Desktop)",
      "Interactive widgets and scroll animations",
      "Domain setup, SSL certificate & Vercel deployment",
      "Contact forms connected to WhatsApp or Email",
    ],
    techStack: ["React", "CSS3 / Modern Grid", "Vite", "Vercel", "SEO Best Practices"],
  },
];

export default function Services() {
  const [selectedServiceId, setSelectedServiceId] = useState("automation");
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeSimulationStep, setActiveSimulationStep] = useState(null);
  const [simulationLogs, setSimulationLogs] = useState([]);
  const [livePayload, setLivePayload] = useState(null);

  const currentService = SERVICES_DATA.find((s) => s.id === selectedServiceId);

  // Set default initial payload on service change
  useEffect(() => {
    setIsSimulating(false);
    setActiveSimulationStep(null);
    setSimulationLogs([]);
    setLivePayload(currentService.simulationStages[currentService.simulationStages.length - 1].payload);
  }, [selectedServiceId, currentService]);

  const handleSimulatePipeline = () => {
    if (isSimulating) return;
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
      <div className="section-badge">Freelance Software & Automation</div>
      <h2 className="section-heading">How I Can Help Your Business</h2>
      <p className="services-subheading">
        I work directly with founders, businesses, and teams to build high-ROI software and automate manual operations.
      </p>

      {/* Interactive Service Switcher */}
      <div className="services-switcher">
        {SERVICES_DATA.map((srv) => (
          <button
            key={srv.id}
            onClick={() => setSelectedServiceId(srv.id)}
            className={`service-tab-btn ${selectedServiceId === srv.id ? "active" : ""}`}
          >
            <span className="tab-srv-icon">{srv.icon}</span>
            <div className="tab-srv-text">
              <span className="tab-srv-title">{srv.title.split("&")[0]}</span>
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
            Discuss This Project →
          </a>
        </div>

        {/* Interactive Pipeline Visualizer */}
        <div className="pipeline-container">
          <div className="pipeline-top-bar">
            <div className="pipeline-header-title">
              <span className="pipeline-label">⚡ Live Architecture & Execution Pipeline:</span>
              <span className="pipeline-hint">
                {isSimulating ? "Processing real-time workflow..." : "Click below to see live data transmission"}
              </span>
            </div>
            <button
              onClick={handleSimulatePipeline}
              disabled={isSimulating}
              className={`simulate-btn ${isSimulating ? "simulating" : ""}`}
            >
              {isSimulating ? "⚙️ Running Simulation..." : "▶ Simulate Live Process"}
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
                <span>Real-Time Execution Logs</span>
                {simulationLogs.length > 0 && (
                  <span className="logs-count">{simulationLogs.length}/4 steps complete</span>
                )}
              </div>
              <div className="logs-body">
                {simulationLogs.length === 0 ? (
                  <div className="logs-placeholder">
                    Click <strong>"Simulate Live Process"</strong> above to trigger the workflow and stream live execution logs.
                  </div>
                ) : (
                  simulationLogs.map((log, lIdx) => (
                    <div key={lIdx} className="log-line">
                      <span className="log-arrow">➜</span> {log}
                    </div>
                  ))
                )}
                {activeSimulationStep === 3 && (
                  <div className="log-line log-success">
                    ✔ Pipeline execution completed successfully with 0 manual intervention.
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Payload JSON Inspector */}
            <div className="payload-inspector">
              <div className="payload-header">
                <span className="payload-dot" />
                <span>Active Step Payload (JSON)</span>
                {activeSimulationStep !== null && (
                  <span className="step-tag">Step {activeSimulationStep + 1} output</span>
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
            <h4>💡 Problem & Approach</h4>
            <p>{currentService.description}</p>
            <div className="roi-highlight">
              <strong>Expected Impact:</strong> {currentService.roi}
            </div>
          </div>

          <div className="studio-detail-box">
            <h4>📦 What's Included</h4>
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
