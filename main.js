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
for(let i = 0; i < starsCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 100;
starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starsMaterial = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.8 });
const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starsMesh);

// --- ARCADE MACHINE ---
const arcadeGroup = new THREE.Group();
const bodyGeometry = new THREE.BoxGeometry(4, 8, 3);
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
arcadeGroup.add(body);

const screenGeometry = new THREE.PlaneGeometry(3.5, 3.5);
const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
const screen = new THREE.Mesh(screenGeometry, screenMaterial);
screen.position.set(0, 1.5, 1.51);
arcadeGroup.add(screen);

const controlGeometry = new THREE.BoxGeometry(4, 0.5, 1.5);
const controlBase = new THREE.Mesh(controlGeometry, bodyMaterial);
controlBase.position.set(0, -0.5, 2.25);
arcadeGroup.add(controlBase);

const stickGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const pinkMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff });
const blueMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff });
const stick1 = new THREE.Mesh(stickGeometry, pinkMat); stick1.position.set(-1, -0.2, 2.5); arcadeGroup.add(stick1);
const stick2 = new THREE.Mesh(stickGeometry, blueMat); stick2.position.set(1, -0.2, 2.5); arcadeGroup.add(stick2);

scene.add(arcadeGroup);
arcadeGroup.position.set(2, -1, 0);
arcadeGroup.rotation.y = -0.4;

camera.position.z = 10;

// --- PIXEL CHARACTERS ---
const characters = [];
const charNames = ['Naruto', 'Goku', 'Saitama', 'Itadori'];
const charColors = [0xff9900, 0x0066ff, 0xffff00, 0xff0066];

function createPixelTexture(color) {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
    // Draw simple pixelated body
    ctx.fillRect(20, 10, 24, 24); // Head
    ctx.fillRect(16, 34, 32, 20); // Body
    ctx.fillRect(16, 54, 10, 10); ctx.fillRect(38, 54, 10, 10); // Feet
    // Add "eyes"
    ctx.fillStyle = '#fff'; ctx.fillRect(24, 16, 4, 4); ctx.fillRect(36, 16, 4, 4);
    return new THREE.CanvasTexture(canvas);
}

charNames.forEach((name, i) => {
    const texture = createPixelTexture(charColors[i]);
    texture.magFilter = THREE.NearestFilter;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1.5, 1.5, 1);
    sprite.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5, 2);
    
    characters.push({
        name,
        mesh: sprite,
        target: null,
        velocity: new THREE.Vector3(),
        health: 100,
        lastUpdate: 0,
        frameRate: 1000 / 24 // 24 FPS
    });
    scene.add(sprite);
});

// --- COMBAT LOGIC ---
const weapons = [];
function throwWeapon(from, to) {
    const weaponGeom = new THREE.SphereGeometry(0.1, 8, 8);
    const weaponMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const weapon = new THREE.Mesh(weaponGeom, weaponMat);
    weapon.position.copy(from);
    scene.add(weapon);
    
    const direction = new THREE.Vector3().subVectors(to, from).normalize();
    weapons.push({ mesh: weapon, direction, speed: 0.2, life: 100 });
}

// --- DATA FROM CV ---
const cvData = {
    skills: ["Manual Testing", "API Checking", "Automation Testing", "Photography", "Spatial awareness"],
    experience: [{ title: "QA Engineer", company: "Digital Economy & Business Committee", date: "May 2024-Present" }],
    achievements: ["AWS Build 1st Runner", "Smartstart 2021"]
};

const dynamicContent = document.getElementById('dynamic-content');
const scoreDisplay = document.querySelector('.score-retro');
let score = 0;

function updateContent(section) {
    let html = `<h3>${section.toUpperCase()}</h3><ul class="nav-list-retro">`;
    (cvData[section] || cvData.skills).forEach(item => {
        html += `<li>> ${typeof item === 'string' ? item : item.title}</li>`;
    });
    html += '</ul>';
    gsap.to(dynamicContent, { opacity: 0, duration: 0.2, onComplete: () => {
        dynamicContent.innerHTML = html;
        gsap.to(dynamicContent, { opacity: 1, duration: 0.2 });
    }});
    score += 1000;
    scoreDisplay.innerText = score.toString().padStart(6, '0');
    // Trigger "Battle" on click
    characters.forEach(c => c.velocity.add(new THREE.Vector3((Math.random()-0.5)*2, (Math.random()-0.5)*2, 0)));
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        updateContent(e.target.getAttribute('href').replace('#', ''));
    });
});

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// --- ANIMATION LOOP ---
let lastFrameTime = 0;
const animate = (time) => {
    requestAnimationFrame(animate);

    // 24 FPS Logic for Characters
    if (time - lastFrameTime > 1000 / 24) {
        lastFrameTime = time;

        characters.forEach((char, i) => {
            // Pick new target if none
            if (!char.target || Math.random() < 0.05) {
                char.target = characters[(i + 1) % characters.length].mesh.position;
            }

            // Move towards target
            const dir = new THREE.Vector3().subVectors(char.target, char.mesh.position).normalize();
            char.velocity.add(dir.multiplyScalar(0.01));
            char.velocity.multiplyScalar(0.95); // Friction
            char.mesh.position.add(char.velocity);

            // Fighting: Throw "pixels" at each other
            if (Math.random() < 0.1) {
                throwWeapon(char.mesh.position, char.target);
            }

            // Bounce off boundaries
            if (Math.abs(char.mesh.position.x) > 10) char.velocity.x *= -1;
            if (Math.abs(char.mesh.position.y) > 6) char.velocity.y *= -1;
            
            // Subtle "jump" animation
            char.mesh.position.y += Math.sin(time * 0.01) * 0.05;
        });

        // Update Weapons
        for (let i = weapons.length - 1; i >= 0; i--) {
            const w = weapons[i];
            w.mesh.position.add(w.direction.clone().multiplyScalar(w.speed));
            w.life--;
            if (w.life <= 0) {
                scene.remove(w.mesh);
                weapons.splice(i, 1);
            }
        }
    }

    // Smooth background & arcade effects (at 60fps for smoothness)
    starsMesh.rotation.y += 0.001;
    gsap.to(arcadeGroup.rotation, { y: -0.4 + mouseX * 0.2, x: mouseY * 0.1, duration: 2 });
    gsap.to(camera.position, { x: mouseX * 0.5, y: -mouseY * 0.5, duration: 2 });

    renderer.render(scene, camera);
};

animate(0);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
updateContent('skills');