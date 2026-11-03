import React, { useState, useEffect, useRef } from "react";
import "../styles/ScrollShowcase.css";

const CODE_SNIPPETS = {
  backend: {
    filename: "server/views.py",
    language: "python",
    badge: "Django REST API",
    code: `from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Project, Deployment
from .serializers import ProjectSerializer

class PortfolioFeedView(APIView):
    """
    High-performance API endpoint serving portfolio data
    with Neon PostgreSQL database & Redis caching.
    """
    def get(self, request):
        projects = Project.objects.filter(is_published=True)
        serializer = ProjectSerializer(projects, many=True)
        return Response({
            "status": "healthy",
            "region": "sa-east-1",
            "uptime": "99.98%",
            "projects": serializer.data
        })`,
  },
  frontend: {
    filename: "src/App.jsx",
    language: "javascript",
    badge: "React 19 + Vite",
    code: `import { useState, useEffect } from "react";
import { fetchProjects } from "./api/client";

export default function InteractiveApp() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ultra-fast client-side hydration & state
    fetchProjects().then((res) => {
      setData(res.projects);
      setLoading(false);
    });
  }, []);

  return <PortfolioExperience data={data} loading={loading} />;
}`,
  },
  n8n: {
    filename: "workflow/automation.json",
    language: "json",
    badge: "n8n Workflow Engine",
    code: `{
  "name": "Omnichannel Client Pipeline",
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": { "path": "client-inquiry", "responseMode": "onReceived" }
    },
    {
      "name": "Filter & Enrich Data",
      "type": "n8n-nodes-base.code",
      "parameters": { "mode": "runOnceForEachItem" }
    },
    {
      "name": "Sync to PostgreSQL CRM",
      "type": "n8n-nodes-base.postgres",
      "parameters": { "operation": "upsert" }
    },
    {
      "name": "Notify via WhatsApp & Slack",
      "type": "n8n-nodes-base.httpRequest"
    }
  ]
}`,
  },
  devops: {
    filename: ".github/workflows/deploy.yml",
    language: "yaml",
    badge: "CI/CD & Cloud",
    code: `name: Production Deployment Pipeline
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy Frontend to Vercel Edge
        run: vercel --prod --token=\${{ secrets.VERCEL_TOKEN }}
      - name: Deploy API to Railway
        run: railway up --service api --detach`,
  },
};

const INITIAL_TERMINAL_OUTPUT = [
  { type: "system", text: "Garzaniti IT Interactive Shell v2.4" },
  { type: "system", text: "Type 'help' or click quick actions to explore stack & freelance services." },
  { type: "output", text: "Ready. Type a command below:" },
];

export default function ScrollShowcase() {
  const sectionRef = useRef(null);
  const terminalEndRef = useRef(null);
  const [activeTab, setActiveTab] = useState("backend");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Terminal State
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState(INITIAL_TERMINAL_OUTPUT);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = currentScroll / totalScrollable;
      const clamped = Math.min(Math.max(rawProgress, 0), 1);
      
      setScrollProgress(clamped);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCommandRun = (cmd) => {
    const cleanCmd = cmd.trim().toLowerCase();
    if (!cleanCmd) return;

    let response = [];
    switch (cleanCmd) {
      case "help":
        response = [
          { type: "output", text: "Available commands:" },
          { type: "info", text: "  services   - List freelance software & automation offerings" },
          { type: "info", text: "  n8n        - Inspect workflow automation capabilities" },
          { type: "info", text: "  projects   - Show deployed client and academic systems" },
          { type: "info", text: "  stack      - Display core engineering tech stack" },
          { type: "info", text: "  contact    - Get direct email and booking links" },
          { type: "info", text: "  clear      - Clear the terminal screen" },
        ];
        break;
      case "services":
        response = [
          { type: "output", text: "🚀 Freelance Engineering Services:" },
          { type: "info", text: "  1. n8n Business Automation (Webhooks, CRM, WhatsApp/Slack, ERP sync)" },
          { type: "info", text: "  2. Full-Stack Web Applications (React 19 + Python Django)" },
          { type: "info", text: "  3. Custom Business Systems (Doctor-History, Suchus print shop ERP)" },
          { type: "info", text: "  4. High-Performance Landing Pages & Cloud Architecture" },
        ];
        break;
      case "n8n":
        response = [
          { type: "output", text: "⚡ n8n Workflow Automation Engine:" },
          { type: "info", text: "  • Zero-manual overhead: Connect APIs, payment webhooks, database ETL" },
          { type: "info", text: "  • Multi-channel alerts: WhatsApp, Telegram, Email, Notion sync" },
          { type: "info", text: "  • Self-hosted on Docker or Cloud with 99.9% uptime" },
        ];
        break;
      case "projects":
        response = [
          { type: "output", text: "📂 Recent Production Deliveries:" },
          { type: "info", text: "  • CLUD2025: UTN Institutional Forum (React + Django + Neon DB)" },
          { type: "info", text: "  • Suchus-Design: Commercial Print Shop Platform (Railway)" },
          { type: "info", text: "  • DocTor-History: Clinical Records Management System" },
          { type: "info", text: "  • Iron Bull Gym: Commercial Web App on Vercel" },
        ];
        break;
      case "stack":
        response = [
          { type: "output", text: "🛠️ Core Technologies:" },
          { type: "info", text: "  Frontend: React 19, JavaScript ES6+, Vite, CSS3/Tailwind" },
          { type: "info", text: "  Backend: Python, Django, Django REST Framework" },
          { type: "info", text: "  Automation: n8n, Webhooks, REST Integrations, Docker" },
          { type: "info", text: "  Databases & Cloud: PostgreSQL, MySQL, Railway, Vercel, AWS" },
        ];
        break;
      case "contact":
        response = [
          { type: "output", text: "📬 Direct Contact Channels:" },
          { type: "info", text: "  Email: valenxity@gmail.com" },
          { type: "info", text: "  LinkedIn: linkedin.com/in/valentín-garzaniti-216946238" },
          { type: "info", text: "  GitHub: github.com/Vgarzaniti" },
        ];
        break;
      case "clear":
        setTerminalHistory([]);
        setTerminalInput("");
        return;
      default:
        response = [
          { type: "error", text: `Command not found: "${cleanCmd}". Type 'help' for available commands.` },
        ];
        break;
    }

    setTerminalHistory((prev) => [
      ...prev,
      { type: "input", text: `garzaniti@it:~$ ${cmd}` },
      ...response,
    ]);
    setTerminalInput("");
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    handleCommandRun(terminalInput);
  };

  useEffect(() => {
    if (activeTab === "terminal" && terminalEndRef.current) {
      terminalEndRef.current.scrollTop = terminalEndRef.current.scrollHeight;
    }
  }, [terminalHistory, activeTab]);

  const scale = 0.86 + scrollProgress * 0.32;
  const rotateX = Math.max(0, 24 - scrollProgress * 24);
  const translateY = (1 - scrollProgress) * 30;
  const floatingCardsOpacity = Math.min(Math.max((scrollProgress - 0.15) / 0.4, 0), 1);
  const floatingCardsTranslate = (1 - scrollProgress) * 45;

  return (
    <div className="scroll-showcase-wrapper" ref={sectionRef}>
      <div className="scroll-showcase-sticky">
        <div className="showcase-header">
          <span className="showcase-pill">Interactive Developer Terminal</span>
          <h2 className="showcase-title">
            From <span className="highlight">n8n Automations</span> to{" "}
            <span className="highlight">Full-Stack Cloud Platforms</span>
          </h2>
          <p className="showcase-subtitle">
            Scroll to zoom into the workstation. Try the interactive terminal or inspect live code snippets.
          </p>
        </div>

        {/* 3D Scene Container */}
        <div className="scene-container">
          {/* Ambient Glow */}
          <div
            className="ambient-glow"
            style={{
              opacity: 0.4 + scrollProgress * 0.5,
              transform: `scale(${0.9 + scrollProgress * 0.4})`,
            }}
          />

          {/* 3D Laptop Device */}
          <div
            className="laptop-container"
            style={{
              transform: `perspective(1200px) rotateX(${rotateX}deg) translateY(${translateY}px) scale(${scale})`,
            }}
          >
            {/* Screen Lid */}
            <div className="laptop-screen">
              <div className="laptop-camera">
                <span className="camera-lens" />
              </div>

              {/* Window Bar */}
              <div className="editor-window-bar">
                <div className="window-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>

                {/* Tabs */}
                <div className="editor-tabs">
                  <button
                    onClick={() => setActiveTab("terminal")}
                    className={`editor-tab ${activeTab === "terminal" ? "active" : ""}`}
                  >
                    <span className="tab-icon">⚡</span>
                    <span className="tab-name">interactive_terminal.sh</span>
                    <span className="tab-badge">CLI Play</span>
                  </button>

                  {Object.entries(CODE_SNIPPETS).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`editor-tab ${activeTab === key ? "active" : ""}`}
                    >
                      <span className="tab-icon">
                        {key === "backend" ? "🐍" : key === "frontend" ? "⚛️" : key === "n8n" ? "🔄" : "☁️"}
                      </span>
                      <span className="tab-name">{item.filename}</span>
                      <span className="tab-badge">{item.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor / Terminal Content */}
              {activeTab === "terminal" ? (
                <div className="terminal-body" ref={terminalEndRef}>
                  <div className="terminal-quick-actions">
                    <span className="quick-label">Try commands:</span>
                    <button onClick={() => handleCommandRun("services")} className="quick-chip">services</button>
                    <button onClick={() => handleCommandRun("n8n")} className="quick-chip">n8n</button>
                    <button onClick={() => handleCommandRun("projects")} className="quick-chip">projects</button>
                    <button onClick={() => handleCommandRun("stack")} className="quick-chip">stack</button>
                    <button onClick={() => handleCommandRun("contact")} className="quick-chip">contact</button>
                  </div>

                  <div className="terminal-lines">
                    {terminalHistory.map((item, index) => (
                      <div key={index} className={`terminal-line line-${item.type}`}>
                        {item.text}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleTerminalSubmit} className="terminal-prompt-form">
                    <span className="terminal-prompt">garzaniti@it:~$</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="Type 'help', 'services', 'n8n'..."
                      className="terminal-input"
                      autoComplete="off"
                    />
                    <button type="submit" className="terminal-send-btn">Run</button>
                  </form>
                </div>
              ) : (
                <div className="editor-body">
                  <div className="line-numbers">
                    {CODE_SNIPPETS[activeTab].code.split("\n").map((_, idx) => (
                      <span key={idx}>{idx + 1}</span>
                    ))}
                  </div>
                  <pre className="code-content">
                    <code>{CODE_SNIPPETS[activeTab].code}</code>
                  </pre>
                </div>
              )}

              {/* Status Bar */}
              <div className="editor-status-bar">
                <div className="status-item">
                  <span className="status-dot-live" />
                  <span>
                    {activeTab === "terminal"
                      ? "Interactive Shell • Connected"
                      : "main branch • 0 errors"}
                  </span>
                </div>
                <div className="status-item">
                  <span>UTF-8</span>
                  <span>
                    {activeTab === "terminal" ? "ZSH / Bash" : CODE_SNIPPETS[activeTab].badge}
                  </span>
                </div>
              </div>
            </div>

            {/* Laptop Base / Keyboard Bevel */}
            <div className="laptop-base">
              <div className="laptop-notch" />
            </div>
          </div>

          {/* 3D Floating Hologram Cards */}
          <div
            className="floating-cards-layer"
            style={{
              opacity: floatingCardsOpacity,
              pointerEvents: floatingCardsOpacity > 0.5 ? "auto" : "none",
            }}
          >
            {/* Floating Card 1: n8n Automations */}
            <div
              className="floating-card card-left"
              style={{
                transform: `translate3d(0, ${floatingCardsTranslate}px, 60px) rotateY(8deg)`,
              }}
            >
              <div className="card-header">
                <span className="card-icon">🔄</span>
                <span className="card-title">n8n Automation</span>
                <span className="badge-online">Active</span>
              </div>
              <p className="card-desc">
                Automating business processes, webhook triggers, CRM pipelines & WhatsApp sync.
              </p>
              <div className="card-metric">
                <span>Task Reduction: <strong>~85%</strong></span>
                <span>Uptime: <strong>99.9%</strong></span>
              </div>
            </div>

            {/* Floating Card 2: Production Pipeline */}
            <div
              className="floating-card card-right"
              style={{
                transform: `translate3d(0, ${floatingCardsTranslate * 0.8}px, 70px) rotateY(-8deg)`,
              }}
            >
              <div className="card-header">
                <span className="card-icon">⚡</span>
                <span className="card-title">Cloud Full-Stack</span>
                <span className="badge-build">Passing</span>
              </div>
              <div className="terminal-mini">
                <div className="terminal-row">
                  <span className="t-green">✔</span> React 19 Frontend on Vercel
                </div>
                <div className="terminal-row">
                  <span className="t-green">✔</span> Django REST API on Railway
                </div>
                <div className="terminal-row">
                  <span className="t-accent">→</span> Serverless PostgreSQL (Neon)
                </div>
              </div>
            </div>

            {/* Floating Card 3: Full-Stack Stack Badges */}
            <div
              className="floating-card card-bottom"
              style={{
                transform: `translate3d(-50%, ${floatingCardsTranslate * 0.5}px, 80px)`,
              }}
            >
              <div className="card-stack-row">
                <span className="stack-chip">n8n Workflows</span>
                <span className="stack-chip">React 19</span>
                <span className="stack-chip">Python / Django</span>
                <span className="stack-chip">Custom ERP & CRM</span>
                <span className="stack-chip">Railway & Vercel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator Prompt */}
        <div
          className="scroll-hint"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 2.5) }}
        >
          <span className="mouse-icon">
            <span className="wheel" />
          </span>
          <span>Scroll to expand the view</span>
        </div>
      </div>
    </div>
  );
}
