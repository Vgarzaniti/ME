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
    excitedUntilRef.current = performance.now() + 1800;

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

  // Trigger jump/wave animation and cycle tip
  const handleAvatarClick = () => {
    setIsJumping(true);
    excitedUntilRef.current = performance.now() + 2000;
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
    excitedUntilRef.current = performance.now() + 1800;
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

  // Full-Body Ready Player Me 3D Skeleton (Hair + Beard + Arms + Torso + Eyes + 63 ARKit/Oculus Blendshapes)
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

          const width = 185;
          const height = 215;
          const scene = new THREE.Scene();

          // Framed on upper body: from chest/arms (y=1.18) up to top of hair (y=1.88)
          const camera = new THREE.PerspectiveCamera(30, width / height, 0.05, 50);
          camera.position.set(0, 1.54, 1.32);
          camera.lookAt(0, 1.52, 0);

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
          const ambientLight = new THREE.AmbientLight(0xffffff, 1.65);
          scene.add(ambientLight);

          const keyLight = new THREE.DirectionalLight(0xfff9f0, 1.75);
          keyLight.position.set(1.0, 2.2, 2.0);
          scene.add(keyLight);

          const mintRimLight = new THREE.PointLight(0x00ff88, 2.2, 5);
          mintRimLight.position.set(-1.1, 1.75, 0.8);
          scene.add(mintRimLight);

          const cyanRimLight = new THREE.PointLight(0x38bdf8, 1.8, 5);
          cyanRimLight.position.set(1.1, 1.35, 0.8);
          scene.add(cyanRimLight);

          const model = gltf.scene;
          scene.add(model);

          // Collect Ready Player Me Skeleton Bones & ARKit/Oculus Morph Target Meshes
          const bones = {
            head: null,
            neck: null,
            spine: null,
            spine1: null,
            spine2: null,
            leftEye: null,
            rightEye: null,
            leftShoulder: null,
            rightShoulder: null,
            leftArm: null,
            rightArm: null,
            leftForeArm: null,
            rightForeArm: null,
          };
          const morphMeshes = [];

          model.traverse((child) => {
            if (child.isBone) {
              if (child.name === "Head") bones.head = child;
              else if (child.name === "Neck") bones.neck = child;
              else if (child.name === "Spine") bones.spine = child;
              else if (child.name === "Spine1") bones.spine1 = child;
              else if (child.name === "Spine2") bones.spine2 = child;
              else if (child.name === "LeftEye") bones.leftEye = child;
              else if (child.name === "RightEye") bones.rightEye = child;
              else if (child.name === "LeftShoulder") bones.leftShoulder = child;
              else if (child.name === "RightShoulder") bones.rightShoulder = child;
              else if (child.name === "LeftArm") bones.leftArm = child;
              else if (child.name === "RightArm") bones.rightArm = child;
              else if (child.name === "LeftForeArm") bones.leftForeArm = child;
              else if (child.name === "RightForeArm") bones.rightForeArm = child;
            }
            if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
              morphMeshes.push(child);
            }
          });

          // Store base rotations for arms so we can layer natural idle sway & gesturing on top
          const baseRightArmZ = bones.rightArm ? bones.rightArm.rotation.z : 0.12;
          const baseRightArmX = bones.rightArm ? bones.rightArm.rotation.x : 1.02;
          const baseLeftArmZ = bones.leftArm ? bones.leftArm.rotation.z : -0.12;
          const baseLeftArmX = bones.leftArm ? bones.leftArm.rotation.x : 1.02;
          const baseRightForeArmZ = bones.rightForeArm ? bones.rightForeArm.rotation.z : -0.45;
          const baseLeftForeArmZ = bones.leftForeArm ? bones.leftForeArm.rotation.z : 0.45;

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
          let nextBlinkAt = performance.now() + 1500;
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

            const isSpeaking = isSpeakingRef.current;
            const isExcited = now < excitedUntilRef.current;

            // 1. Skeleton Bone Articulation (Head, Neck, Spine, Shoulders & Arms!)
            const idleYaw = Math.sin(elapsed * 1.3) * 0.055;
            const idlePitch = Math.cos(elapsed * 1.0) * 0.035;
            const idleRoll = Math.sin(elapsed * 0.8) * 0.025;

            if (bones.neck) {
              bones.neck.rotation.y = smoothGazeX * 0.15 + idleYaw * 0.5;
              bones.neck.rotation.x = -smoothGazeY * 0.09 + idlePitch * 0.5;
              bones.neck.rotation.z = -smoothGazeX * 0.04 + idleRoll;
            }
            if (bones.head) {
              const talkNod = isSpeaking ? Math.sin(elapsed * 9.5) * 0.038 : 0;
              bones.head.rotation.y = smoothGazeX * 0.25 + idleYaw;
              bones.head.rotation.x = -smoothGazeY * 0.15 + idlePitch + talkNod;
              bones.head.rotation.z = -smoothGazeX * 0.055 + idleRoll;
            }
            if (bones.spine2) {
              bones.spine2.rotation.y = smoothGazeX * 0.09 + Math.sin(elapsed * 1.1) * 0.025;
              bones.spine2.rotation.x = Math.sin(elapsed * 2.3) * 0.024;
            }

            // 2. Real 3D Eye Socket Bone Tracking (LeftEye + RightEye bones follow cursor!)
            if (bones.leftEye && bones.rightEye) {
              const eyeYaw = smoothGazeX * 0.22;
              const eyePitch = -smoothGazeY * 0.16;
              bones.leftEye.rotation.y = eyeYaw;
              bones.leftEye.rotation.x = eyePitch;
              bones.rightEye.rotation.y = eyeYaw;
              bones.rightEye.rotation.x = eyePitch;
            }

            // 3. Natural Shoulder & Arm Breathing + Talking Gestures
            const breathSway = Math.sin(elapsed * 2.3);
            const talkGesture = isSpeaking ? Math.sin(elapsed * 6.5) * 0.08 : 0;
            const excitedWave = isExcited ? Math.sin(elapsed * 12.0) * 0.14 : 0;

            if (bones.leftArm) {
              bones.leftArm.rotation.x = baseLeftArmX + breathSway * 0.025 - talkGesture * 0.5;
              bones.leftArm.rotation.z = baseLeftArmZ - breathSway * 0.02;
            }
            if (bones.rightArm) {
              bones.rightArm.rotation.x = baseRightArmX + breathSway * 0.025 - talkGesture * 0.6 - excitedWave;
              bones.rightArm.rotation.z = baseRightArmZ + breathSway * 0.02 + excitedWave * 0.5;
            }
            if (bones.leftForeArm) {
              bones.leftForeArm.rotation.z = baseLeftForeArmZ + talkGesture * 0.6;
            }
            if (bones.rightForeArm) {
              bones.rightForeArm.rotation.z = baseRightForeArmZ - talkGesture * 0.8 - excitedWave * 1.1;
            }

            // 4. ARKit Eye Blinking (with occasional natural double-blink)
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

            // 5. Friendly Smile, Expressive Brows & Oculus Viseme Lip-Sync
            const lookUp = Math.max(0, smoothGazeY);
            const lookDown = Math.max(0, -smoothGazeY);
            setMorph("eyesLookUp", lookUp * 0.6);
            setMorph("eyesLookDown", lookDown * 0.6);

            const baseSmile = isExcited ? 0.68 : isSpeaking ? 0.36 : 0.45;
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
            keyLight.position.x = 1.0 + smoothGazeX * 1.1;
            keyLight.position.y = 2.0 + smoothGazeY * 0.7;

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
