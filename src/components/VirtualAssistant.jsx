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
  const [hasWebGL3D, setHasWebGL3D] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  // 3D Tilt Coordinates (ref + state so WebGL loop never restarts on mousemove!)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const targetTiltRef = useRef({ rotateX: 0, rotateY: 0 });
  const isSpeakingRef = useRef(false);

  const bubbleTimeoutRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    isSpeakingRef.current = isBubbleVisible;
  }, [isBubbleVisible]);

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

  // Mouse move listener for smooth 3D parallax & head tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      const nextTilt = {
        rotateY: normX * 22,
        rotateX: -normY * 15,
      };
      targetTiltRef.current = nextTilt;
      setTilt(nextTilt);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Section observer for contextual assistant prompts
  useEffect(() => {
    const sectionIds = ["hero", "showcase", "services", "projects", "process", "about", "contact"];
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

  // React immediately to language switches
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

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

  // Real-Time Three.js 3D WebGL Engine (Loads reconstructed /models/valentin.glb with PBR lighting, breathing & head tracking)
  useEffect(() => {
    const container = threeMountRef.current;
    if (!container) return;

    let animId = null;
    let renderer = null;
    let isDisposed = false;

    try {
      const origin =
        window.location?.origin && window.location.origin !== "null"
          ? window.location.origin
          : "";
      const modelPath = origin ? `${origin}/models/valentin.glb` : "/models/valentin.glb";
      const normalPath = origin
        ? `${origin}/valentin-3d-normal.png`
        : "/valentin-3d-normal.png";

      const loader = new GLTFLoader();
      loader.load(
        modelPath,
        (gltf) => {
          if (isDisposed) return;

          const width = 124;
          const height = 138;
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
          camera.position.set(0, 0.02, 3.35);

          renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
          renderer.setSize(width, height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
            renderer.outputColorSpace = THREE.SRGBColorSpace;
          }

          container.innerHTML = "";
          container.appendChild(renderer.domElement);
          setHasWebGL3D(true);

          // Studio 3-Point Lighting + Dynamic Cursor Key Light
          const ambientLight = new THREE.AmbientLight(0xffffff, 1.55);
          scene.add(ambientLight);

          const keyLight = new THREE.DirectionalLight(0xfff8ed, 1.35);
          keyLight.position.set(1.5, 2.0, 3.5);
          scene.add(keyLight);

          const mintRimLight = new THREE.PointLight(0x00ff88, 2.2, 8);
          mintRimLight.position.set(-2.2, 1.4, 1.8);
          scene.add(mintRimLight);

          const cyanRimLight = new THREE.PointLight(0x38bdf8, 1.8, 8);
          cyanRimLight.position.set(2.2, -1.0, 1.8);
          scene.add(cyanRimLight);

          const model = gltf.scene;
          model.scale.set(1.12, 1.12, 1.15);
          model.position.set(0, -0.04, 0);

          // Optional Normal Map enrichment for crisp 3D curls, nose bridge & lapels
          try {
            const texLoader = new THREE.TextureLoader();
            texLoader.load(
              normalPath,
              (normalTex) => {
                normalTex.flipY = false;
                model.traverse((child) => {
                  if (child.isMesh && child.material) {
                    child.material.normalMap = normalTex;
                    child.material.normalScale = new THREE.Vector2(0.55, 0.55);
                    child.material.needsUpdate = true;
                  }
                });
              },
              undefined,
              () => {}
            );
          } catch {
            // Normal map is optional enhancement
          }

          scene.add(model);

          let currentRotX = 0;
          let currentRotY = 0;
          const startTime = performance.now();

          const animate = (now) => {
            if (isDisposed) return;
            animId = requestAnimationFrame(animate);

            const elapsed = (now - startTime) * 0.001;

            // Smooth spring interpolation toward cursor + subtle organic idle motion
            const idleYaw = Math.sin(elapsed * 1.4) * 3.2;
            const idlePitch = Math.cos(elapsed * 1.1) * 1.8;
            const targetY =
              ((targetTiltRef.current.rotateY + idleYaw) * Math.PI) / 180;
            const targetX =
              ((-targetTiltRef.current.rotateX + idlePitch) * Math.PI) / 180;

            currentRotY += (targetY - currentRotY) * 0.09;
            currentRotX += (targetX - currentRotX) * 0.09;

            model.rotation.y = currentRotY;
            model.rotation.x = currentRotX;

            // Organic breathing & talking micro-nod
            const breathY = Math.sin(elapsed * 2.3) * 0.025;
            const talkPulse = isSpeakingRef.current
              ? Math.sin(elapsed * 14.0) * 0.014
              : 0;
            model.position.y = -0.04 + breathY + talkPulse;

            const breathScale = 1.12 + Math.sin(elapsed * 2.3) * 0.012;
            model.scale.set(breathScale, breathScale + talkPulse * 0.4, 1.18);

            // Dynamic key light follows cursor so 3D specular highlights glide over face
            keyLight.position.x = 1.2 + (targetTiltRef.current.rotateY / 22) * 2.0;
            keyLight.position.y = 1.5 + (targetTiltRef.current.rotateX / 15) * 1.5;

            renderer.render(scene, camera);
          };

          animId = requestAnimationFrame(animate);
        },
        undefined,
        () => {
          setHasWebGL3D(false);
        }
      );
    } catch {
      setHasWebGL3D(false);
    }

    return () => {
      isDisposed = true;
      if (animId) cancelAnimationFrame(animId);
      if (renderer) {
        renderer.dispose();
        if (container && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

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
          <div
            className="avatar-3d-pod"
            style={{
              transform: `perspective(600px) rotateX(${tilt.rotateX * 0.45}deg) rotateY(${tilt.rotateY * 0.45}deg)`,
            }}
          >
            {/* Outer Glowing Cyber Ring */}
            <div className="pod-cyber-ring" />

            {/* Real-Time Three.js WebGL 3D Mesh Canvas */}
            <div
              ref={threeMountRef}
              className={`three-canvas-holder ${hasWebGL3D ? "webgl-active" : "webgl-hidden"}`}
            />

            {/* Fallback 2D image if WebGL context is unavailable (e.g. headless test runner) */}
            {!hasWebGL3D && (
              <div className="pod-character-wrapper">
                <img
                  src="/valentin-3d-avatar.png"
                  alt="Valentín Augusto Garzaniti 3D Avatar"
                  className="pod-avatar-img"
                  draggable="false"
                />
              </div>
            )}

            {/* Holographic Specular Glint */}
            <div
              className="pod-hologram-shine"
              style={{
                transform: `translateX(${tilt.rotateY * 2.2}px) translateY(${tilt.rotateX * 2.2}px)`,
              }}
            />

            {/* Status Indicator Chip */}
            <span className="pod-status-pill">
              <span className="status-dot-inner" /> 3D AI
            </span>
          </div>

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
