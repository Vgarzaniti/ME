import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useLanguage } from "../context/LanguageContext";
import "../styles/VirtualAssistant.css";

export default function VirtualAssistant() {
  const { t, language } = useLanguage();
  const mountRef = useRef(null);

  // Assistant states
  const [isMinimized, setIsMinimized] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [tipIndex, setTipIndex] = useState(0);

  // Jump animation trigger ref for Three.js loop
  const jumpAnimRef = useRef(0);
  const avatarRef = useRef(null);
  const headRef = useRef(null);
  const bubbleTimeoutRef = useRef(null);

  // Show a speech bubble with auto-hide timer
  const showBubble = useCallback((text, duration = 8500) => {
    if (!text) return;
    setBubbleText(text);
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
    jumpAnimRef.current = 1.0;
    const tips = t.assistant?.idleTips || [];
    if (tips.length > 0) {
      const nextIndex = (tipIndex + 1) % tips.length;
      setTipIndex(nextIndex);
      showBubble(tips[nextIndex]);
    }
  };

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
              const contextualMsg = t.assistant?.contextual?.[id];
              if (contextualMsg) {
                showBubble(contextualMsg, 7000);
              }
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection, t.assistant, showBubble]);

  // Initial greeting after mounting
  useEffect(() => {
    const greetingTimer = setTimeout(() => {
      showBubble(t.assistant?.defaultGreeting || "¡Hola! 👋 Soy el clon 3D de Valentín.", 9000);
    }, 2500);

    return () => clearTimeout(greetingTimer);
  }, [t.assistant, showBubble]);

  // Periodic random tips every 28 seconds if idle
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isBubbleVisible && !isMinimized) {
        const tips = t.assistant?.idleTips || [];
        if (tips.length > 0) {
          const randTip = tips[Math.floor(Math.random() * tips.length)];
          showBubble(randTip, 8000);
        }
      }
    }, 28000);

    return () => clearInterval(interval);
  }, [isBubbleVisible, isMinimized, t.assistant, showBubble]);

  // Three.js 3D Avatar Render Engine
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 136;
    const height = 136;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 3.2);

    // Renderer (graceful fallback if WebGL is unavailable or in test environment)
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00ff88, 1.2);
    dirLight.position.set(2, 3, 2);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    rimLight.position.set(-2, 1, -1);
    scene.add(rimLight);

    // Master avatar group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);
    avatarRef.current = masterGroup;

    // Holographic Base Ring
    const ringGeo = new THREE.TorusGeometry(0.85, 0.025, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.75,
    });
    const holoRing = new THREE.Mesh(ringGeo, ringMat);
    holoRing.rotation.x = Math.PI / 2;
    holoRing.position.y = -0.78;
    masterGroup.add(holoRing);

    // Outer faint pulse ring
    const outerRingGeo = new THREE.TorusGeometry(1.05, 0.015, 16, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 2;
    outerRing.position.y = -0.82;
    masterGroup.add(outerRing);

    // Check if custom GLB exists, otherwise build stylized procedural avatar
    let customModelLoaded = false;
    const loader = new GLTFLoader();

    const buildProceduralAvatar = () => {
      if (customModelLoaded) return;

      const bodyGroup = new THREE.Group();
      masterGroup.add(bodyGroup);

      // Materials matching user photo (dark wavy hair, warm skin, charcoal t-shirt)
      const skinMat = new THREE.MeshStandardMaterial({
        color: 0xe0a885,
        roughness: 0.65,
        metalness: 0.05,
      });
      const hairMat = new THREE.MeshStandardMaterial({
        color: 0x1f1612,
        roughness: 0.85,
        metalness: 0.1,
      });
      const beardMat = new THREE.MeshStandardMaterial({
        color: 0x2c1f19,
        roughness: 0.9,
        metalness: 0.05,
      });
      const shirtMat = new THREE.MeshStandardMaterial({
        color: 0x27272a,
        roughness: 0.8,
        metalness: 0.1,
      });
      const eyeMat = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.1,
        metalness: 0.5,
      });
      const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

      // Torso & Shoulders (charcoal t-shirt)
      const torsoGeo = new THREE.CylinderGeometry(0.55, 0.65, 0.7, 24);
      const torsoMesh = new THREE.Mesh(torsoGeo, shirtMat);
      torsoMesh.position.y = -0.55;
      bodyGroup.add(torsoMesh);

      // Neck
      const neckGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.3, 16);
      const neckMesh = new THREE.Mesh(neckGeo, skinMat);
      neckMesh.position.y = -0.15;
      bodyGroup.add(neckMesh);

      // Head Group (rotates with cursor tracking)
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.18, 0);
      bodyGroup.add(headGroup);
      headRef.current = headGroup;

      // Head / Face
      const headGeo = new THREE.SphereGeometry(0.42, 24, 24);
      headGeo.scale(0.9, 1.05, 0.95);
      const headMesh = new THREE.Mesh(headGeo, skinMat);
      headGroup.add(headMesh);

      // Dark Wavy Hair - Sculpted curls & volume
      const hairCapGeo = new THREE.SphereGeometry(0.44, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.55);
      hairCapGeo.scale(0.95, 1.08, 1.0);
      const hairCapMesh = new THREE.Mesh(hairCapGeo, hairMat);
      hairCapMesh.position.set(0, 0.04, -0.02);
      headGroup.add(hairCapMesh);

      // Curly Hair Clusters (matching user's front wavy volume)
      const curls = [
        { x: 0, y: 0.44, z: 0.12, r: 0.16 },
        { x: -0.16, y: 0.42, z: 0.1, r: 0.14 },
        { x: 0.16, y: 0.41, z: 0.1, r: 0.14 },
        { x: -0.28, y: 0.32, z: 0.05, r: 0.13 },
        { x: 0.28, y: 0.31, z: 0.05, r: 0.13 },
        { x: -0.08, y: 0.46, z: 0.04, r: 0.15 },
        { x: 0.08, y: 0.47, z: 0.02, r: 0.15 },
      ];
      curls.forEach(({ x, y, z, r }) => {
        const curlGeo = new THREE.SphereGeometry(r, 12, 12);
        const curlMesh = new THREE.Mesh(curlGeo, hairMat);
        curlMesh.position.set(x, y, z);
        headGroup.add(curlMesh);
      });

      // Eyes
      const leftWhite = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 12), eyeWhiteMat);
      leftWhite.scale.set(1.2, 0.7, 0.6);
      leftWhite.position.set(-0.16, 0.04, 0.36);
      headGroup.add(leftWhite);

      const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), eyeMat);
      leftPupil.position.set(-0.16, 0.04, 0.395);
      headGroup.add(leftPupil);

      const rightWhite = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 12), eyeWhiteMat);
      rightWhite.scale.set(1.2, 0.7, 0.6);
      rightWhite.position.set(0.16, 0.04, 0.36);
      headGroup.add(rightWhite);

      const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), eyeMat);
      rightPupil.position.set(0.16, 0.04, 0.395);
      headGroup.add(rightPupil);

      // Eyebrows
      const browGeo = new THREE.BoxGeometry(0.13, 0.025, 0.04);
      const leftBrow = new THREE.Mesh(browGeo, beardMat);
      leftBrow.position.set(-0.16, 0.12, 0.38);
      leftBrow.rotation.z = 0.05;
      headGroup.add(leftBrow);

      const rightBrow = new THREE.Mesh(browGeo, beardMat);
      rightBrow.position.set(0.16, 0.12, 0.38);
      rightBrow.rotation.z = -0.05;
      headGroup.add(rightBrow);

      // Beard & Moustache (neatly trimmed stubble)
      const beardGeo = new THREE.SphereGeometry(0.39, 16, 16, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.45);
      beardGeo.scale(0.92, 1.05, 0.98);
      const beardMesh = new THREE.Mesh(beardGeo, beardMat);
      beardMesh.position.set(0, -0.06, 0.02);
      headGroup.add(beardMesh);

      // Dev glasses accent (minimalist developer touch)
      const glassesFrameMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
      const frameGeo = new THREE.TorusGeometry(0.09, 0.012, 10, 24);
      const leftGlass = new THREE.Mesh(frameGeo, glassesFrameMat);
      leftGlass.position.set(-0.16, 0.04, 0.4);
      headGroup.add(leftGlass);

      const rightGlass = new THREE.Mesh(frameGeo, glassesFrameMat);
      rightGlass.position.set(0.16, 0.04, 0.4);
      headGroup.add(rightGlass);

      const bridgeGeo = new THREE.BoxGeometry(0.08, 0.015, 0.01);
      const bridge = new THREE.Mesh(bridgeGeo, glassesFrameMat);
      bridge.position.set(0, 0.045, 0.4);
      headGroup.add(bridge);
    };

    // Try loading custom model if URL is resolvable, otherwise build procedural
    try {
      const origin = window.location?.origin && window.location.origin !== "null"
        ? window.location.origin
        : "";
      const modelPath = origin ? `${origin}/models/valentin.glb` : "/models/valentin.glb";

      loader.load(
        modelPath,
        (gltf) => {
          customModelLoaded = true;
          const model = gltf.scene;
          model.scale.set(1.2, 1.2, 1.2);
          model.position.set(0, -0.7, 0);
          masterGroup.add(model);
          headRef.current = model;
        },
        undefined,
        () => {
          buildProceduralAvatar();
        }
      );
    } catch {
      buildProceduralAvatar();
    }

    // Mouse Tracking Coordinates
    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = normX * 0.45;
      targetRotX = -normY * 0.3;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Animation Render Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Gentle breathing & floating
      let jumpOffset = 0;
      if (jumpAnimRef.current > 0) {
        jumpOffset = Math.sin(jumpAnimRef.current * Math.PI) * 0.35;
        jumpAnimRef.current = Math.max(0, jumpAnimRef.current - 0.04);
      }

      masterGroup.position.y = Math.sin(elapsed * 2.2) * 0.05 + jumpOffset;

      // Holographic ring rotations
      holoRing.rotation.z = elapsed * 0.8;
      outerRing.rotation.z = -elapsed * 0.4;
      holoRing.material.opacity = 0.55 + Math.sin(elapsed * 3) * 0.2;

      // Smooth gaze tracking
      if (headRef.current) {
        headRef.current.rotation.y += (targetRotY - headRef.current.rotation.y) * 0.08;
        headRef.current.rotation.x += (targetRotX - headRef.current.rotation.x) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <aside
      className={`virtual-assistant-container ${isMinimized ? "assistant-minimized" : ""}`}
      aria-label={t.assistant?.ariaLabel || "Asistente Virtual 3D"}
    >
      {/* Interactive Speech Bubble */}
      {isBubbleVisible && !isMinimized && (
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
          <p className="bubble-text">{bubbleText}</p>
          <div className="bubble-quick-actions">
            <a
              href="https://wa.me/5492213542002"
              target="_blank"
              rel="noreferrer"
              className="bubble-action-link"
            >
              💬 WhatsApp
            </a>
            <a href="#projects" className="bubble-action-link">
              🚀 {language === "es" ? "Proyectos" : "Projects"}
            </a>
          </div>
          <span className="bubble-tail" />
        </div>
      )}

      {/* Floating 3D Avatar Stage */}
      <div className="avatar-stage-wrapper">
        <button
          type="button"
          className="avatar-stage-btn"
          onClick={handleAvatarClick}
          title={t.assistant?.tooltipName || "Valentín 3D • Asistente Virtual"}
          aria-label={t.assistant?.tooltipName || "Interactuar con el avatar 3D"}
        >
          <div ref={mountRef} className="three-canvas-holder" />
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
