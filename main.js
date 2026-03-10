import * as THREE from 'three';
import gsap from 'gsap';

// --- INITIALIZATION ---
const canvasContainer = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
canvasContainer.appendChild(renderer.domElement);

// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ffff, 2, 100);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const pinkLight = new THREE.PointLight(0xff00ff, 2, 100);
pinkLight.position.set(-5, 5, 5);
scene.add(pinkLight);

// --- STARFIELD ---
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 1500;
const posArray = new Float32Array(starsCount * 3);

for(let i = 0; i < starsCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starsMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
});
const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starsMesh);

// --- ARCADE MACHINE (Sleek Apple Style) ---
const arcadeGroup = new THREE.Group();

// Cabinet Body
const bodyGeometry = new THREE.BoxGeometry(4, 8, 3);
const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x111111, 
    metalness: 0.9, 
    roughness: 0.1 
});
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
arcadeGroup.add(body);

// Screen Area
const screenGeometry = new THREE.PlaneGeometry(3.5, 3.5);
const screenMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x000000,
    side: THREE.DoubleSide
});
const screen = new THREE.Mesh(screenGeometry, screenMaterial);
screen.position.set(0, 1.5, 1.51);
arcadeGroup.add(screen);

// Screen Glow (Neon)
const glowGeometry = new THREE.PlaneGeometry(3.7, 3.7);
const glowMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00ffff, 
    transparent: true, 
    opacity: 0.2 
});
const glow = new THREE.Mesh(glowGeometry, glowMaterial);
glow.position.set(0, 1.5, 1.5);
arcadeGroup.add(glow);

// Controls Base
const controlGeometry = new THREE.BoxGeometry(4, 0.5, 1.5);
const controlBase = new THREE.Mesh(controlGeometry, bodyMaterial);
controlBase.position.set(0, -0.5, 2.25);
arcadeGroup.add(controlBase);

// Joysticks (Spheres)
const stickGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const pinkMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff });
const blueMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff });

const stick1 = new THREE.Mesh(stickGeometry, pinkMat);
stick1.position.set(-1, -0.2, 2.5);
arcadeGroup.add(stick1);

const stick2 = new THREE.Mesh(stickGeometry, blueMat);
stick2.position.set(1, -0.2, 2.5);
arcadeGroup.add(stick2);

scene.add(arcadeGroup);
arcadeGroup.position.set(2, -1, 0);
arcadeGroup.rotation.y = -0.4;

camera.position.z = 10;

// --- DATA FROM CV ---
const cvData = {
    skills: ["Manual Testing", "API Checking", "Automation Testing", "Photography", "Spatial awareness"],
    experience: [
        { title: "QA Engineer", company: "Digital Economy & Business Committee", date: "May 2024 - Present" },
        { title: "QA Engineer", company: "Infinity Info & App Dev", date: "Jan 2024 - April 2024" },
        { title: "QA Engineer", company: "Techbodia", date: "March 2022 - Sept 2022" }
    ],
    achievements: ["AWS Build on Cambodia - 1st Runner", "Smartstart 2021", "Techno Innovation 2021"]
};

// --- INTERACTION ---
const dynamicContent = document.getElementById('dynamic-content');
const scoreDisplay = document.querySelector('.score-retro');
let score = 0;

function updateContent(section) {
    let html = `<h3>${section.toUpperCase()}</h3><ul class="nav-list-retro">`;
    if (section === 'skills') {
        cvData.skills.forEach(s => html += `<li>> ${s}</li>`);
    } else if (section === 'experience') {
        cvData.experience.forEach(e => html += `<li>${e.title}<br><small>${e.company}</small></li>`);
    } else if (section === 'achievements') {
        cvData.achievements.forEach(a => html += `<li>* ${a}</li>`);
    }
    html += '</ul>';
    
    gsap.to(dynamicContent, { opacity: 0, duration: 0.2, onComplete: () => {
        dynamicContent.innerHTML = html;
        gsap.to(dynamicContent, { opacity: 1, duration: 0.2 });
    }});
    
    score += 1000;
    scoreDisplay.innerText = score.toString().padStart(6, '0');
    
    // Animate camera/arcade on click
    gsap.to(arcadeGroup.rotation, { y: arcadeGroup.rotation.y + 0.1, duration: 0.5, yoyo: true, repeat: 1 });
}

// Event Listeners for UI
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.getAttribute('href').replace('#', '');
        if (cvData[section]) updateContent(section);
        else if (section === 'about') updateContent('skills');
    });
});

// Parallax Mouse Effect
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// --- ANIMATION LOOP ---
const animate = () => {
    requestAnimationFrame(animate);
    
    // Subtle rotation
    starsMesh.rotation.y += 0.001;
    starsMesh.rotation.x += 0.0005;
    
    // Parallax
    gsap.to(arcadeGroup.rotation, {
        y: -0.4 + mouseX * 0.2,
        x: mouseY * 0.1,
        duration: 2
    });
    
    gsap.to(camera.position, {
        x: mouseX * 0.5,
        y: -mouseY * 0.5,
        duration: 2
    });

    renderer.render(scene, camera);
};

animate();

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize with skills
updateContent('skills');