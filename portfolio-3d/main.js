// Portfolio 3D - Virgile Allix
// Main JavaScript file

// Scene setup
let scene, camera, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let canJump = false;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let projectObjects = [];
let nearestProject = null;

// Projects data
const projects = [
    {
        id: 'mt-conges',
        name: 'MT-Congés',
        category: 'Application Java',
        description: 'Application de gestion des congés pour MTB111. Interface pour les employés pour soumettre leurs demandes de congés, workflow de validation hiérarchique, et tableau de bord RH pour la planification des ressources.',
        tech: ['Java', 'Spring Boot', 'MySQL', 'JavaFX', 'Hibernate'],
        position: { x: 10, y: 1, z: 0 },
        color: 0x00d4ff
    },
    {
        id: 'portfolio',
        name: 'Portfolio Personnel',
        category: 'Développement Web',
        description: 'Site web responsive présentant mes projets et compétences. Design moderne avec des easter eggs et mini-jeux interactifs intégrés.',
        tech: ['HTML', 'CSS', 'JavaScript', 'Three.js'],
        position: { x: -10, y: 1, z: 0 },
        color: 0xff6b6b
    },
    {
        id: 'assets-jeu',
        name: 'Assets de Jeu',
        category: 'Modélisation 3D',
        description: 'Création d\'objets 3D pour environnement de jeu. Modélisation, texturing et optimisation pour le rendu temps réel.',
        tech: ['Blender', '3D Modeling', 'UV Mapping', 'Texturing'],
        position: { x: 0, y: 1, z: 10 },
        color: 0x4ecdc4
    },
    {
        id: 'caisse',
        name: 'Système d\'ouverture de caisse',
        category: 'Application Web PHP',
        description: 'Application web PHP avec base de données MySQL pour la gestion des caisses et des transactions.',
        tech: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
        position: { x: 0, y: 1, z: -10 },
        color: 0xffe66d
    },
    {
        id: 'desktop-app',
        name: 'Application Desktop',
        category: 'Application Java',
        description: 'Application développée avec Java. Interface utilisateur intuitive avec fonctionnalités avancées.',
        tech: ['Java', 'JavaFX'],
        position: { x: 15, y: 1, z: -8 },
        color: 0xa8e6cf
    }
];

// Initialize
function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1e);
    scene.fog = new THREE.Fog(0x0a0a1e, 0, 75);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Pointer Lock Controls
    controls = new THREE.PointerLockControls(camera, renderer.domElement);

    renderer.domElement.addEventListener('click', () => {
        controls.lock();
    });

    controls.addEventListener('lock', () => {
        console.log('Controls locked');
    });

    controls.addEventListener('unlock', () => {
        console.log('Controls unlocked');
    });

    scene.add(controls.getObject());

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Add point lights for atmosphere
    const pointLight1 = new THREE.PointLight(0x00d4ff, 1, 50);
    pointLight1.position.set(10, 5, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff6b6b, 1, 50);
    pointLight2.position.set(-10, 5, 0);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x4ecdc4, 1, 50);
    pointLight3.position.set(0, 5, 10);
    scene.add(pointLight3);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(100, 50, 0x00d4ff, 0x1a1a2e);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Create project displays
    createProjectDisplays();

    // Add particles
    createParticles();

    // Add decorative cubes
    createDecorativeCubes();

    // Event listeners
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onWindowResize);

    // Modal controls
    document.getElementById('close-modal').addEventListener('click', closeModal);

    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 1000);

    // Animation loop
    animate();
}

// Create project displays (kiosks)
function createProjectDisplays() {
    projects.forEach(project => {
        const group = new THREE.Group();

        // Base pedestal
        const pedestalGeometry = new THREE.CylinderGeometry(1.5, 1.8, 0.3, 32);
        const pedestalMaterial = new THREE.MeshStandardMaterial({
            color: 0x2d2d44,
            metalness: 0.7,
            roughness: 0.3
        });
        const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
        pedestal.position.y = 0.15;
        pedestal.castShadow = true;
        pedestal.receiveShadow = true;
        group.add(pedestal);

        // Main display column
        const columnGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
        const columnMaterial = new THREE.MeshStandardMaterial({
            color: 0x3d3d5c,
            metalness: 0.8,
            roughness: 0.2
        });
        const column = new THREE.Mesh(columnGeometry, columnMaterial);
        column.position.y = 1.3;
        column.castShadow = true;
        group.add(column);

        // Glowing orb on top
        const orbGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const orbMaterial = new THREE.MeshStandardMaterial({
            color: project.color,
            emissive: project.color,
            emissiveIntensity: 0.5,
            metalness: 0.3,
            roughness: 0.2
        });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.position.y = 2.5;
        orb.castShadow = true;
        group.add(orb);

        // Rotating ring around orb
        const ringGeometry = new THREE.TorusGeometry(1.2, 0.05, 16, 100);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: project.color,
            emissive: project.color,
            emissiveIntensity: 0.8,
            metalness: 1,
            roughness: 0
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.y = 2.5;
        ring.rotation.x = Math.PI / 2;
        group.add(ring);

        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(1, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: project.color,
            transparent: true,
            opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = 2.5;
        glow.scale.set(1.2, 1.2, 1.2);
        group.add(glow);

        group.position.set(project.position.x, project.position.y, project.position.z);

        group.userData = {
            projectId: project.id,
            orb: orb,
            ring: ring,
            glow: glow
        };

        projectObjects.push(group);
        scene.add(group);
    });
}

// Create floating particles
function createParticles() {
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = Math.random() * 50;
        positions[i + 2] = (Math.random() - 0.5) * 100;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00d4ff,
        size: 0.1,
        transparent: true,
        opacity: 0.6
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
}

// Create decorative cubes
function createDecorativeCubes() {
    const cubePositions = [
        { x: 20, z: 20 }, { x: -20, z: 20 }, { x: 20, z: -20 }, { x: -20, z: -20 },
        { x: 25, z: 0 }, { x: -25, z: 0 }, { x: 0, z: 25 }, { x: 0, z: -25 }
    ];

    cubePositions.forEach(pos => {
        const size = Math.random() * 2 + 1;
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshStandardMaterial({
            color: Math.random() * 0xffffff,
            emissive: Math.random() * 0xffffff,
            emissiveIntensity: 0.3,
            metalness: 0.5,
            roughness: 0.5
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(pos.x, size / 2, pos.z);
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);
    });
}

// Keyboard controls
function onKeyDown(event) {
    switch (event.code) {
        case 'KeyW':
        case 'KeyZ':
            moveForward = true;
            break;
        case 'KeyA':
        case 'KeyQ':
            moveLeft = true;
            break;
        case 'KeyS':
            moveBackward = true;
            break;
        case 'KeyD':
            moveRight = true;
            break;
        case 'Space':
            if (canJump) velocity.y += 5;
            canJump = false;
            break;
        case 'KeyE':
            if (nearestProject) {
                openProjectModal(nearestProject.userData.projectId);
            }
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'KeyW':
        case 'KeyZ':
            moveForward = false;
            break;
        case 'KeyA':
        case 'KeyQ':
            moveLeft = false;
            break;
        case 'KeyS':
            moveBackward = false;
            break;
        case 'KeyD':
            moveRight = false;
            break;
    }
}

// Check proximity to projects
function checkProximity() {
    const playerPosition = controls.getObject().position;
    let closest = null;
    let minDistance = Infinity;

    projectObjects.forEach(obj => {
        const distance = playerPosition.distanceTo(obj.position);
        if (distance < minDistance && distance < 5) {
            minDistance = distance;
            closest = obj;
        }
    });

    if (closest && closest !== nearestProject) {
        nearestProject = closest;
        document.getElementById('interaction-hint').classList.add('show');
    } else if (!closest && nearestProject) {
        nearestProject = null;
        document.getElementById('interaction-hint').classList.remove('show');
    }
}

// Open project modal
function openProjectModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    document.getElementById('modal-category').textContent = project.category;
    document.getElementById('modal-title').textContent = project.name;
    document.getElementById('modal-description').textContent = project.description;

    const techContainer = document.getElementById('modal-tech');
    techContainer.innerHTML = '';
    project.tech.forEach(tech => {
        const badge = document.createElement('div');
        badge.className = 'tech-badge';
        badge.textContent = tech;
        techContainer.appendChild(badge);
    });

    document.getElementById('project-modal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('project-modal').classList.remove('active');
}

// Window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    const delta = 0.016; // Assuming 60fps

    if (controls.isLocked) {
        // Movement
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 5.0 * delta; // Gravity

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * 40.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 40.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        controls.getObject().position.y += velocity.y * delta;

        if (controls.getObject().position.y < 2) {
            velocity.y = 0;
            controls.getObject().position.y = 2;
            canJump = true;
        }

        checkProximity();
    }

    // Animate project displays
    projectObjects.forEach(obj => {
        obj.userData.orb.rotation.y += 0.01;
        obj.userData.ring.rotation.z += 0.02;
        obj.userData.glow.rotation.y -= 0.005;

        // Pulsing glow effect
        const scale = 1.2 + Math.sin(time * 0.001) * 0.1;
        obj.userData.glow.scale.set(scale, scale, scale);
    });

    renderer.render(scene, camera);
}

// Start the application
init();
