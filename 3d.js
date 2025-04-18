console.log("FBXLoader:", THREE.FBXLoader);

const canvas = document.getElementById('face-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
const width = 500;
const height = 300;
renderer.setSize(width, height);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
camera.position.z = 2.75;

// Light
const light = new THREE.DirectionalLight(0xaaaaaa, 1);
light.position.set(0, 0, 5).normalize();
scene.add(light);
const lightA = new THREE.AmbientLight( 0x707070 ); // soft white light
scene.add( lightA );

// Head (Sphere)
let head = null;
const loader = new THREE.GLTFLoader();

loader.load('./resources/face.glb', (gltf) => {
    head = gltf.scene;
    head.scale.set(1.5, 1.5, 1.5); // adjust scale if needed
    scene.add(head);
}, undefined, (error) => {
    console.error('Error loading GLTF:', error);
});

let targetRotation = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
    // Get canvas dimensions and position
    const rect = canvas.getBoundingClientRect();
    
    // Calculate normalized coordinates (-1 to 1) relative to canvas center
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((event.clientY - rect.top) / rect.height) * -2 - 1);
    
    targetRotation.y = x * 0.15; 
    targetRotation.x = y * 0.15;
});

function animate() {
    requestAnimationFrame(animate);
    if(head !== null){
        // Keep the original smoothness factor
        head.rotation.y += (targetRotation.y - head.rotation.y) * 0.1;
        head.rotation.x += (targetRotation.x - head.rotation.x) * 0.1;
    }
    renderer.render(scene, camera);
}

animate();