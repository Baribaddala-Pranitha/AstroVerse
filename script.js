// Global scene setup variables
let solarSystemScene, galaxyScene, starsScene;
let solarSystemRenderer, galaxyRenderer, starsRenderer;
let solarSystemCamera, galaxyCamera, starsCamera;

// Function to show and hide different content tabs
function showPage(pageId) {
    const pages = document.querySelectorAll('.tab-content');
    pages.forEach(page => {
        if (page.id === pageId) {
            page.style.display = 'block';
            if (pageId === 'solar-system' && !solarSystemScene) {
                createSolarSystem('solar-system-container');
            } else if (pageId === 'galaxy' && !galaxyScene) {
                createGalaxy('galaxy-container');
            } else if (pageId === 'stars' && !starsScene) {
                createStars('stars-container');
            }
        } else {
            page.style.display = 'none';
        }
    });
}
// 3D Solar System with all planets orbiting the Sun at slower speeds, modified colors, and larger size
function createSolarSystem(containerId) {
    const container = document.getElementById(containerId);
    solarSystemScene = new THREE.Scene();
    solarSystemCamera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    solarSystemRenderer = new THREE.WebGLRenderer();
    solarSystemRenderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(solarSystemRenderer.domElement);

    // Create the Sun (central star) with a larger size
    const sunGeometry = new THREE.SphereGeometry(10, 32, 32);  // Increased size of the Sun
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    solarSystemScene.add(sun);

    // Planetary settings (radius, orbital distance, and orbit speed)
    // Distances are increased by a factor of 2, but the sizes of planets are increased too
    const planets = [
        { name: "Mercury", radius: 1, distance: 16, color: 0xB8B8B8, orbitSpeed: 0.01 },  // Increased radius
        { name: "Venus", radius: 2.5, distance: 24, color: 0xE8C6A4, orbitSpeed: 0.008 },  // Increased radius
        { name: "Earth", radius: 3, distance: 32, color: 0x0066CC, orbitSpeed: 0.006 },  // Increased radius
        { name: "Mars", radius: 2, distance: 40, color: 0xD04C37, orbitSpeed: 0.004 },   // Increased radius
        { name: "Jupiter", radius: 5, distance: 60, color: 0xF2B48C, orbitSpeed: 0.003 }, // Increased radius
        { name: "Saturn", radius: 4.5, distance: 80, color: 0xE5C09A, orbitSpeed: 0.002 },  // Increased radius
        { name: "Uranus", radius: 4, distance: 100, color: 0x66CCCC, orbitSpeed: 0.0015 }, // Increased radius
        { name: "Neptune", radius: 3.5, distance: 120, color: 0x3D73A3, orbitSpeed: 0.0012 }  // Increased radius
    ];

    // Create planet objects
    const planetMeshes = planets.map(planet => {
        const planetGeometry = new THREE.SphereGeometry(planet.radius, 32, 32);
        const planetMaterial = new THREE.MeshBasicMaterial({ color: planet.color });
        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        planetMesh.distanceFromSun = planet.distance;
        solarSystemScene.add(planetMesh);
        return {
            mesh: planetMesh,
            speed: planet.orbitSpeed,
            distance: planet.distance
        };
    });

    // Create Saturn's rings
    const saturnRingGeometry = new THREE.RingGeometry(30, 35, 32);  // Increased ring size
    const saturnRingMaterial = new THREE.MeshBasicMaterial({ color: 0xD8B243, side: THREE.DoubleSide });
    const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
    saturnRing.rotation.x = Math.PI / 2;  // Make the ring horizontal
    solarSystemScene.add(saturnRing);

    // Camera position (adjusted to ensure the larger system fits within view)
    solarSystemCamera.position.z = 200;  // Adjust camera further to fit larger planets

    function animateSolarSystem() {
        requestAnimationFrame(animateSolarSystem);

        // Rotate the Sun (central star)
        sun.rotation.y += 0.005;

        // Orbit the planets around the Sun at slower speeds
        planetMeshes.forEach(planet => {
            planet.mesh.rotation.y += 0.005; // Rotate the planet on its own axis
            // Update planet positions based on the new distances and sizes
            planet.mesh.position.x = planet.distance * Math.cos(Date.now() * planet.speed);
            planet.mesh.position.z = planet.distance * Math.sin(Date.now() * planet.speed);
        });

        // Rotate the rings around Saturn
        saturnRing.rotation.z += 0.001;

        // Render the scene
        solarSystemRenderer.render(solarSystemScene, solarSystemCamera);
    }

    animateSolarSystem();
}

function createGalaxy(containerId) {
    const container = document.getElementById(containerId);
    galaxyScene = new THREE.Scene();
    galaxyCamera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    galaxyRenderer = new THREE.WebGLRenderer();
    galaxyRenderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(galaxyRenderer.domElement);

    // Create a central star (core of the galaxy)
    const centralStarGeometry = new THREE.SphereGeometry(5, 32, 32);
    const centralStarMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    const centralStar = new THREE.Mesh(centralStarGeometry, centralStarMaterial);
    galaxyScene.add(centralStar);

    // Create a grid of stars (represented as cubes)
    const gridSize = 10;
    const starSpacing = 5;
    const grid = new THREE.Group();
    
    for (let x = -gridSize; x <= gridSize; x++) {
        for (let y = -gridSize; y <= gridSize; y++) {
            for (let z = -gridSize; z <= gridSize; z++) {
                const starGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); // Cube shape for stars
                const starMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xFFFFFF });
                const star = new THREE.Mesh(starGeometry, starMaterial);
                star.position.set(x * starSpacing, y * starSpacing, z * starSpacing);
                grid.add(star);
            }
        }
    }

    galaxyScene.add(grid);

    // Create a moon orbiting around the central star
    const moonGeometry = new THREE.SphereGeometry(1, 32, 32);
    const moonMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    galaxyScene.add(moon);
    moon.position.x = 20; // Set moon's initial position

    // Create quasars
    const quasarCount = 5;  // Number of quasars
    const quasarGroup = new THREE.Group();

    for (let i = 0; i < quasarCount; i++) {
        const quasarCoreGeometry = new THREE.SphereGeometry(2, 32, 32); // Quasar central core
        const quasarCoreMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
        const quasarCore = new THREE.Mesh(quasarCoreGeometry, quasarCoreMaterial);

        // Quasar glowing disk (representing the accretion disk)
        const quasarDiskGeometry = new THREE.RingGeometry(5, 8, 32);  // Larger disk for the quasar
        const quasarDiskMaterial = new THREE.MeshBasicMaterial({ color: 0xFF4500, side: THREE.DoubleSide });
        const quasarDisk = new THREE.Mesh(quasarDiskGeometry, quasarDiskMaterial);
        quasarDisk.rotation.x = Math.PI / 2;  // Make the disk horizontal

        // Set the position of the quasar randomly
        const xPosition = Math.random() * 1000 - 500;
        const yPosition = Math.random() * 1000 - 500;
        const zPosition = Math.random() * 1000 - 500;

        // Add quasar core and disk to the quasar group
        const quasar = new THREE.Group();
        quasar.position.set(xPosition, yPosition, zPosition);
        quasar.add(quasarCore);
        quasar.add(quasarDisk);
        quasarGroup.add(quasar);
    }

    galaxyScene.add(quasarGroup);

    galaxyCamera.position.z = 100;

    function animateGalaxy() {
        requestAnimationFrame(animateGalaxy);

        // Rotate the entire grid (galaxy) and the central star
        grid.rotation.x += 0.001;
        grid.rotation.y += 0.001;

        // Rotate the moon around the central star
        moon.position.x = 20 * Math.cos(Date.now() * 0.001);
        moon.position.z = 20 * Math.sin(Date.now() * 0.001);

        // Rotate quasars' disks (simulate the movement of the accretion disk)
        quasarGroup.rotation.y += 0.001;

        // Render the scene
        galaxyRenderer.render(galaxyScene, galaxyCamera);
    }

    animateGalaxy();
}

// 3D Stars
function createStars(containerId) {
    const container = document.getElementById(containerId);
    starsScene = new THREE.Scene();
    starsCamera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    starsRenderer = new THREE.WebGLRenderer();
    starsRenderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(starsRenderer.domElement);

    // Create stars
    const starGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFF0 });
    const starCount = 500;

    for (let i = 0; i < starCount; i++) {
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.x = Math.random() * 1000 - 500;
        star.position.y = Math.random() * 1000 - 500;
        star.position.z = Math.random() * 1000 - 500;
        starsScene.add(star);
    }

    starsCamera.position.z = 300;

    function animateStars() {
        requestAnimationFrame(animateStars);

        // Rotate stars
        starsScene.rotation.x += 0.001;
        starsScene.rotation.y += 0.001;

        starsRenderer.render(starsScene, starsCamera);
    }
    animateStars();
}

// Initialize the Home page by default
showPage('home');
