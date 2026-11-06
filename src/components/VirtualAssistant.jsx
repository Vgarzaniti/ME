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
    excitedUntilRef.current = performance.now() + 1400;

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

  // Mouse move listener for smooth 3D parallax & gaze tracking
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

  // Frameless Three.js 3D WebGL Engine with Live Facial Rigging (Eye Gaze, Blinking, Talking, Breathing & Neck Pivoting)
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

          const width = 165;
          const height = 185;
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
          camera.position.set(0, 0.04, 3.45);

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
          const ambientLight = new THREE.AmbientLight(0xffffff, 1.65);
          scene.add(ambientLight);

          const keyLight = new THREE.DirectionalLight(0xfff9f0, 1.45);
          keyLight.position.set(1.5, 2.0, 3.5);
          scene.add(keyLight);

          const mintRimLight = new THREE.PointLight(0x00ff88, 2.4, 8);
          mintRimLight.position.set(-2.2, 1.4, 1.8);
          scene.add(mintRimLight);

          const cyanRimLight = new THREE.PointLight(0x38bdf8, 1.9, 8);
          cyanRimLight.position.set(2.2, -1.0, 1.8);
          scene.add(cyanRimLight);

          const model = gltf.scene;
          model.scale.set(1.16, 1.16, 1.22);
          model.position.set(0, -0.04, 0);

          // Collect mesh geometry & UV buffers for real-time facial rigging
          let rigMesh = null;
          let basePos = null;
          let baseUV = null;

          model.traverse((child) => {
            if (child.isMesh && child.geometry) {
              rigMesh = child;
              const posAttr = child.geometry.attributes.position;
              const uvAttr = child.geometry.attributes.uv;
              if (posAttr && uvAttr) {
                basePos = new Float32Array(posAttr.array);
                baseUV = new Float32Array(uvAttr.array);
              }
            }
          });

          // Apply Normal Map for crisp 3D curls, nose bridge & blazer lapels
          try {
            const texLoader = new THREE.TextureLoader();
            texLoader.load(
              normalPath,
              (normalTex) => {
                normalTex.flipY = false;
                model.traverse((child) => {
                  if (child.isMesh && child.material) {
                    child.material.normalMap = normalTex;
                    child.material.normalScale = new THREE.Vector2(0.6, 0.6);
                    child.material.needsUpdate = true;
                  }
                });
              },
              undefined,
              () => {}
            );
          } catch {
            // Optional enhancement
          }

          scene.add(model);

          let smoothGazeX = 0;
          let smoothGazeY = 0;
          let nextBlinkAt = performance.now() + 1800;
          let blinkDuration = 150;
          let isDoubleBlink = false;
          const startTime = performance.now();

          const animate = (now) => {
            if (isDisposed) return;
            animId = requestAnimationFrame(animate);

            const elapsed = (now - startTime) * 0.001;

            // Smooth spring interpolation toward cursor (-1..1 normalized)
            const targetNormX = targetTiltRef.current.rotateY / 25;
            const targetNormY = targetTiltRef.current.rotateX / 18;
            smoothGazeX += (targetNormX - smoothGazeX) * 0.11;
            smoothGazeY += (targetNormY - smoothGazeY) * 0.11;

            // Compute natural eye blink (0 = open, 1 = closed)
            let blinkAmount = 0;
            if (now >= nextBlinkAt) {
              const bElapsed = now - nextBlinkAt;
              if (bElapsed <= blinkDuration) {
                blinkAmount = Math.sin((bElapsed / blinkDuration) * Math.PI);
              } else if (isDoubleBlink && bElapsed <= blinkDuration * 2.3) {
                const b2 = bElapsed - blinkDuration * 1.3;
                if (b2 >= 0) {
                  blinkAmount = Math.sin((b2 / blinkDuration) * Math.PI);
                }
              } else {
                nextBlinkAt = now + 2200 + Math.random() * 2800;
                isDoubleBlink = Math.random() < 0.28;
              }
            }

            // Speaking lip-sync & eyebrow expression
            const isSpeaking = isSpeakingRef.current;
            const isExcited = now < excitedUntilRef.current;
            const talkOpen = isSpeaking
              ? (Math.sin(elapsed * 16.0) * 0.5 + 0.5) *
                (Math.cos(elapsed * 9.5) * 0.4 + 0.6)
              : 0;
            const browRaise =
              (isExcited ? 1.0 : 0.0) +
              (isSpeaking ? (Math.sin(elapsed * 5.0) * 0.5 + 0.5) * 0.65 : 0.0) +
              Math.max(0, smoothGazeY) * 0.35;

            // Real-time vertex & UV deformation for live eyes, eyelids, eyebrows, mouth, head & chest!
            if (rigMesh && basePos && baseUV) {
              const posAttr = rigMesh.geometry.attributes.position;
              const uvAttr = rigMesh.geometry.attributes.uv;
              const posArr = posAttr.array;
              const uvArr = uvAttr.array;
              const count = posAttr.count;

              const headYaw = smoothGazeX * 0.16 + Math.sin(elapsed * 1.5) * 0.035;
              const headPitch = -smoothGazeY * 0.11 + Math.cos(elapsed * 1.2) * 0.025;
              const headRoll = -smoothGazeX * 0.045 + Math.sin(elapsed * 0.9) * 0.015;
              const cosY = Math.cos(headYaw);
              const sinY = Math.sin(headYaw);
              const cosX = Math.cos(headPitch);
              const sinX = Math.sin(headPitch);
              const cosZ = Math.cos(headRoll);
              const sinZ = Math.sin(headRoll);

              const breathPhase = Math.sin(elapsed * 2.4);

              for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                const i2 = i * 2;

                let x = basePos[i3];
                let y = basePos[i3 + 1];
                let z = basePos[i3 + 2];
                let u = baseUV[i2];
                let v = baseUV[i2 + 1];

                // 1. Eye Pupil Gaze Tracking (shifts iris/pupil UV smoothly inside both eye sockets)
                const dxL = (u - 0.388) / 0.046;
                const dyL = (v - 0.395) / 0.030;
                const distL2 = dxL * dxL + dyL * dyL;

                const dxR = (u - 0.606) / 0.046;
                const dyR = (v - 0.395) / 0.030;
                const distR2 = dxR * dxR + dyR * dyR;

                if (distL2 < 1.0) {
                  const wEye = 1.0 - distL2;
                  const wPupil = wEye * wEye;
                  u -= smoothGazeX * 0.016 * wPupil;
                  v += smoothGazeY * 0.010 * wPupil;
                } else if (distR2 < 1.0) {
                  const wEye = 1.0 - distR2;
                  const wPupil = wEye * wEye;
                  u -= smoothGazeX * 0.016 * wPupil;
                  v += smoothGazeY * 0.010 * wPupil;
                }

                // 2. Natural Eyelid Blink (upper eyelid sweeps down over the eye during blink)
                const bLx = (u - 0.395) / 0.072;
                const bLy = (v - 0.400) / 0.044;
                const bL2 = bLx * bLx + bLy * bLy;

                const bRx = (u - 0.605) / 0.072;
                const bRy = (v - 0.398) / 0.044;
                const bR2 = bRx * bRx + bRy * bRy;

                if (blinkAmount > 0.01 && (bL2 < 1.0 || bR2 < 1.0)) {
                  const bWeight = bL2 < 1.0 ? 1.0 - bL2 : 1.0 - bR2;
                  // Pull UV upward to sample the upper eyelid skin over the eyeball
                  v -= blinkAmount * 0.042 * bWeight;
                  y -= blinkAmount * 0.018 * bWeight;
                }

                // 3. Expressive Eyebrow Lift
                const brLx = (u - 0.380) / 0.085;
                const brLy = (v - 0.332) / 0.032;
                const brL2 = brLx * brLx + brLy * brLy;

                const brRx = (u - 0.620) / 0.085;
                const brRy = (v - 0.330) / 0.032;
                const brR2 = brRx * brRx + brRy * brRy;

                if (brL2 < 1.0 || brR2 < 1.0) {
                  const brW = brL2 < 1.0 ? 1.0 - brL2 : 1.0 - brR2;
                  y += browRaise * 0.022 * brW;
                }

                // 4. Talking Jaw & Lip Animation
                if (talkOpen > 0.01) {
                  const mX = (u - 0.500) / 0.095;
                  const mY = (v - 0.565) / 0.075;
                  const m2 = mX * mX + mY * mY;
                  if (m2 < 1.0) {
                    const mW = (1.0 - m2) * (1.0 - m2);
                    y -= talkOpen * 0.032 * mW;
                    z += talkOpen * 0.018 * mW;
                  }
                }

                // 5. Anatomical Head vs. Shoulders Articulation
                // v < 0.60 is head/hair, 0.60..0.74 is neck transition, > 0.74 is shoulders/chest
                const headWeight = Math.max(0.0, Math.min(1.0, (0.72 - v) / 0.16));
                const chestWeight = 1.0 - headWeight;

                if (headWeight > 0.001) {
                  // Pivot around neck base (0, -0.22, -0.05)
                  const px = x;
                  const py = y + 0.22;
                  const pz = z + 0.05;

                  // Roll (Z), Pitch (X), Yaw (Y) scaled by headWeight
                  const rX1 = px * cosZ - py * sinZ;
                  const rY1 = px * sinZ + py * cosZ;

                  const rY2 = rY1 * cosX - pz * sinX;
                  const rZ2 = rY1 * sinX + pz * cosX;

                  const rX3 = rX1 * cosY + rZ2 * sinY;
                  const rZ3 = -rX1 * sinY + rZ2 * cosY;

                  x = x * chestWeight + rX3 * headWeight;
                  y = y * chestWeight + (rY2 - 0.22) * headWeight;
                  z = z * chestWeight + (rZ3 - 0.05) * headWeight;
                }

                // 6. Chest & Shoulder Breathing Expansion
                if (chestWeight > 0.01) {
                  y += breathPhase * 0.018 * chestWeight;
                  z += breathPhase * 0.024 * chestWeight;
                  x *= 1.0 + breathPhase * 0.012 * chestWeight;
                }

                posArr[i3] = x;
                posArr[i3 + 1] = y;
                posArr[i3 + 2] = z;
                uvArr[i2] = u;
                uvArr[i2 + 1] = v;
              }

              posAttr.needsUpdate = true;
              uvAttr.needsUpdate = true;
            }

            // Subtle whole-body hover float
            model.position.y = -0.04 + Math.sin(elapsed * 2.0) * 0.02;

            // Dynamic key light follows cursor so 3D specular highlights glide over face
            keyLight.position.x = 1.2 + smoothGazeX * 2.2;
            keyLight.position.y = 1.5 + smoothGazeY * 1.6;

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
            {/* Real-Time Three.js WebGL 3D Rigged Character */}
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
