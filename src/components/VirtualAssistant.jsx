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

  // 3D Tilt & Expression Refs (updated at 60 FPS without recreating WebGL scene)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const targetTiltRef = useRef({ rotateX: 0, rotateY: 0 });
  const isSpeakingRef = useRef(false);
  const excitedUntilRef = useRef(0);

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
    excitedUntilRef.current = performance.now() + 1500;

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
    excitedUntilRef.current = performance.now() + 1800;
    setTimeout(() => setIsJumping(false), 600);

    const tips = t.assistant?.idleTips || [];
    if (tips.length > 0) {
      const nextIndex = (tipIndex + 1) % tips.length;
      setTipIndex(nextIndex);
      showBubble({ type: "tip", index: nextIndex });
    }
  };

  // Mouse move listener for smooth 3D head & eye gaze tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      const nextTilt = {
        rotateY: normX * 25,
        rotateX: -normY * 18,
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
    excitedUntilRef.current = performance.now() + 1600;
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

  // Ready Player Me 3D Skeleton & ARKit Blendshape Engine (Three.js WebGL)
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

      const loader = new GLTFLoader();
      loader.load(
        modelPath,
        (gltf) => {
          if (isDisposed) return;

          const width = 165;
          const height = 185;
          const scene = new THREE.Scene();

          // Framed squarely on the Ready Player Me Half-Body Bust (y: 0.42..0.75)
          const camera = new THREE.PerspectiveCamera(28, width / height, 0.05, 50);
          camera.position.set(0, 0.56, 0.76);
          camera.lookAt(0, 0.54, 0);

          renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
          renderer.setSize(width, height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
          if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
            renderer.outputColorSpace = THREE.SRGBColorSpace;
          }

          container.innerHTML = "";
          container.appendChild(renderer.domElement);
          setHasWebGL3D(true);

          // Studio 3-Point Lighting + Neon Rim Accents
          const ambientLight = new THREE.AmbientLight(0xffffff, 1.55);
          scene.add(ambientLight);

          const keyLight = new THREE.DirectionalLight(0xfff9f0, 1.65);
          keyLight.position.set(0.8, 1.2, 1.5);
          scene.add(keyLight);

          const mintRimLight = new THREE.PointLight(0x00ff88, 1.8, 4);
          mintRimLight.position.set(-0.9, 0.85, 0.5);
          scene.add(mintRimLight);

          const cyanRimLight = new THREE.PointLight(0x38bdf8, 1.4, 4);
          cyanRimLight.position.set(0.9, 0.45, 0.5);
          scene.add(cyanRimLight);

          const model = gltf.scene;
          scene.add(model);

          // Collect Ready Player Me Skeleton Bones & ARKit/Oculus Morph Target Meshes
          const bones = {
            head: null,
            neck: null,
            spine: null,
            leftEye: null,
            rightEye: null,
            leftHand: null,
            rightHand: null,
          };
          const morphMeshes = [];

          model.traverse((child) => {
            if (child.name === "Wolf3D_Avatar_Transparent") {
              child.visible = false;
            }
            if (child.isBone) {
              if (child.name === "Head") bones.head = child;
              else if (child.name === "Neck") bones.neck = child;
              else if (child.name === "Spine") bones.spine = child;
              else if (child.name === "LeftEye") bones.leftEye = child;
              else if (child.name === "RightEye") bones.rightEye = child;
              else if (child.name === "LeftHand") bones.leftHand = child;
              else if (child.name === "RightHand") bones.rightHand = child;
            }
            if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
              morphMeshes.push(child);
            }
          });

          // Park detached VR hands below viewport so only the clean bust & shoulders show
          if (bones.leftHand) bones.leftHand.scale.set(0, 0, 0);
          if (bones.rightHand) bones.rightHand.scale.set(0, 0, 0);

          const setMorph = (name, val) => {
            const clamped = Math.max(0, Math.min(1, val));
            for (let i = 0; i < morphMeshes.length; i++) {
              const m = morphMeshes[i];
              const idx = m.morphTargetDictionary[name];
              if (idx !== undefined) {
                m.morphTargetInfluences[idx] = clamped;
              }
            }
          };

          let smoothGazeX = 0;
          let smoothGazeY = 0;
          let nextBlinkAt = performance.now() + 1600;
          const blinkDuration = 150;
          let isDoubleBlink = false;
          const startTime = performance.now();

          const animate = (now) => {
            if (isDisposed) return;
            animId = requestAnimationFrame(animate);

            const elapsed = (now - startTime) * 0.001;

            // Smooth spring interpolation toward cursor (-1..1 normalized)
            const targetNormX = targetTiltRef.current.rotateY / 25;
            const targetNormY = targetTiltRef.current.rotateX / 18;
            smoothGazeX += (targetNormX - smoothGazeX) * 0.1;
            smoothGazeY += (targetNormY - smoothGazeY) * 0.1;

            // 1. Skeleton Bone Articulation (Head, Neck & Spine)
            const idleYaw = Math.sin(elapsed * 1.3) * 0.06;
            const idlePitch = Math.cos(elapsed * 1.0) * 0.04;
            const idleRoll = Math.sin(elapsed * 0.8) * 0.03;

            if (bones.neck) {
              bones.neck.rotation.y = smoothGazeX * 0.16 + idleYaw * 0.5;
              bones.neck.rotation.x = -smoothGazeY * 0.10 + idlePitch * 0.5;
              bones.neck.rotation.z = -smoothGazeX * 0.04 + idleRoll;
            }
            if (bones.head) {
              const talkNod = isSpeakingRef.current
                ? Math.sin(elapsed * 9.5) * 0.035
                : 0;
              bones.head.rotation.y = smoothGazeX * 0.24 + idleYaw;
              bones.head.rotation.x = -smoothGazeY * 0.16 + idlePitch + talkNod;
              bones.head.rotation.z = -smoothGazeX * 0.06 + idleRoll;
            }
            if (bones.spine) {
              // Subtle chest breathing & torso follow
              bones.spine.rotation.y = smoothGazeX * 0.08;
              bones.spine.rotation.x = Math.sin(elapsed * 2.2) * 0.022;
              bones.spine.position.y = 0.33 + Math.sin(elapsed * 2.2) * 0.004;
            }

            // 2. ARKit Eye Blinking (with occasional natural double-blink)
            let blinkVal = 0;
            if (now >= nextBlinkAt) {
              const bElapsed = now - nextBlinkAt;
              if (bElapsed <= blinkDuration) {
                blinkVal = Math.sin((bElapsed / blinkDuration) * Math.PI);
              } else if (isDoubleBlink && bElapsed <= blinkDuration * 2.3) {
                const b2 = bElapsed - blinkDuration * 1.3;
                if (b2 >= 0) {
                  blinkVal = Math.sin((b2 / blinkDuration) * Math.PI);
                }
              } else {
                nextBlinkAt = now + 2200 + Math.random() * 2800;
                isDoubleBlink = Math.random() < 0.28;
              }
            }
            setMorph("eyeBlinkLeft", blinkVal);
            setMorph("eyeBlinkRight", blinkVal);
            setMorph("eyesClosed", blinkVal * 0.85);

            // 3. ARKit Eye Gaze Blendshapes (Eyes track cursor smoothly!)
            const lookRight = Math.max(0, smoothGazeX);
            const lookLeft = Math.max(0, -smoothGazeX);
            const lookUp = Math.max(0, smoothGazeY);
            const lookDown = Math.max(0, -smoothGazeY);

            setMorph("eyeLookOutRight", lookRight * 0.75);
            setMorph("eyeLookInLeft", lookRight * 0.75);
            setMorph("eyeLookOutLeft", lookLeft * 0.75);
            setMorph("eyeLookInRight", lookLeft * 0.75);
            setMorph("eyeLookUpLeft", lookUp * 0.65);
            setMorph("eyeLookUpRight", lookUp * 0.65);
            setMorph("eyeLookDownLeft", lookDown * 0.65);
            setMorph("eyeLookDownRight", lookDown * 0.65);

            // 4. Friendly Smile, Expressive Brows & Oculus Viseme Lip-Sync
            const isSpeaking = isSpeakingRef.current;
            const isExcited = now < excitedUntilRef.current;

            const baseSmile = isExcited ? 0.68 : isSpeaking ? 0.38 : 0.46;
            setMorph("mouthSmile", baseSmile);
            setMorph("mouthSmileLeft", baseSmile * 0.85);
            setMorph("mouthSmileRight", baseSmile * 0.85);
            setMorph("cheekSquintLeft", baseSmile * 0.35);
            setMorph("cheekSquintRight", baseSmile * 0.35);

            const browLift =
              (isExcited ? 0.65 : 0.15) +
              (isSpeaking ? (Math.sin(elapsed * 5.5) * 0.5 + 0.5) * 0.38 : 0) +
              lookUp * 0.3;
            setMorph("browInnerUp", browLift);
            setMorph("browOuterUpLeft", browLift * 0.8);
            setMorph("browOuterUpRight", browLift * 0.8);

            if (isSpeaking) {
              const aa = Math.max(0, Math.sin(elapsed * 14.0)) * 0.55;
              const oh = Math.max(0, Math.cos(elapsed * 10.5)) * 0.42;
              const ee = Math.max(0, Math.sin(elapsed * 18.0 + 1.2)) * 0.38;
              setMorph("viseme_aa", aa);
              setMorph("viseme_O", oh);
              setMorph("viseme_E", ee);
              setMorph("jawOpen", (aa + oh) * 0.45);
              setMorph("mouthOpen", (aa + oh) * 0.5);
            } else {
              setMorph("viseme_aa", 0);
              setMorph("viseme_O", 0);
              setMorph("viseme_E", 0);
              setMorph("jawOpen", 0);
              setMorph("mouthOpen", 0);
            }

            // Dynamic key light follows cursor
            keyLight.position.x = 0.8 + smoothGazeX * 0.9;
            keyLight.position.y = 1.1 + smoothGazeY * 0.6;

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

      {/* Floating Frameless 3D Avatar Stage */}
      <div className="avatar-stage-wrapper">
        <button
          type="button"
          ref={avatarCardRef}
          className={`avatar-stage-btn ${isJumping ? "avatar-jumping" : ""}`}
          onClick={handleAvatarClick}
          title={t.assistant?.tooltipName || "Valentín 3D • Asistente Virtual"}
          aria-label={t.assistant?.tooltipName || "Valentín 3D • Asistente Virtual"}
        >
          <div className="avatar-3d-pod">
            {/* Real-Time Ready Player Me 3D Skeleton & ARKit Blendshape Canvas */}
            <div
              ref={threeMountRef}
              className={`three-canvas-holder ${hasWebGL3D ? "webgl-active" : "webgl-hidden"}`}
            />

            {/* Fallback 2D image if WebGL context is unavailable (e.g. headless test runner) */}
            {!hasWebGL3D && (
              <div
                className="pod-character-wrapper"
                style={{
                  transform: `perspective(600px) rotateX(${tilt.rotateX * 0.5}deg) rotateY(${tilt.rotateY * 0.5}deg)`,
                }}
              >
                <img
                  src="/valentin-3d-avatar.png"
                  alt="Valentín Augusto Garzaniti 3D Avatar"
                  className="pod-avatar-img"
                  draggable="false"
                />
              </div>
            )}
          </div>

          {/* Subtle Holographic Pedestal Glow under Bust */}
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
