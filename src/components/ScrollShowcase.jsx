import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
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
    filename: "deploy/railway.toml",
    language: "toml",
    badge: "Railway & Vercel",
    code: `[build]
builder = "NIXPACKS"
buildCommand = "npm run build && python manage.py collectstatic --noinput"

[deploy]
startCommand = "gunicorn core.wsgi:application --bind 0.0.0.0:$PORT --workers 4"
healthcheckPath = "/api/v1/health"
healthcheckTimeout = 120
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 5`,
  },
};

export default function ScrollShowcase() {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);
  const terminalEndRef = useRef(null);
  const [activeTab, setActiveTab] = useState("backend");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Terminal State
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState(() => [
    {
      type: "system",
      text:
        language === "es"
          ? "Garzaniti IT Shell Interactivo v2.4"
          : "Garzaniti IT Interactive Shell v2.4",
    },
    {
      type: "system",
      text:
        language === "es"
          ? "Escribí 'help' o hacé clic en los botones para explorar stack y servicios."
          : "Type 'help' or click quick actions to explore stack & freelance services.",
    },
    {
      type: "output",
      text: language === "es" ? "Listo. Escribí un comando:" : "Ready. Type a command below:",
    },
  ]);

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
    const isEs = language === "es";

    switch (cleanCmd) {
      case "help":
        response = [
          { type: "output", text: isEs ? "Comandos disponibles:" : "Available commands:" },
          {
            type: "info",
            text: isEs
              ? "  services   - Lista de servicios de software y automatización"
              : "  services   - List freelance software & automation offerings",
          },
          {
            type: "info",
            text: isEs
              ? "  n8n        - Capacidades del motor de automatización"
              : "  n8n        - Inspect workflow automation capabilities",
          },
          {
            type: "info",
            text: isEs
              ? "  projects   - Sistemas y plataformas desplegadas"
              : "  projects   - Show deployed client and academic systems",
          },
          {
            type: "info",
            text: isEs
              ? "  stack      - Tecnologías y herramientas principales"
              : "  stack      - Display core engineering tech stack",
          },
          {
            type: "info",
            text: isEs
              ? "  contact    - Correo, WhatsApp y enlaces directos"
              : "  contact    - Get direct email and booking links",
          },
          {
            type: "info",
            text: isEs
              ? "  clear      - Limpiar la pantalla de la terminal"
              : "  clear      - Clear the terminal screen",
          },
        ];
        break;
      case "services":
        response = [
          {
            type: "output",
            text: isEs ? "🚀 Servicios de Ingeniería Freelance:" : "🚀 Freelance Engineering Services:",
          },
          {
            type: "info",
            text: isEs
              ? "  1. Automatización n8n (Webhooks, CRM, WhatsApp/Slack, Sincronización ERP)"
              : "  1. n8n Business Automation (Webhooks, CRM, WhatsApp/Slack, ERP sync)",
          },
          {
            type: "info",
            text: isEs
              ? "  2. Aplicaciones Web Full-Stack (React 19 + Python Django)"
              : "  2. Full-Stack Web Applications (React 19 + Python Django)",
          },
          {
            type: "info",
            text: isEs
              ? "  3. Sistemas de Gestión a Medida (DocTor-History, MAS Control)"
              : "  3. Custom Business Systems (DocTor-History, MAS Control ERP)",
          },
          {
            type: "info",
            text: isEs
              ? "  4. Landing Pages de Alta Conversión y Arquitectura Cloud"
              : "  4. High-Performance Landing Pages & Cloud Architecture",
          },
        ];
        break;
      case "n8n":
        response = [
          {
            type: "output",
            text: isEs
              ? "⚡ Motor de Automatización n8n:"
              : "⚡ n8n Workflow Automation Engine:",
          },
          {
            type: "info",
            text: isEs
              ? "  • Cero carga manual: Conexión de APIs, webhooks de cobro, ETL en PostgreSQL"
              : "  • Zero-manual overhead: Connect APIs, payment webhooks, database ETL",
          },
          {
            type: "info",
            text: isEs
              ? "  • Alertas multicanal: WhatsApp Cloud API, Telegram, Email, Notion"
              : "  • Multi-channel alerts: WhatsApp, Telegram, Email, Notion sync",
          },
          {
            type: "info",
            text: isEs
              ? "  • Auto-hospedado en Docker o Cloud con 99.9% uptime"
              : "  • Self-hosted on Docker or Cloud with 99.9% uptime",
          },
        ];
        break;
      case "projects":
        response = [
          {
            type: "output",
            text: isEs ? "📂 Entregas & Repositorios Destacados:" : "📂 Featured Projects & Repositories:",
          },
          {
            type: "info",
            text: isEs
              ? "  • CLUD2025: Foro Institucional UTN (React + Django REST + Neon DB • Demo en Vivo)"
              : "  • CLUD2025: UTN Institutional Forum (React + Django REST + Neon DB • Live Demo)",
          },
          {
            type: "info",
            text: isEs
              ? "  • CineMind: Hub Inteligente de Recomendación de Películas (React 19 + Python • Demo en Vivo)"
              : "  • CineMind: Intelligent Film Recommendation Hub (React 19 + Python • Live Demo)",
          },
          {
            type: "info",
            text: isEs
              ? "  • ART-scan: Realidad Aumentada & Control de Stock (WebAR + TensorFlow.js • Repo)"
              : "  • ART-scan: WebAR Inventory System (WebAR + TensorFlow.js • Repo)",
          },
          {
            type: "info",
            text: isEs
              ? "  • ATV: Motor Algorítmico Determinístico para DJs (Python + NumPy + Grafos • Repo)"
              : "  • ATV: Deterministic Autonomous DJ Engine (Python + NumPy + Graphs • Repo)",
          },
          {
            type: "info",
            text: isEs
              ? "  • DocTor-History: Gestión Médica y Reportes PDF (Python + MySQL + ReportLab • Repo)"
              : "  • DocTor-History: Medical Clinical Records & PDF Reporting (Python + MySQL • Repo)",
          },
          {
            type: "info",
            text: isEs
              ? "  • MAS Control: Control Operativo de Extintores & Trazabilidad (React + Python + QR • Repo)"
              : "  • MAS Control: Industrial Fire Safety & Extinguisher ERP (React + Python + QR • Repo)",
          },
        ];
        break;
      case "stack":
        response = [
          {
            type: "output",
            text: isEs ? "🛠️ Tecnologías Principales:" : "🛠️ Core Technologies:",
          },
          {
            type: "info",
            text: "  Frontend: React 19, JavaScript ES6+, Vite, CSS3/Glassmorphism",
          },
          {
            type: "info",
            text: "  Backend: Python, Django, Django REST Framework, JWT",
          },
          {
            type: "info",
            text: "  Automation: n8n, Webhooks, WhatsApp Cloud API, Docker",
          },
          {
            type: "info",
            text: "  Databases & Cloud: PostgreSQL, Neon, MySQL, Railway, Vercel, AWS",
          },
        ];
        break;
      case "contact":
        response = [
          {
            type: "output",
            text: isEs ? "📬 Canales de Contacto Directo:" : "📬 Direct Contact Channels:",
          },
          { type: "info", text: "  Email: valenxity@gmail.com" },
          { type: "info", text: "  WhatsApp: +54 221 354 2002" },
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
          {
            type: "error",
            text: isEs
              ? `Comando no reconocido: "${cleanCmd}". Escribí 'help' para ver la lista.`
              : `Command not found: "${cleanCmd}". Type 'help' for available commands.`,
          },
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

  const scale = 0.88 + scrollProgress * 0.14;
  const rotateX = Math.max(0, 18 - scrollProgress * 18);
  const translateY = (1 - scrollProgress) * 20;
  const floatingCardsOpacity = Math.min(Math.max((scrollProgress - 0.15) / 0.4, 0), 1);
  const floatingCardsTranslate = (1 - scrollProgress) * 35;

  return (
    <div id="showcase" className="scroll-showcase-wrapper" ref={sectionRef}>
      <div className="scroll-showcase-sticky">
        <div className="showcase-header">
          <span className="showcase-pill">{t.showcase.pill}</span>
          <h2 className="showcase-title">{t.showcase.title}</h2>
          <p className="showcase-subtitle">{t.showcase.desc}</p>
        </div>

        {/* 3D Scene Container */}
        <div className="scene-container">
          <div
            className="laptop-3d"
            style={{
              transform: `translate3d(0, ${translateY}px, 0) rotateX(${rotateX}deg) scale(${scale})`,
            }}
          >
            {/* Screen Lid */}
            <div className="laptop-screen">
              {/* Webcam */}
              <div className="screen-bezel-top">
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
                    type="button"
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
                      type="button"
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
                    <span className="quick-label">
                      {language === "es" ? "Comandos rápidos:" : "Try commands:"}
                    </span>
                    <button type="button" onClick={() => handleCommandRun("services")} className="quick-chip">services</button>
                    <button type="button" onClick={() => handleCommandRun("n8n")} className="quick-chip">n8n</button>
                    <button type="button" onClick={() => handleCommandRun("projects")} className="quick-chip">projects</button>
                    <button type="button" onClick={() => handleCommandRun("stack")} className="quick-chip">stack</button>
                    <button type="button" onClick={() => handleCommandRun("contact")} className="quick-chip">contact</button>
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
                      placeholder={
                        language === "es"
                          ? "Escribí 'help', 'services', 'n8n'..."
                          : "Type 'help', 'services', 'n8n'..."
                      }
                      className="terminal-input"
                      autoComplete="off"
                    />
                    <button type="submit" className="terminal-send-btn">
                      {language === "es" ? "Ejecutar" : "Run"}
                    </button>
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
                      ? language === "es"
                        ? "Shell Interactivo • Conectado"
                        : "Interactive Shell • Connected"
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

            {/* Laptop Base & Keyboard Plate */}
            <div className="laptop-base">
              <div className="keyboard-well">
                <div className="keyboard-grid-mockup" />
                <div className="trackpad" />
              </div>
            </div>
          </div>

          {/* Floating Feature Hologram Cards */}
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
                <span className="card-title">{t.showcase.cardAutomation.title}</span>
                <span className="badge-online">{t.showcase.cardAutomation.badge}</span>
              </div>
              <p className="card-desc">{t.showcase.cardAutomation.desc}</p>
              <div className="card-metric">
                <span>{t.showcase.cardAutomation.taskReduction} <strong>~85%</strong></span>
                <span>{t.showcase.cardAutomation.uptime} <strong>99.9%</strong></span>
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
                <span className="card-title">{t.showcase.cardCloud.title}</span>
                <span className="badge-build">{t.showcase.cardCloud.badge}</span>
              </div>
              <div className="terminal-mini">
                <div className="terminal-row">
                  <span className="t-green">✔</span> {t.showcase.cardCloud.item1}
                </div>
                <div className="terminal-row">
                  <span className="t-green">✔</span> {t.showcase.cardCloud.item2}
                </div>
                <div className="terminal-row">
                  <span className="t-accent">→</span> {t.showcase.cardCloud.item3}
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
                <span className="stack-chip">PostgreSQL & Neon</span>
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
          <span>{t.showcase.scrollHint}</span>
        </div>
      </div>
    </div>
  );
}
