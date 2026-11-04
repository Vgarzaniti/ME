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
  const eyesGroupRef = useRef(null);
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

    const width = 140;
    const height = 140;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.22, 3.1);

    // Renderer (graceful fallback if WebGL is unavailable or in test environment)
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 3-Point Studio Lighting (Key, Fill, Rim Light)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    // Warm Key Light (top right)
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    keyLight.position.set(2.5, 3.5, 2.5);
    scene.add(keyLight);

    // Cool Soft Fill Light (left)
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.2);
    fillLight.position.set(-2.5, 1.5, 1.5);
    scene.add(fillLight);

    // Vibrant Mint Rim Light (back) - highlights hair silhouette and shoulders
    const rimLight = new THREE.DirectionalLight(0x00ff88, 2.8);
    rimLight.position.set(0, 2.5, -2.5);
    scene.add(rimLight);

    // Master avatar group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);
    avatarRef.current = masterGroup;

    // Holographic Base Ring Platform
    const holoRingGroup = new THREE.Group();
    holoRingGroup.position.y = -0.82;
    masterGroup.add(holoRingGroup);

    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.8,
    });
    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.025, 16, 64), ringMat);
    innerRing.rotation.x = Math.PI / 2;
    holoRingGroup.add(innerRing);

    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });
    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.015, 16, 64), outerRingMat);
    outerRing.rotation.x = Math.PI / 2;
    holoRingGroup.add(outerRing);

    // Contact shadow disc on floor
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
    });
    const shadowDisc = new THREE.Mesh(new THREE.CircleGeometry(0.7, 32), shadowMat);
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = -0.01;
    holoRingGroup.add(shadowDisc);

    // Try loading custom GLB if present, otherwise build polished stylized human character
    let customModelLoaded = false;
    const loader = new GLTFLoader();

    const buildStylizedHumanAvatar = () => {
      if (customModelLoaded) return;

      const bodyGroup = new THREE.Group();
      masterGroup.add(bodyGroup);

      // --- High-End Stylized Materials ---
      // Warm, natural skin with soft sub-surface sheen
      const skinMat = new THREE.MeshStandardMaterial({
        color: 0xf0c2a2,
        roughness: 0.52,
        metalness: 0.04,
      });

      // Dark espresso hair with subtle specular gloss
      const hairMat = new THREE.MeshStandardMaterial({
        color: 0x1d1410,
        roughness: 0.58,
        metalness: 0.12,
      });

      // Neat facial hair stubble & eyebrows
      const beardMat = new THREE.MeshStandardMaterial({
        color: 0x231712,
        roughness: 0.72,
        metalness: 0.08,
      });

      // Dark charcoal tech crewneck / t-shirt
      const shirtMat = new THREE.MeshStandardMaterial({
        color: 0x1e2430,
        roughness: 0.75,
        metalness: 0.1,
      });

      // Cyber mint accent trim
      const accentMat = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        roughness: 0.3,
        metalness: 0.4,
        emissive: 0x00ff88,
        emissiveIntensity: 0.25,
      });

      // Expressive eyes
      const eyeWhiteMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.2,
      });
      const irisMat = new THREE.MeshStandardMaterial({
        color: 0x3d261a,
        roughness: 0.15,
        metalness: 0.1,
      });
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0f0b09 });
      const catchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

      // --- Torso & Shoulders (Sculpted Developer Bust) ---
      const torsoGroup = new THREE.Group();
      torsoGroup.position.set(0, -0.62, 0);
      bodyGroup.add(torsoGroup);

      // Main chest/torso
      const chestGeo = new THREE.CylinderGeometry(0.52, 0.64, 0.65, 32);
      chestGeo.scale(1.15, 1, 0.78);
      const chestMesh = new THREE.Mesh(chestGeo, shirtMat);
      torsoGroup.add(chestMesh);

      // Left Shoulder Cap
      const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), shirtMat);
      leftShoulder.scale.set(1.1, 0.9, 0.9);
      leftShoulder.position.set(-0.55, 0.2, 0);
      torsoGroup.add(leftShoulder);

      // Right Shoulder Cap
      const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), shirtMat);
      rightShoulder.scale.set(1.1, 0.9, 0.9);
      rightShoulder.position.set(0.55, 0.2, 0);
      torsoGroup.add(rightShoulder);

      // Crewneck Collar Rim
      const collarGeo = new THREE.TorusGeometry(0.25, 0.035, 16, 32);
      collarGeo.scale(1.1, 0.8, 1);
      const collarMesh = new THREE.Mesh(collarGeo, accentMat);
      collarMesh.rotation.x = Math.PI / 2;
      collarMesh.position.set(0, 0.34, 0.02);
      torsoGroup.add(collarMesh);

      // Neck
      const neckGeo = new THREE.CylinderGeometry(0.17, 0.2, 0.28, 24);
      neckGeo.scale(1, 1, 0.9);
      const neckMesh = new THREE.Mesh(neckGeo, skinMat);
      neckMesh.position.set(0, -0.16, 0.01);
      bodyGroup.add(neckMesh);

      // --- Head & Face Group (Follows Cursor Tracking) ---
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.16, 0);
      bodyGroup.add(headGroup);
      headRef.current = headGroup;

      // Base Cranium / Head
      const headGeo = new THREE.SphereGeometry(0.42, 32, 32);
      headGeo.scale(0.88, 1.05, 0.94);
      const headMesh = new THREE.Mesh(headGeo, skinMat);
      headGroup.add(headMesh);

      // Defined Jawline & Chin
      const chinGeo = new THREE.SphereGeometry(0.2, 24, 24);
      chinGeo.scale(1.1, 0.75, 0.95);
      const chinMesh = new THREE.Mesh(chinGeo, skinMat);
      chinMesh.position.set(0, -0.26, 0.17);
      headGroup.add(chinMesh);

      // Stylized Ears
      const earGeo = new THREE.SphereGeometry(0.1, 16, 16);
      earGeo.scale(0.4, 0.9, 0.6);

      const leftEar = new THREE.Mesh(earGeo, skinMat);
      leftEar.position.set(-0.38, 0.02, -0.02);
      leftEar.rotation.y = -0.2;
      headGroup.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, skinMat);
      rightEar.position.set(0.38, 0.02, -0.02);
      rightEar.rotation.y = 0.2;
      headGroup.add(rightEar);

      // --- Wavy Styled Hair (Cohesive Sculpted Volume) ---
      const hairGroup = new THREE.Group();
      headGroup.add(hairGroup);

      // Main Hair Cap Volume
      const mainHairGeo = new THREE.SphereGeometry(0.44, 28, 28, 0, Math.PI * 2, 0, Math.PI * 0.58);
      mainHairGeo.scale(0.92, 1.08, 0.98);
      const mainHairMesh = new THREE.Mesh(mainHairGeo, hairMat);
      mainHairMesh.position.set(0, 0.06, -0.03);
      hairGroup.add(mainHairMesh);

      // Back Taper
      const backHairGeo = new THREE.SphereGeometry(0.36, 20, 20, 0, Math.PI * 2, Math.PI * 0.4, Math.PI * 0.45);
      backHairGeo.scale(0.95, 1, 0.95);
      const backHairMesh = new THREE.Mesh(backHairGeo, hairMat);
      backHairMesh.position.set(0, -0.08, -0.1);
      hairGroup.add(backHairMesh);

      // Curled Front Wavy Locks (Sculpted flowing waves matching photo)
      const frontWaveCurls = [
        // Front center crest (prominent wavy volume)
        { x: 0, y: 0.42, z: 0.22, sx: 0.22, sy: 0.16, sz: 0.18, rz: 0.1 },
        { x: -0.14, y: 0.41, z: 0.2, sx: 0.19, sy: 0.15, sz: 0.16, rz: -0.2 },
        { x: 0.14, y: 0.4, z: 0.2, sx: 0.19, sy: 0.15, sz: 0.16, rz: 0.25 },
        // Front forehead curl sweep
        { x: -0.05, y: 0.34, z: 0.34, sx: 0.14, sy: 0.11, sz: 0.12, rz: 0.3 },
        { x: 0.08, y: 0.33, z: 0.33, sx: 0.13, sy: 0.1, sz: 0.12, rz: -0.2 },
        // Side volume
        { x: -0.26, y: 0.32, z: 0.16, sx: 0.16, sy: 0.14, sz: 0.15, rz: -0.35 },
        { x: 0.26, y: 0.31, z: 0.16, sx: 0.16, sy: 0.14, sz: 0.15, rz: 0.35 },
        // Top crown lifts
        { x: -0.08, y: 0.48, z: 0.06, sx: 0.2, sy: 0.15, sz: 0.18, rz: 0.15 },
        { x: 0.08, y: 0.49, z: 0.04, sx: 0.2, sy: 0.15, sz: 0.18, rz: -0.15 },
      ];

      frontWaveCurls.forEach(({ x, y, z, sx, sy, sz, rz }) => {
        const curlMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), hairMat);
        curlMesh.scale.set(sx, sy, sz);
        curlMesh.position.set(x, y, z);
        curlMesh.rotation.z = rz;
        hairGroup.add(curlMesh);
      });

      // --- Eyes (Expressive, Warm & Lifelike) ---
      const eyesGroup = new THREE.Group();
      headGroup.add(eyesGroup);
      eyesGroupRef.current = eyesGroup;

      const createEye = (isLeft) => {
        const sign = isLeft ? -1 : 1;
        const eyeUnit = new THREE.Group();
        eyeUnit.position.set(sign * 0.155, 0.04, 0.34);

        // Sclera (White of eye)
        const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), eyeWhiteMat);
        sclera.scale.set(1.2, 0.72, 0.6);
        eyeUnit.add(sclera);

        // Iris (Rich warm brown)
        const iris = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 16), irisMat);
        iris.scale.set(1, 1, 0.35);
        iris.position.set(0, 0, 0.035);
        eyeUnit.add(iris);

        // Pupil (Deep dark core)
        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.024, 16, 16), pupilMat);
        pupil.scale.set(1, 1, 0.35);
        pupil.position.set(0, 0, 0.048);
        eyeUnit.add(pupil);

        // Catchlight (Bright white life sparkle)
        const catchlight = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 10), catchlightMat);
        catchlight.position.set(0.014, 0.014, 0.055);
        eyeUnit.add(catchlight);

        return eyeUnit;
      };

      const leftEye = createEye(true);
      const rightEye = createEye(false);
      eyesGroup.add(leftEye);
      eyesGroup.add(rightEye);

      // --- Arched Eyebrows (Sculpted matching photo) ---
      const browMat = beardMat;
      const browGeo = new THREE.BoxGeometry(0.14, 0.024, 0.03);

      const leftBrow = new THREE.Mesh(browGeo, browMat);
      leftBrow.position.set(-0.16, 0.12, 0.36);
      leftBrow.rotation.z = 0.08;
      headGroup.add(leftBrow);

      const rightBrow = new THREE.Mesh(browGeo, browMat);
      rightBrow.position.set(0.16, 0.12, 0.36);
      rightBrow.rotation.z = -0.08;
      headGroup.add(rightBrow);

      // Nose Contour (Soft minimal nose)
      const noseGeo = new THREE.CylinderGeometry(0.03, 0.05, 0.14, 12);
      noseGeo.scale(1, 1, 0.7);
      const noseMesh = new THREE.Mesh(noseGeo, skinMat);
      noseMesh.position.set(0, -0.02, 0.4);
      noseMesh.rotation.x = -0.25;
      headGroup.add(noseMesh);

      // --- Beard & Mustache (Neat Minimalist Facial Hair) ---
      const facialHairGroup = new THREE.Group();
      headGroup.add(facialHairGroup);

      // Mustache (curved bar above lips)
      const stacheGeo = new THREE.BoxGeometry(0.16, 0.03, 0.04);
      const mustache = new THREE.Mesh(stacheGeo, beardMat);
      mustache.position.set(0, -0.11, 0.38);
      facialHairGroup.add(mustache);

      // Chin goatee / beard patch
      const goateeGeo = new THREE.SphereGeometry(0.14, 16, 16);
      goateeGeo.scale(1.2, 0.8, 0.6);
      const goatee = new THREE.Mesh(goateeGeo, beardMat);
      goatee.position.set(0, -0.27, 0.26);
      facialHairGroup.add(goatee);

      // Jawline beard contour
      const jawBeardGeo = new THREE.TorusGeometry(0.32, 0.04, 12, 32, Math.PI * 0.9);
      jawBeardGeo.scale(0.85, 0.9, 0.85);
      const jawBeard = new THREE.Mesh(jawBeardGeo, beardMat);
      jawBeard.rotation.x = Math.PI * 0.6;
      jawBeard.position.set(0, -0.16, 0.1);
      facialHairGroup.add(jawBeard);

      // Friendly Smile Line
      const mouthGeo = new THREE.TorusGeometry(0.06, 0.01, 8, 16, Math.PI * 0.7);
      const mouthMat = new THREE.MeshStandardMaterial({ color: 0xc47b6a, roughness: 0.6 });
      const mouth = new THREE.Mesh(mouthGeo, mouthMat);
      mouth.rotation.x = Math.PI * 0.9;
      mouth.rotation.z = -Math.PI * 0.15;
      mouth.position.set(0, -0.17, 0.38);
      headGroup.add(mouth);
    };

    // Try loading custom model if URL is resolvable, otherwise build stylized human avatar
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
          buildStylizedHumanAvatar();
        }
      );
    } catch {
      buildStylizedHumanAvatar();
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

      // Gentle floating breathing motion
      let jumpOffset = 0;
      if (jumpAnimRef.current > 0) {
        jumpOffset = Math.sin(jumpAnimRef.current * Math.PI) * 0.35;
        jumpAnimRef.current = Math.max(0, jumpAnimRef.current - 0.04);
      }

      masterGroup.position.y = Math.sin(elapsed * 2.2) * 0.04 + jumpOffset;

      // Holographic ring rotations
      innerRing.rotation.z = elapsed * 0.8;
      outerRing.rotation.z = -elapsed * 0.45;
      innerRing.material.opacity = 0.6 + Math.sin(elapsed * 3) * 0.25;

      // Smooth gaze tracking
      if (headRef.current) {
        headRef.current.rotation.y += (targetRotY - headRef.current.rotation.y) * 0.08;
        headRef.current.rotation.x += (targetRotX - headRef.current.rotation.x) * 0.08;
      }

      // Natural eye blinking micro-animation every 4 seconds
      if (eyesGroupRef.current) {
        const blinkCycle = elapsed % 4.0;
        if (blinkCycle < 0.12) {
          eyesGroupRef.current.scale.y = 0.1;
        } else {
          eyesGroupRef.current.scale.y = 1.0;
        }
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
