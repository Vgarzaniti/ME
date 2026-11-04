import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useLanguage } from "../context/LanguageContext";
import "../styles/VirtualAssistant.css";

export default function VirtualAssistant() {
  const { t, language } = useLanguage();
  const threeMountRef = useRef(null);
  const avatarCardRef = useRef(null);

  // Assistant states
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeMessage, setActiveMessage] = useState(null);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [tipIndex, setTipIndex] = useState(0);
  const [hasGlbModel, setHasGlbModel] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  // 3D Tilt Coordinates
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const bubbleTimeoutRef = useRef(null);
  const isInitialMount = useRef(true);

  // Helper to resolve localized text from the active message descriptor
  const getMessageText = useCallback((msg, currentT) => {
    if (!msg || !currentT?.assistant) return "";
    switch (msg.type) {
      case "greeting":
        return currentT.assistant.defaultGreeting;
      case "contextual":
        return currentT.assistant.contextual?.[msg.section] || currentT.assistant.defaultGreeting;
      case "tip": {
        const tips = currentT.assistant.idleTips || [];
        return tips[msg.index % tips.length] || currentT.assistant.defaultGreeting;
      }
      case "langChange":
        return currentT.assistant.langChanged || currentT.assistant.defaultGreeting;
      default:
        return msg.custom || currentT.assistant.defaultGreeting;
    }
  }, []);

  // Show a speech bubble with auto-hide timer
  const showBubble = useCallback((msgDescriptor, duration = 8500) => {
    if (!msgDescriptor) return;
    setActiveMessage(msgDescriptor);
    setIsBubbleVisible(true);

    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }
    if (duration > 0) {
      bubbleTimeoutRef.current = setTimeout(() => {
        setIsBubbleVisible(false);
      }, duration);
    }
  }, []);

  const hideBubble = () => {
    setIsBubbleVisible(false);
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }
  };

  // Trigger jump animation and cycle tip
  const handleAvatarClick = () => {
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 600);

    const tips = t.assistant?.idleTips || [];
    if (tips.length > 0) {
      const nextIndex = (tipIndex + 1) % tips.length;
      setTipIndex(nextIndex);
      showBubble({ type: "tip", index: nextIndex });
    }
  };

  // Mouse move listener for smooth 3D parallax tilt
  useEffect(() => {
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      setTilt({
        rotateY: normX * 18,
        rotateX: -normY * 14,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Section observer for contextual assistant prompts
  useEffect(() => {
    const sectionIds = ["hero", "showcase", "services", "projects", "about", "contact"];
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportMid = scrollY + window.innerHeight * 0.35;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (viewportMid >= top - 120) {
            if (activeSection !== id) {
              setActiveSection(id);
              showBubble({ type: "contextual", section: id }, 7000);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection, showBubble]);

  // Initial greeting after mounting (defaulting to Spanish)
  useEffect(() => {
    const greetingTimer = setTimeout(() => {
      showBubble({ type: "greeting" }, 9000);
    }, 2200);

    return () => clearTimeout(greetingTimer);
  }, [showBubble]);

  // React immediately to language switches:
  // 1. Re-render any active bubble in the new language.
  // 2. Animate avatar jump and announce the language change!
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Avatar reacts and speaks in the newly chosen language
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 600);
    showBubble({ type: "langChange" }, 7500);
  }, [language, showBubble]);

  // Periodic random tips every 28 seconds if idle
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isBubbleVisible && !isMinimized) {
        const tips = t.assistant?.idleTips || [];
        if (tips.length > 0) {
          const randIndex = Math.floor(Math.random() * tips.length);
          showBubble({ type: "tip", index: randIndex }, 8000);
        }
      }
    }, 28000);

    return () => clearInterval(interval);
  }, [isBubbleVisible, isMinimized, t.assistant, showBubble]);

  // Check for GLB model availability (e.g. from Ready Player Me)
  useEffect(() => {
    const container = threeMountRef.current;
    if (!container) return;

    try {
      const origin = window.location?.origin && window.location.origin !== "null"
        ? window.location.origin
        : "";
      const modelPath = origin ? `${origin}/models/valentin.glb` : "/models/valentin.glb";

      const loader = new GLTFLoader();
      loader.load(
        modelPath,
        (gltf) => {
          setHasGlbModel(true);
          const width = 140;
          const height = 140;
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
          camera.position.set(0, 0.2, 3.0);

          const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
          renderer.setSize(width, height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          container.appendChild(renderer.domElement);

          const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
          scene.add(ambientLight);
          const dirLight = new THREE.DirectionalLight(0x00ff88, 1.8);
          dirLight.position.set(2, 3, 2);
          scene.add(dirLight);

          const model = gltf.scene;
          model.scale.set(1.2, 1.2, 1.2);
          model.position.set(0, -0.7, 0);
          scene.add(model);

          let animId;
          const animate = () => {
            animId = requestAnimationFrame(animate);
            model.rotation.y = (tilt.rotateY * Math.PI) / 180;
            model.rotation.x = (tilt.rotateX * Math.PI) / 180;
            renderer.render(scene, camera);
          };
          animate();

          return () => {
            cancelAnimationFrame(animId);
            renderer.dispose();
            if (container && renderer.domElement) {
              container.removeChild(renderer.domElement);
            }
          };
        },
        undefined,
        () => {
          setHasGlbModel(false);
        }
      );
    } catch {
      setHasGlbModel(false);
    }
  }, [tilt]);

  const renderedBubbleText = getMessageText(activeMessage, t);

  return (
    <aside
      className={`virtual-assistant-container ${isMinimized ? "assistant-minimized" : ""}`}
      aria-label={t.assistant?.ariaLabel || "Asistente Virtual 3D de Valentín"}
    >
      {/* Interactive Speech Bubble */}
      {isBubbleVisible && !isMinimized && renderedBubbleText && (
        <div className="assistant-speech-bubble" role="status" aria-live="polite">
          <button
            type="button"
            className="bubble-close-btn"
            onClick={hideBubble}
            aria-label={t.assistant?.closeAria || "Cerrar"}
          >
            ×
          </button>
          <div className="bubble-header">
            <span className="assistant-status-dot" />
            <span className="assistant-name">Valentín 3D</span>
            <span className="assistant-badge">{t.assistant?.statusOnline || "En línea"}</span>
          </div>
          <p className="bubble-text">{renderedBubbleText}</p>
          <div className="bubble-quick-actions">
            <a
              href="https://wa.me/5492213542002"
              target="_blank"
              rel="noreferrer"
              className="bubble-action-link"
            >
              💬 {t.assistant?.ctaWhatsApp || "WhatsApp"}
            </a>
            <a href="#projects" className="bubble-action-link">
              🚀 {t.assistant?.ctaProjects || "Proyectos"}
            </a>
          </div>
          <span className="bubble-tail" />
        </div>
      )}

      {/* Floating 3D Avatar Stage */}
      <div className="avatar-stage-wrapper">
        <button
          type="button"
          ref={avatarCardRef}
          className={`avatar-stage-btn ${isJumping ? "avatar-jumping" : ""}`}
          onClick={handleAvatarClick}
          title={t.assistant?.tooltipName || "Valentín 3D • Asistente Virtual"}
          aria-label={t.assistant?.tooltipName || "Valentín 3D • Asistente Virtual"}
        >
          {hasGlbModel ? (
            <div ref={threeMountRef} className="three-canvas-holder" />
          ) : (
            /* Pixar / Disney 3D Stylized Avatar with Real-Time Parallax Tilt */
            <div
              className="avatar-3d-pod"
              style={{
                transform: `perspective(600px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              }}
            >
              {/* Outer Glowing Cyber Ring */}
              <div className="pod-cyber-ring" />
              
              {/* Character Render */}
              <div className="pod-character-wrapper">
                <img
                  src="/valentin-3d-avatar.png"
                  alt="Valentín Augusto Garzaniti 3D Avatar"
                  className="pod-avatar-img"
                  draggable="false"
                />
              </div>

              {/* Holographic Specular Glint */}
              <div
                className="pod-hologram-shine"
                style={{
                  transform: `translateX(${tilt.rotateY * 2.5}px) translateY(${tilt.rotateX * 2.5}px)`,
                }}
              />

              {/* Status Indicator Chip */}
              <span className="pod-status-pill">
                <span className="status-dot-inner" /> AI
              </span>
            </div>
          )}

          {/* Holographic Floor Pulse Ring */}
          <div className="avatar-pulse-ring" />
        </button>

        {/* Toggle Minimize/Maximize Button */}
        <button
          type="button"
          className="assistant-toggle-btn"
          onClick={() => {
            setIsMinimized((prev) => !prev);
            setIsBubbleVisible(false);
          }}
          aria-label={t.assistant?.toggleAria || "Minimizar asistente"}
          title={isMinimized ? "Restaurar asistente" : "Minimizar asistente"}
        >
          {isMinimized ? "🤖" : "−"}
        </button>
      </div>
    </aside>
  );
}
