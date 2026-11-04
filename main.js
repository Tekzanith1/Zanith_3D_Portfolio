import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';

// ============================================================================
// 1. DATA: TEK ZANITH PORTFOLIO HIGHLIGHTS & ARCHITECTURE METRICS
// ============================================================================
const PORTFOLIO_DATA = {
  profile: {
    name: "Tek Zanith",
    title: "Senior QA Automation Engineer & AI Test Architect",
    location: "Phnom Penh, Cambodia",
    email: "Tekzanith@gmail.com",
    phone: "+855 85930693",
    github: "https://github.com/Tekzanith1",
    stats: {
      experience: "4+ Years",
      regressionReduction: "65%",
      passRate: "100%",
      smokeRunTime: "18m",
      physicalFleetVerification: "100%",
      bugEscapeRate: "0%"
    }
  },
  skills: [
    {
      category: "Test Automation & Swarms",
      icon: "⚡",
      items: [
        "Playwright E2E Swarms",
        "Maestro CLI Mobile",
        "Selenium WebDriver",
        "Bun & Node Test Runners",
        "Postman API Collections",
        "Deterministic Data Mocks"
      ]
    },
    {
      category: "AI & Agentic Orchestration",
      icon: "🤖",
      items: [
        "Multi-Agent Specialist Swarms",
        "Model Routing (Opus/Sonnet/Codex)",
        "Prompt Engineering Pipelines",
        "AST-Level Defect Isolation",
        "Synthetic Test Permutations"
      ]
    },
    {
      category: "Mobile Native & Real Device Fleet",
      icon: "📱",
      items: [
        "Physical Device Fleet (iPhone 13 Pro Max)",
        "pymobiledevice3 DVT Capture",
        "xcrun devicectl Launchers",
        "React Native & Expo SDK",
        "Pixel Fold Dynamic Viewports",
        "Android API 36/37 Certification"
      ]
    },
    {
      category: "Backend, Security & Infrastructure",
      icon: "🛡️",
      items: [
        "Supabase Row Level Security (RLS)",
        "Keycloak IAM & Banking SSO",
        "PostgreSQL & Schema Audits",
        "Apache JMeter Concurrency",
        "Locust Load Benchmarks",
        "WebSockets & Recall.ai Webhooks"
      ]
    },
    {
      category: "DevOps & Zero-Dependency Reporting",
      icon: "🚀",
      items: [
        "GitLab CI/CD & GitHub Actions",
        "Zero-Dependency Base64 HTML Reports",
        "Terraform & Cloudflare Tunnels",
        "RunPod GPU Microservice QA",
        "Google Sheets API Live Sync",
        "Two-Way Trello Bug Tracking"
      ]
    }
  ],
  projects: [
    {
      id: "physical-device-fleet-engine",
      title: "Real-Device Mobile Fleet & DVT Frame Capture",
      category: "Mobile Native QA",
      badge: "Zero Emulators / Physical",
      tags: ["pymobiledevice3", "xcrun devicectl", "React Native", "Expo", "Maestro CLI"],
      summary: "Engineered a zero-emulator physical device test acquisition engine on an iPhone 13 Pro Max (iOS 18) capturing full-retina DVT frames (1284x2778) and generating standalone offline base64 HTML audit reports.",
      highlights: [
        "Built automated capture daemons via pymobiledevice3 DVT screenshot pipeline resolving mobile flakiness with 100% pass rates.",
        "Deep-link launch orchestration across TestFlight builds with instant xcrun devicectl device process management.",
        "Engineered single-file offline HTML audit reports embedding high-res Base64 Retina evidence for stakeholder sign-off.",
        "Certified extreme viewports spanning compact iPhone SE, flagship iPhone 17 Pro Max, and Pixel Fold."
      ]
    },
    {
      id: "enterprise-b2b-saas",
      title: "Enterprise Multi-Tenant B2B SaaS Platform",
      category: "Enterprise Cloud",
      badge: "AI Swarm + Security",
      tags: ["Playwright", "Supabase RLS", "Multi-Agent Swarms", "WebSockets"],
      summary: "Architected an autonomous 3-agent testing swarm (API/RLS, Webhooks, UI/DOM) executing parallel regression across multi-role hierarchies, cutting full test cycles by 65%.",
      highlights: [
        "Designed validation suites for Supabase Row Level Security (RLS) and additive role pyramids ensuring 100% financial privacy isolation.",
        "Automated 52 critical live-data user journeys in Playwright with 100% pass rate and 98 visual assertions.",
        "Verified real-time WebSocket sync latencies (<3s) and Recall.ai EU Frankfurt webhook integrations.",
        "Reduced release verification cycles from 4 hours down to 18 minutes."
      ]
    },
    {
      id: "ai-testing-swarm",
      title: "Multi-Agent Model-Routing Test Swarm",
      category: "AI Architecture",
      badge: "Autonomous LLM Routing",
      tags: ["Model Routing", "Claude Opus", "Claude Sonnet", "OpenAI Codex"],
      summary: "Production model-routing test harness pairing Claude Opus (UI state), Claude Sonnet (screen ports), and OpenAI Codex (backend DB & concurrency tests) with cross-model peer review.",
      highlights: [
        "Delegated frontend DOM and UI state verification to Claude Opus and backend concurrency to Codex.",
        "Automated cross-model peer reviews eliminating single-model hallucination in QA test design.",
        "Synthesized high-entropy test fixtures and edge-case permutations directly through AI prompt pipelines."
      ]
    },
    {
      id: "egov-qa-infrastructure",
      title: "National E-Government Platform & QA Standards",
      category: "E-Government",
      badge: "National Standard",
      tags: ["Apache JMeter", "Postman API", "Stress Testing", "Agile Lead"],
      summary: "Sole QA Lead establishing institutional testing standards, SOPs, and bug classification matrices for national public services under heavy public traffic spikes.",
      highlights: [
        "Authored organization-wide Standard Operating Procedures (SOPs) and release sign-off quality gates.",
        "Identified concurrency bottlenecks prior to public rollouts using high-volume Apache JMeter stress suites.",
        "Maintained a 0% critical bug escape rate across all public production releases.",
        "Accelerated test suite authoring by 50% via structured AI test synthesis."
      ]
    },
    {
      id: "fintech-banking-sso",
      title: "Tier-1 Commercial Banking SSO & Booking Concurrency",
      category: "Fintech & Identity",
      badge: "Peak Concurrency PVT",
      tags: ["Keycloak SSO", "Locust", "Apache JMeter", "PVT Testing"],
      summary: "Executed Production Verification Testing (PVT) under peak concurrency, validating Keycloak OAuth/SSO login matrices and zero-drop transactional integrity.",
      highlights: [
        "Executed high-concurrency benchmarks validating single sign-on (SSO) login matrices for Tier-1 commercial banking.",
        "Benchmarked database connection pool thresholds and memory leak patterns under simulated load.",
        "Verified strict token expiration, refresh rotation, and session invalidation protocols."
      ]
    },
    {
      id: "gpu-ml-stack-qa",
      title: "Serverless GPU ML & Computer Vision Microservice QA",
      category: "AI & Computer Vision",
      badge: "RunPod / GPU ML",
      tags: ["RunPod Serverless", "Docker Stack", "Computer Vision", "GitLab CI/CD"],
      summary: "Led quality validation and CI/CD quality gates for RunPod GPU serverless microservices, Face Recognition Attendance, and License Plate Recognition (LPR) SDKs.",
      highlights: [
        "Verified AI computer vision pipelines across mobile SDKs and real-time GPU inferencing nodes.",
        "Configured GitLab CI/CD quality gates preventing broken microservice builds from progressing to staging.",
        "Reported milestone velocity and risk assessments directly to executive leadership and the CTO."
      ]
    }
  ],
  experience: [
    {
      role: "Senior QA Automation Engineer & AI Test Architect",
      company: "Skai Technology",
      period: "06/2026 – Present",
      location: "Phnom Penh, Cambodia",
      points: [
        "Directing test automation architecture and quality engineering across high-velocity B2B SaaS, mobile native, and enterprise platforms.",
        "Architected 3-agent autonomous testing swarms cutting full regression verification time by 65%.",
        "Engineered physical real-device iPhone 13 Pro Max DVT capture daemons producing zero-dependency standalone HTML evidence reports.",
        "Secured multi-tenant architectures by verifying Supabase Row Level Security (RLS) and additive permission hierarchies."
      ]
    },
    {
      role: "Quality Assurance Engineer (Sole QA Lead)",
      company: "Digital Economy and Business Committee",
      period: "05/2024 – 01/2026",
      location: "Phnom Penh, Cambodia",
      points: [
        "Established institutional QA infrastructure, authoring SOPs and release sign-off gates adopted company-wide.",
        "Conducted Apache JMeter stress testing for national public services under peak traffic with 0% critical bugs escaped.",
        "Accelerated test design by 50% using AI prompt-engineering pipelines with Claude and ChatGPT."
      ]
    },
    {
      role: "Quality Assurance Engineer",
      company: "Infinity Information and App Dev",
      period: "01/2024 – 04/2024",
      location: "Phnom Penh, Cambodia",
      points: [
        "Authored 200+ detailed test cases and built schema-validating Postman API test collections.",
        "Shortened defect triage lifecycles by 30% through reproducible defect reports with payload and network logs."
      ]
    },
    {
      role: "Quality Assurance Engineer",
      company: "Techbodia",
      period: "03/2022 – 09/2022",
      location: "Phnom Penh, Cambodia",
      points: [
        "Automated regression testing using Selenium WebDriver (Python) and Playwright.",
        "Benchmarked system response boundaries and connection pool exhaustion in Apache JMeter."
      ]
    },
    {
      role: "QA Engineer / Project Lead",
      company: "Kirirom Institute of Technology",
      period: "02/2022 – 10/2022",
      location: "Kampong Speu, Cambodia",
      points: [
        "Verified Computer Vision platforms (Face Recognition Attendance, License Plate Recognition).",
        "Configured GitLab CI/CD quality gates preventing broken builds from progressing to staging."
      ]
    }
  ],
  credentials: [
    {
      title: "ThinkCyber Cyberium — 5 Certified Security Modules",
      issuer: "ThinkCyber Cyberium Arena Simulator",
      modules: ["Penetration Testing (ZX301)", "Network Research (NX201)", "Linux Fundamentals (XE103)", "Python Fundamentals (XE105)", "Intro to Cyber (XE101)"]
    },
    {
      title: "Bachelor of Science in Software Engineering",
      issuer: "Kirirom Institute of Technology (KIT)",
      details: "Software Engineering & Computer Networks (Bachelor of Engineering)"
    },
    {
      title: "AWS Build On Cambodia Hackathon",
      issuer: "Amazon Web Services (AWS)",
      details: "1st Runner-Up (Cloud architecture & rapid system prototyping)"
    },
    {
      title: "IELTS Academic English Certification",
      issuer: "IDP / British Council",
      details: "Overall Band Score: 6.5 (Advanced Professional Working Proficiency)"
    }
  ]
};

// ============================================================================
// 2. PROCEDURAL 8-BIT WEB AUDIO SYNTHESIZER
// ============================================================================
class WebAudioSynth {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.masterGain = null;
    this.compressor = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();

    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
    this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, this.ctx.currentTime);

    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.ctx.destination);
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound(enable) {
    this.init();
    this.resume();
    this.isMuted = !enable;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, this.ctx.currentTime);
    }
    if (!this.isMuted) {
      this.playCoinChime();
    }
    return !this.isMuted;
  }

  playCoinChime() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.42);
  }

  playButtonBlip(freq = 660) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  playLaser(panX = 0) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    if (panner) {
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, panX / 10)), now);
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.masterGain);
    } else {
      osc.connect(gain);
      gain.connect(this.masterGain);
    }

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playHit() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  playFanfare() {
    if (this.isMuted || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playButtonBlip(freq), i * 110);
    });
  }
}

const synth = new WebAudioSynth();

// ============================================================================
// 3. THREE.JS 3D SCENE & ENGINE ARCHITECTURE
// ============================================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050811, 0.025);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
container.appendChild(renderer.domElement);

// Post-Processing: Bloom & Composition
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.65,
  0.4,
  0.85
);
const composer = new EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(bloomPass);

// Lighting Rig
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0x00ffff, 2.5);
keyLight.position.set(5, 8, 5);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xff007f, 2.2);
rimLight.position.set(-5, 4, 3);
scene.add(rimLight);

const spotLight = new THREE.SpotLight(0xffffff, 3.5, 25, Math.PI / 4, 0.3);
spotLight.position.set(2, 8, 3);
spotLight.target.position.set(2, 0, 0);
scene.add(spotLight);
scene.add(spotLight.target);

// Ground Synthwave Infinite Grid
const gridHelper = new THREE.GridHelper(60, 40, 0x00ffff, 0x111c33);
gridHelper.position.y = -5;
scene.add(gridHelper);

// 3-Layer Parallax Nebula Starfield
function createStarfield() {
  const group = new THREE.Group();
  const layers = [
    { count: 1200, size: 0.05, color: 0xffffff, range: 80 },
    { count: 600, size: 0.08, color: 0x00ffff, range: 60 },
    { count: 300, size: 0.12, color: 0xff007f, range: 40 }
  ];

  layers.forEach(({ count, size, color, range }) => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * range;
      pos[i + 1] = (Math.random() - 0.5) * range;
      pos[i + 2] = (Math.random() - 0.5) * range;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size, color, transparent: true, opacity: 0.85 });
    group.add(new THREE.Points(geo, mat));
  });

  return group;
}
const starfield = createStarfield();
scene.add(starfield);

// ============================================================================
// 4. CRT OFF-SCREEN CANVAS TEXTURE & 3D ARCADE CABINET MODEL
// ============================================================================
const crtCanvas = document.createElement('canvas');
crtCanvas.width = 512;
crtCanvas.height = 512;
const crtCtx = crtCanvas.getContext('2d');
const crtTexture = new THREE.CanvasTexture(crtCanvas);
crtTexture.magFilter = THREE.LinearFilter;
crtTexture.minFilter = THREE.LinearFilter;

function renderCRTMonitor(scoreVal, activeCategory = 'AI ARCHITECTURE') {
  crtCtx.fillStyle = '#050a14';
  crtCtx.fillRect(0, 0, 512, 512);

  // Scanline overlay
  crtCtx.fillStyle = 'rgba(0, 255, 255, 0.03)';
  for (let y = 0; y < 512; y += 4) {
    crtCtx.fillRect(0, y, 512, 2);
  }

  // CRT Phosphor Border
  crtCtx.strokeStyle = '#00ffff';
  crtCtx.lineWidth = 6;
  crtCtx.strokeRect(12, 12, 488, 488);

  // Header
  crtCtx.fillStyle = '#ff007f';
  crtCtx.font = 'bold 24px monospace';
  crtCtx.fillText('TEK ZANITH // AI TEST ARCHITECT', 30, 52);

  crtCtx.fillStyle = '#39ff14';
  crtCtx.font = '18px monospace';
  crtCtx.fillText(`STATUS: PASS [100%]   QA SCORE: ${scoreVal}`, 30, 84);

  // Category Focus
  crtCtx.fillStyle = '#ffd60a';
  crtCtx.font = 'bold 20px monospace';
  crtCtx.fillText(`> ACTIVE: ${activeCategory}`, 30, 122);

  // Live Assertions Stream
  crtCtx.fillStyle = '#a5f3fc';
  crtCtx.font = '15px monospace';
  const assertions = [
    '✓ [PLAYWRIGHT] 52 E2E journeys validated (0 flakiness)',
    '✓ [MAESTRO] Mobile smoke run certified (18 mins)',
    '✓ [PHYSICAL IPHONE] 100% Retina DVT frame acquisition',
    '✓ [SUPABASE RLS] Strict multi-tenant authorization isolation',
    '✓ [AI SWARM] Opus (UI) + Sonnet (Ports) + Codex (DB)'
  ];

  assertions.forEach((line, idx) => {
    crtCtx.fillText(line, 30, 165 + idx * 32);
  });

  // Animated Code Terminal
  crtCtx.fillStyle = '#1e293b';
  crtCtx.fillRect(30, 340, 452, 130);
  crtCtx.strokeStyle = '#334155';
  crtCtx.strokeRect(30, 340, 452, 130);

  crtCtx.fillStyle = '#39ff14';
  crtCtx.font = '13px monospace';
  crtCtx.fillText(`expect(tenantIsolation).toBe('STRICT');`, 42, 370);
  crtCtx.fillText(`await testSwarm.verifyRoles('Expert', 'Admin');`, 42, 396);
  crtCtx.fillText(`assert.strictEqual(bugEscapeRate, 0.00);`, 42, 422);
  crtCtx.fillText(`>> EXECUTING PHYSICAL DVT CAPTURE... [PASS]`, 42, 448);

  crtTexture.needsUpdate = true;
}

// Build 3D Arcade Cabinet with PBR & Interactive Controls
const arcadeGroup = new THREE.Group();
const raycastTargets = [];

// Cabinet Body (Brushed Titanium PBR)
const cabinetMat = new THREE.MeshStandardMaterial({
  color: 0x0c1220,
  metalness: 0.85,
  roughness: 0.25
});
const bodyGeom = new THREE.BoxGeometry(4.4, 8.4, 3.2);
const bodyMesh = new THREE.Mesh(bodyGeom, cabinetMat);
arcadeGroup.add(bodyMesh);

// Curved Screen Mesh
const screenGeom = new THREE.CylinderGeometry(2.1, 2.1, 3.2, 32, 1, false, Math.PI * 0.7, Math.PI * 0.6);
const screenMat = new THREE.MeshBasicMaterial({ map: crtTexture });
const screenMesh = new THREE.Mesh(screenGeom, screenMat);
screenMesh.rotation.y = Math.PI * 1.5;
screenMesh.rotation.z = Math.PI * 0.5;
screenMesh.position.set(0, 1.35, 0.6);
screenMesh.userData = { id: 'screen' };
arcadeGroup.add(screenMesh);
raycastTargets.push(screenMesh);

// Control Deck
const deckMat = new THREE.MeshStandardMaterial({ color: 0x141e33, metalness: 0.9, roughness: 0.15 });
const deckMesh = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.45, 1.8), deckMat);
deckMesh.position.set(0, -0.6, 2.1);
deckMesh.rotation.x = 0.18;
arcadeGroup.add(deckMesh);

// Interactive Arcade Push Buttons (A, B, X, Y)
const buttonColors = [0x00ffff, 0xff007f, 0xffd60a, 0x39ff14];
const buttonNames = ['A: Test Run', 'B: Auto Fix', 'X: RLS Guard', 'Y: Swarm'];
const arcadeButtons = [];

buttonColors.forEach((col, i) => {
  const btnGeom = new THREE.CylinderGeometry(0.18, 0.2, 0.16, 24);
  const btnMat = new THREE.MeshStandardMaterial({
    color: col,
    emissive: col,
    emissiveIntensity: 0.5,
    roughness: 0.2
  });
  const btnMesh = new THREE.Mesh(btnGeom, btnMat);
  const xPos = 0.5 + (i % 2) * 0.55;
  const zPos = 1.9 + Math.floor(i / 2) * 0.5;
  btnMesh.position.set(xPos, -0.42, zPos);
  btnMesh.userData = { id: `button_${i}`, name: buttonNames[i], color: col };
  arcadeGroup.add(btnMesh);
  arcadeButtons.push(btnMesh);
  raycastTargets.push(btnMesh);
});

// Interactive Ball-Top Joystick
const stickBase = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.3, 0.1, 16),
  new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.3 })
);
stickBase.position.set(-1.1, -0.42, 2.1);
arcadeGroup.add(stickBase);

const joystickPivot = new THREE.Group();
joystickPivot.position.set(-1.1, -0.42, 2.1);
const shaft = new THREE.Mesh(
  new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16),
  new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95, roughness: 0.1 })
);
shaft.position.y = 0.4;
const ball = new THREE.Mesh(
  new THREE.SphereGeometry(0.22, 24, 24),
  new THREE.MeshStandardMaterial({ color: 0xff007f, emissive: 0xff007f, emissiveIntensity: 0.4 })
);
ball.position.y = 0.8;
joystickPivot.add(shaft);
joystickPivot.add(ball);
joystickPivot.userData = { id: 'joystick' };
arcadeGroup.add(joystickPivot);
raycastTargets.push(ball);

// Glowing Coin Slot
const coinSlotMesh = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 0.3, 0.08),
  new THREE.MeshStandardMaterial({ color: 0xffd60a, emissive: 0xffd60a, emissiveIntensity: 0.6 })
);
coinSlotMesh.position.set(0, -2.4, 1.62);
coinSlotMesh.userData = { id: 'coin-slot' };
arcadeGroup.add(coinSlotMesh);
raycastTargets.push(coinSlotMesh);

arcadeGroup.position.set(2.4, -0.8, 0);
arcadeGroup.rotation.y = -0.38;
scene.add(arcadeGroup);

renderCRTMonitor('018,450', 'AI TEST ARCHITECT');

// ============================================================================
// 5. 24FPS LOCAL ANIME CHARACTER COMBAT & MINI-GAME SYSTEM
// ============================================================================
const textureLoader = new THREE.TextureLoader();
const characters = [];
const charConfigs = [
  { name: 'Naruto', color: 0xffaa00, file: '/assets/naruto.png', role: 'Automation Shinobi' },
  { name: 'Goku', color: 0xff5500, file: '/assets/goku.png', role: 'Concurrency Saiyan' },
  { name: 'Saitama', color: 0xffd60a, file: '/assets/saitama.png', role: 'One-Punch QA' },
  { name: 'Itadori', color: 0xff007f, file: '/assets/itadori.png', role: 'Curse Bug Hunter' }
];

charConfigs.forEach((cfg, idx) => {
  const tex = textureLoader.load(cfg.file);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;

  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(1.6, 1.6, 1);

  const xInit = -4 + (idx % 2) * 2.5 + (Math.random() - 0.5);
  const yInit = -1 + Math.floor(idx / 2) * 2.2 + (Math.random() - 0.5);
  sprite.position.set(xInit, yInit, 1.5);
  sprite.userData = { id: 'character', name: cfg.name, role: cfg.role, color: cfg.color };

  scene.add(sprite);
  raycastTargets.push(sprite);

  characters.push({
    mesh: sprite,
    target: null,
    velocity: new THREE.Vector3(),
    health: 100,
    config: cfg
  });
});

const sparks = [];


function spawnSparks(pos, color) {
  for (let i = 0; i < 16; i++) {
    const geo = new THREE.SphereGeometry(0.04, 6, 6);
    const mat = new THREE.MeshBasicMaterial({ color });
    const p = new THREE.Mesh(geo, mat);
    p.position.copy(pos);
    scene.add(p);
    sparks.push({
      mesh: p,
      vel: new THREE.Vector3((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4),
      life: 25
    });
  }
}

// Mini-Game Mode ("Fix The Release")
let isMiniGameActive = false;
let miniGameTimer = 60;
let miniGameBugsCount = 0;
let miniGameInterval = null;
const miniGameBugs = [];
const bugTex = textureLoader.load('/assets/bug.png');
bugTex.magFilter = THREE.NearestFilter;

function startMiniGame() {
  isMiniGameActive = true;
  miniGameTimer = 60;
  miniGameBugsCount = 0;
  document.getElementById('minigame-hud').classList.remove('hidden');
  document.getElementById('game-timer').innerText = `${miniGameTimer}s`;
  document.getElementById('game-bugs-count').innerText = '0';

  setCameraView('arena');
  synth.playFanfare();

  clearInterval(miniGameInterval);
  miniGameInterval = setInterval(() => {
    miniGameTimer--;
    document.getElementById('game-timer').innerText = `${miniGameTimer}s`;
    if (miniGameTimer <= 0) {
      endMiniGame();
    } else if (Math.random() < 0.6) {
      spawnMiniGameBug();
    }
  }, 1000);
}

function spawnMiniGameBug() {
  const mat = new THREE.SpriteMaterial({ map: bugTex, transparent: true });
  const bug = new THREE.Sprite(mat);
  bug.scale.set(1.1, 1.1, 1);
  bug.position.set((Math.random() - 0.5) * 12, 6, 1.2);
  bug.userData = { isBug: true };
  scene.add(bug);
  miniGameBugs.push(bug);
  raycastTargets.push(bug);
}

function zapBug(bugMesh) {
  const idx = miniGameBugs.indexOf(bugMesh);
  if (idx !== -1) {
    miniGameBugs.splice(idx, 1);
    const rtIdx = raycastTargets.indexOf(bugMesh);
    if (rtIdx !== -1) raycastTargets.splice(rtIdx, 1);

    spawnSparks(bugMesh.position, 0x00ffff);
    scene.remove(bugMesh);

    miniGameBugsCount++;
    document.getElementById('game-bugs-count').innerText = miniGameBugsCount;
    addScore(500);
    synth.playHit();
  }
}

function endMiniGame() {
  isMiniGameActive = false;
  clearInterval(miniGameInterval);
  document.getElementById('minigame-hud').classList.add('hidden');
  miniGameBugs.forEach(b => scene.remove(b));
  miniGameBugs.length = 0;
  setCameraView('hero');
  synth.playFanfare();
}

// ============================================================================
// 6. CAMERA DIRECTOR & GSAP INTERACTIVE RIGS
// ============================================================================
const CAMERA_RIGS = {
  hero: { x: 0, y: 0, z: 10, rotY: 0, targetY: -0.38 },
  screen: { x: 2.3, y: 0.5, z: 4.8, rotY: -0.38, targetY: -0.38 },
  arena: { x: -2.5, y: 0.2, z: 12, rotY: 0.1, targetY: -0.1 },
  scores: { x: 3.8, y: -0.5, z: 5.6, rotY: -0.6, targetY: -0.6 }
};

let currentCamView = 'hero';
function setCameraView(viewKey) {
  const rig = CAMERA_RIGS[viewKey] || CAMERA_RIGS.hero;
  currentCamView = viewKey;

  document.querySelectorAll('.cam-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cam === viewKey);
  });

  gsap.to(camera.position, {
    x: rig.x,
    y: rig.y,
    z: rig.z,
    duration: 1.6,
    ease: 'power3.inOut'
  });

  gsap.to(arcadeGroup.rotation, {
    y: rig.targetY,
    duration: 1.6,
    ease: 'power3.inOut'
  });

  synth.playButtonBlip(800);
}

// ============================================================================
// 7. HUD DOM RENDERING & TAB ENGINE
// ============================================================================
const hudBody = document.getElementById('hud-body');
const scoreDisplay = document.getElementById('live-score');
const comboDisplay = document.getElementById('combo-badge');
let currentScore = 18450;
let comboMultiplier = 1;

function addScore(points) {
  currentScore += points * comboMultiplier;
  scoreDisplay.innerText = currentScore.toLocaleString().padStart(7, '0');
  renderCRTMonitor(currentScore.toLocaleString());
}

function renderHUDTab(tabKey) {
  document.querySelectorAll('.hud-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabKey));
  document.querySelectorAll('.pill-item').forEach(p => p.classList.toggle('active', p.dataset.tab === tabKey));

  synth.playButtonBlip(550);
  comboMultiplier = Math.min(8, comboMultiplier + 1);
  comboDisplay.innerText = `COMBO x${comboMultiplier}`;
  addScore(100);

  if (tabKey === 'skills') {
    let html = '';
    PORTFOLIO_DATA.skills.forEach(cat => {
      html += `<div class="hud-category-title">${cat.icon} ${cat.category.toUpperCase()}</div>`;
      html += `<div class="tag-cloud">`;
      cat.items.forEach(item => {
        html += `<span class="tag-pill">${item}</span>`;
      });
      html += `</div>`;
    });
    hudBody.innerHTML = html;
  } else if (tabKey === 'projects') {
    let html = '';
    PORTFOLIO_DATA.projects.forEach(p => {
      html += `
        <div class="project-card" data-project-id="${p.id}">
          <div class="project-card-header">
            <span class="project-name">${p.title}</span>
            <span class="project-badge">${p.badge}</span>
          </div>
          <p class="project-summary">${p.summary}</p>
          <div class="tag-cloud">
            ${p.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
          </div>
        </div>
      `;
    });
    hudBody.innerHTML = html;

    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const pId = card.dataset.projectId;
        openProjectModal(pId);
      });
    });
  } else if (tabKey === 'experience') {
    let html = '';
    PORTFOLIO_DATA.experience.forEach(exp => {
      html += `
        <div class="exp-item">
          <div class="exp-role">${exp.role}</div>
          <div class="exp-company">${exp.company} — ${exp.location}</div>
          <div class="exp-period">${exp.period}</div>
          <ul class="modal-bullets">
            ${exp.points.map(pt => `<li>${pt}</li>`).join('')}
          </ul>
        </div>
      `;
    });
    hudBody.innerHTML = html;
  } else if (tabKey === 'credentials') {
    let html = '';
    PORTFOLIO_DATA.credentials.forEach(cred => {
      html += `
        <div class="project-card" style="cursor: default;">
          <div class="project-name" style="color: var(--arcade-yellow);">${cred.title}</div>
          <div class="exp-company">${cred.issuer}</div>
          ${cred.details ? `<p class="project-summary" style="margin-top:6px;">${cred.details}</p>` : ''}
          ${cred.modules ? `<div class="tag-cloud" style="margin-top:6px;">${cred.modules.map(m => `<span class="tag-pill">${m}</span>`).join('')}</div>` : ''}
        </div>
      `;
    });
    hudBody.innerHTML = html;
  } else if (tabKey === 'terminal') {
    hudBody.innerHTML = `
      <div class="terminal-stream" id="term-stream">
        <div class="term-line info">[INIT] Tek Zanith Autonomous Test Orchestrator v4.2</div>
        <div class="term-line pass">✓ [PLAYWRIGHT] Initialized 52 critical path suites</div>
        <div class="term-line pass">✓ [SUPABASE RLS] Strict multi-tenant verification passed</div>
        <div class="term-line pass">✓ [PHYSICAL IPHONE] iPhone 13 Pro Max (UDID: 00008110) connected</div>
        <div class="term-line pass">✓ [DVT RETINA CAPTURE] Acquired 1284x2778 frame in 142ms</div>
        <div class="term-line info">[AI AGENTS] Opus/Sonnet/Codex routing active</div>
        <div class="term-line pass">✓ [LOAD] Locust 50 concurrent sessions: 0% data drop</div>
        <div class="term-line term-cursor">> STREAMING RUNTIME TELEMETRY_</div>
      </div>
    `;
    streamLiveLogs();
  }
}

function streamLiveLogs() {
  const streamEl = document.getElementById('term-stream');
  if (!streamEl) return;
  const mockLines = [
    '✓ [SECURITY] Verified JWT expiration and token rotation (15m)',
    '✓ [PERF] WebSocket sync latency clocked at 42ms (< 3s threshold)',
    '✓ [AST CHECK] Resolved zero-width layout collapse in React Native',
    '✓ [REPORT] Standalone Base64 HTML report artifact generated (offline proof)',
    '✓ [REGRESSION] 100% test pass rate recorded across release candidate'
  ];
  let i = 0;
  const interval = setInterval(() => {
    if (!document.getElementById('term-stream') || i >= mockLines.length) {
      clearInterval(interval);
      return;
    }
    const div = document.createElement('div');
    div.className = 'term-line pass';
    div.innerText = mockLines[i++];
    streamEl.appendChild(div);
    streamEl.scrollTop = streamEl.scrollHeight;
    synth.playButtonBlip(700);
  }, 1200);
}

function openProjectModal(pId) {
  const p = PORTFOLIO_DATA.projects.find(item => item.id === pId);
  if (!p) return;

  document.getElementById('modal-category').innerText = p.category;
  document.getElementById('modal-title').innerText = p.title;
  document.getElementById('modal-summary').innerText = p.summary;
  document.getElementById('modal-tags').innerHTML = p.tags.map(t => `<span class="tag-pill">${t}</span>`).join('');
  document.getElementById('modal-highlights').innerHTML = p.highlights.map(h => `<li>${h}</li>`).join('');

  document.getElementById('project-modal').classList.remove('hidden');
  synth.playButtonBlip(880);
}

function openContactModal() {
  document.getElementById('contact-modal').classList.remove('hidden');
  synth.playButtonBlip(650);
}

// ============================================================================
// 8. INTERACTIVE RAYCASTING (3D MOUSE PICKING)
// ============================================================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.navbar, .ui-panel, .quick-nav-pill, .modal-backdrop, .minigame-hud, .overlay-hero')) {
    return;
  }

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(raycastTargets, true);

  if (intersects.length > 0) {
    const hitObj = intersects[0].object;

    if (hitObj.userData.isBug) {
      zapBug(hitObj);
      return;
    }

    if (hitObj.userData.id === 'screen') {
      setCameraView('screen');
      synth.playCoinChime();
      addScore(250);
      return;
    }

    if (hitObj.userData.id && hitObj.userData.id.startsWith('button_')) {
      gsap.to(hitObj.position, {
        y: hitObj.position.y - 0.08,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
      synth.playButtonBlip(900);
      addScore(150);
      spawnSparks(intersects[0].point, hitObj.userData.color);
      return;
    }

    if (hitObj.userData.id === 'coin-slot') {
      synth.playCoinChime();
      addScore(1000);
      setCameraView('screen');
      return;
    }

    if (hitObj.userData.id === 'joystick' || hitObj.parent === joystickPivot) {
      gsap.to(joystickPivot.rotation, {
        x: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.5,
        duration: 0.15,
        yoyo: true,
        repeat: 1
      });
      synth.playButtonBlip(400);
      return;
    }

    if (hitObj.userData.id === 'character') {
      spawnSparks(intersects[0].point, hitObj.userData.color);
      synth.playHit();
      addScore(300);
    }
  }
});

// ============================================================================
// 9. ANIMATION LOOP & 24FPS COMBAT ENGINE
// ============================================================================
let lastCombatTime = 0;
let mouseX = 0, mouseY = 0;

window.addEventListener('pointermove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

  const cursor = document.getElementById('custom-cursor');
  const ring = document.getElementById('cursor-ring');
  if (cursor && ring) {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
    ring.style.left = `${e.clientX}px`;
    ring.style.top = `${e.clientY}px`;
  }
});

function animate(time) {
  requestAnimationFrame(animate);

  starfield.rotation.y += 0.0006;
  starfield.rotation.x += 0.0003;

  if (currentCamView === 'hero') {
    camera.position.x = mouseX * 0.4;
    camera.position.y = -mouseY * 0.3;
  }

  // 24fps Anime Character Combat Loop
  if (time - lastCombatTime > 1000 / 24) {
    lastCombatTime = time;

    characters.forEach((char, i) => {
      if (!char.target || Math.random() < 0.04) {
        char.target = characters[(i + 1) % characters.length].mesh.position;
      }

      const dir = new THREE.Vector3().subVectors(char.target, char.mesh.position).normalize();
      char.velocity.add(dir.multiplyScalar(0.015));
      char.velocity.multiplyScalar(0.92);
      char.mesh.position.add(char.velocity);

      if (Math.abs(char.mesh.position.x) > 8) char.velocity.x *= -1;
      if (Math.abs(char.mesh.position.y) > 4) char.velocity.y *= -1;

      // Proximity sparring reaction without laser projectiles
      const dist = char.mesh.position.distanceTo(char.target);
      if (dist < 1.2 && Math.random() < 0.05) {
        spawnSparks(char.mesh.position, char.config.color);
      }
    });

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.mesh.position.add(s.vel);
      s.life--;
      if (s.life <= 0) {
        scene.remove(s.mesh);
        sparks.splice(i, 1);
      }
    }

    if (isMiniGameActive) {
      for (let i = miniGameBugs.length - 1; i >= 0; i--) {
        const bug = miniGameBugs[i];
        bug.position.y -= 0.06;
        if (bug.position.y < -4.5) {
          scene.remove(bug);
          miniGameBugs.splice(i, 1);
          synth.playHit();
          comboMultiplier = 1;
          comboDisplay.innerText = 'COMBO x1';
        }
      }
    }
  }

  composer.render();
}
requestAnimationFrame(animate);

// ============================================================================
// 10. EASTER EGGS: KONAMI CODE
// ============================================================================
const konamiKeys = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];
let konamiIndex = 0;

window.addEventListener('keydown', (e) => {
  if (e.key === konamiKeys[konamiIndex] || e.key.toLowerCase() === konamiKeys[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiKeys.length) {
      activateKonamiMode();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }

  if (['1', '2', '3', '4', '5'].includes(e.key)) {
    const tabs = ['skills', 'projects', 'experience', 'credentials', 'terminal'];
    renderHUDTab(tabs[parseInt(e.key) - 1]);
  }

  if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(e.key)) {
    gsap.to(joystickPivot.rotation, {
      x: e.key === 'w' || e.key === 'ArrowUp' ? -0.3 : (e.key === 's' || e.key === 'ArrowDown' ? 0.3 : 0),
      z: e.key === 'a' || e.key === 'ArrowLeft' ? -0.3 : (e.key === 'd' || e.key === 'ArrowRight' ? 0.3 : 0),
      duration: 0.15,
      yoyo: true,
      repeat: 1
    });
    synth.playButtonBlip(480);
  }
});

function activateKonamiMode() {
  document.body.classList.toggle('golden-theme');
  addScore(10000);
  synth.playFanfare();
}

// ============================================================================
// 11. EVENT LISTENERS & UI WIRING
// ============================================================================
const btnEnter = document.getElementById('btn-enter');
const loaderOverlay = document.getElementById('loader-overlay');

let loadProgress = 0;
const loadInterval = setInterval(() => {
  loadProgress += 20;
  document.getElementById('loader-progress-bar').style.width = `${loadProgress}%`;
  document.getElementById('loader-percent').innerText = `${loadProgress}%`;

  if (loadProgress === 40) {
    document.getElementById('loader-status').innerText = 'Initializing Three.js PBR Shaders...';
  } else if (loadProgress === 80) {
    document.getElementById('loader-status').innerText = 'Synthesizing 8-Bit Web Audio Nodes...';
  } else if (loadProgress >= 100) {
    clearInterval(loadInterval);
    document.getElementById('loader-status').innerText = 'SYSTEM READY // ALL CHANNELS PASS';
    btnEnter.classList.remove('hidden');
  }
}, 120);

btnEnter.addEventListener('click', () => {
  loaderOverlay.classList.add('fade-out');
  synth.init();
  renderHUDTab('skills');
});

document.querySelectorAll('.cam-btn').forEach(btn => {
  btn.addEventListener('click', () => setCameraView(btn.dataset.cam));
});

const btnAudio = document.getElementById('btn-audio-toggle');
const audioLabel = document.getElementById('audio-label');
btnAudio.addEventListener('click', () => {
  const isEnabled = synth.toggleSound(synth.isMuted);
  btnAudio.classList.toggle('active', isEnabled);
  audioLabel.innerText = isEnabled ? 'SOUND: ON' : 'SOUND: OFF';
});

document.getElementById('btn-insert-coin').addEventListener('click', () => {
  setCameraView('screen');
  synth.playCoinChime();
  addScore(1000);
});

document.getElementById('btn-start-minigame').addEventListener('click', startMiniGame);
document.getElementById('btn-exit-game').addEventListener('click', endMiniGame);

document.querySelectorAll('.quick-nav-pill .pill-item').forEach(pill => {
  pill.addEventListener('click', () => {
    if (pill.dataset.action === 'contact') {
      openContactModal();
    } else if (pill.dataset.tab) {
      renderHUDTab(pill.dataset.tab);
    }
  });
});

document.querySelectorAll('.hud-tab').forEach(tab => {
  tab.addEventListener('click', () => renderHUDTab(tab.dataset.tab));
});

const hudPanel = document.getElementById('arcade-ui');
document.getElementById('btn-toggle-hud').addEventListener('click', () => {
  hudPanel.classList.toggle('minimized');
  synth.playButtonBlip(400);
});

document.getElementById('btn-close-project').addEventListener('click', () => {
  document.getElementById('project-modal').classList.add('hidden');
});
document.getElementById('btn-close-contact').addEventListener('click', () => {
  document.getElementById('contact-modal').classList.add('hidden');
});

document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const feedback = document.getElementById('contact-feedback');
  feedback.innerText = 'TRANSMITTING MESSAGE...';
  synth.playButtonBlip(800);

  setTimeout(() => {
    feedback.innerText = 'TRANSMISSION RECEIVED! THANK YOU.';
    synth.playCoinChime();
    setTimeout(() => {
      document.getElementById('contact-modal').classList.add('hidden');
      feedback.innerText = '';
      e.target.reset();
    }, 1800);
  }, 1000);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.fov = window.innerWidth < 768 ? 65 : 45;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  composer.setSize(window.innerWidth, window.innerHeight);
});
