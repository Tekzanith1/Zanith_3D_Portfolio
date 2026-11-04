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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// --- STARFIELD ---
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 1500;
const posArray = new Float32Array(starsCount * 3);
for(let i = 0; i < starsCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 100;
starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const starsMesh = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.8 }));
scene.add(starsMesh);

// --- ARCADE MACHINE ---
const arcadeGroup = new THREE.Group();
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
const body = new THREE.Mesh(new THREE.BoxGeometry(4, 8, 3), bodyMat);
arcadeGroup.add(body);
const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 3.5), new THREE.MeshBasicMaterial({ color: 0x000000 }));
screen.position.set(0, 1.5, 1.51); arcadeGroup.add(screen);
const ctrl = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 1.5), bodyMat);
ctrl.position.set(0, -0.5, 2.25); arcadeGroup.add(ctrl);
scene.add(arcadeGroup);
arcadeGroup.position.set(2, -1, 0); arcadeGroup.rotation.y = -0.4;
camera.position.z = 10;

// --- PIXEL PUPPET CHARACTERS ---
const loader = new THREE.TextureLoader();
const characters = [];
const charConfigs = [
    { name: 'Naruto', color: 0xff9900, url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' },
    { name: 'Goku', color: 0xff6600, url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' },
    { name: 'Saitama', color: 0xffff00, url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png' },
    { name: 'Itadori', color: 0xff3366, url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' }
];

function createLimb(texture, color) {
    const mat = new THREE.SpriteMaterial({ map: texture, color: color, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.center.set(0.5, 1); // Pivot at top
    return sprite;
}

charConfigs.forEach((config, i) => {
    const texture = loader.load(config.url);
    texture.magFilter = THREE.NearestFilter;
    
    const group = new THREE.Group();
    
    // Main Body Sprite (Head/Torso)
    const bodyMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const bodySprite = new THREE.Sprite(bodyMat);
    bodySprite.scale.set(1.5, 1.5, 1);
    group.add(bodySprite);
    
    // Limbs (Using slightly tinted versions of the sprite for clarity)
    const lArm = createLimb(texture, 0xffffff); lArm.scale.set(0.6, 0.8, 1); lArm.position.set(-0.4, 0.2, -0.1);
    const rArm = createLimb(texture, 0xdddddd); rArm.scale.set(0.6, 0.8, 1); rArm.position.set(0.4, 0.2, 0.1);
    const lLeg = createLimb(texture, 0xcccccc); lLeg.scale.set(0.5, 0.8, 1); lLeg.position.set(-0.2, -0.4, -0.1);
    const rLeg = createLimb(texture, 0xbbbbbb); rLeg.scale.set(0.5, 0.8, 1); rLeg.position.set(0.2, -0.4, 0.1);
    
    group.add(lArm, rArm, lLeg, rLeg);
    group.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5, 2);
    scene.add(group);

    characters.push({
        name: config.name,
        group,
        parts: { lArm, rArm, lLeg, rLeg, body: bodySprite },
        velocity: new THREE.Vector3(),
        target: null,
        animTimer: Math.random() * 10,
        color: config.color
    });
});

// --- COMBAT LOGIC ---
const weapons = [];
function throwWeapon(from, to, color) {
    const weapon = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshBasicMaterial({ color: color }));
    weapon.position.copy(from);
    scene.add(weapon);
    weapons.push({ mesh: weapon, dir: new THREE.Vector3().subVectors(to, from).normalize(), life: 60 });
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
    (cvData[section] || cvData.skills).forEach(item => html += `<li>> ${typeof item === 'string' ? item : item.title}</li>`);
    html += '</ul>';
    gsap.to(dynamicContent, { opacity: 0, duration: 0.2, onComplete: () => {
        dynamicContent.innerHTML = html;
        gsap.to(dynamicContent, { opacity: 1, duration: 0.2 });
    }});
    score += 1000; scoreDisplay.innerText = score.toString().padStart(6, '0');
    characters.forEach(c => c.velocity.add(new THREE.Vector3((Math.random()-0.5)*12, (Math.random()-0.5)*12, 0)));
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

    if (time - lastFrameTime > 1000 / 24) { // 24 FPS Anime Style
        lastFrameTime = time;

        characters.forEach((char, i) => {
            if (!char.target || Math.random() < 0.05) {
                char.target = characters[(i + 1) % characters.length].group.position;
            }

            const dir = new THREE.Vector3().subVectors(char.target, char.group.position).normalize();
            char.velocity.add(dir.multiplyScalar(0.03));
            char.velocity.multiplyScalar(0.92);
            char.group.position.add(char.velocity);

            // BOUNDARIES
            if (Math.abs(char.group.position.x) > 12) char.velocity.x *= -1;
            if (Math.abs(char.group.position.y) > 7) char.velocity.y *= -1;

            // --- PIXEL LIMB ANIMATION ---
            char.animTimer += 0.5;
            const walkSpeed = char.velocity.length() * 4;
            
            // Swing legs
            char.parts.lLeg.rotation.z = Math.sin(char.animTimer) * walkSpeed;
            char.parts.rLeg.rotation.z = Math.sin(char.animTimer + Math.PI) * walkSpeed;
            
            // Swing arms
            char.parts.lArm.rotation.z = Math.sin(char.animTimer + Math.PI) * walkSpeed;
            char.parts.rArm.rotation.z = Math.sin(char.animTimer) * walkSpeed;

            // Combat Action
            if (Math.random() < 0.15) {
                throwWeapon(char.group.position, char.target, char.color);
                gsap.to(char.parts.rArm.rotation, { z: -2, duration: 0.1, yoyo: true, repeat: 1 });
            }

            // Face movement direction
            char.group.scale.x = char.velocity.x > 0 ? 1 : -1;
            
            // Subtle "breathing" scale
            char.parts.body.scale.y = 1.5 + Math.sin(time * 0.01) * 0.05;
        });

        for (let i = weapons.length - 1; i >= 0; i--) {
            const w = weapons[i];
            w.mesh.position.add(w.dir.clone().multiplyScalar(0.5));
            w.mesh.rotation.x += 0.4;
            w.life--;
            if (w.life <= 0) { scene.remove(w.mesh); weapons.splice(i, 1); }
        }
    }

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