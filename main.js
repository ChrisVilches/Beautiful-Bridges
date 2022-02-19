const worker = new Worker('worker.js')

worker.postMessage({
  num: 2
})

worker.onmessage = function (e) {
  console.log('Response from worker:', e.data)
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();
var screenWidth = window.innerWidth,
  screenHeight = window.innerHeight,
  viewAngle = 75,
  nearDistance = 0.1,
  farDistance = 1000;

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.x = 100;
camera.position.y = 100;
camera.position.z = 100;
const controls = new THREE.OrbitControls(camera, renderer.domElement);

scene.add(camera);


var basicMaterial = new THREE.MeshPhysicalMaterial({ color: 0x0095DD, clearcoat: 0.3 });

const path = 'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/';
const format = '.jpg';
const urls = [
  path + 'px' + format, path + 'nx' + format,
  path + 'py' + format, path + 'ny' + format,
  path + 'pz' + format, path + 'nz' + format
];

const reflectionCube = new THREE.CubeTextureLoader().load(urls);
reflectionCube.encoding = THREE.sRGBEncoding;

const textureLoader = new THREE.TextureLoader();
const normalMap = textureLoader.load('https://threejs.org/examples/models/obj/ninja/normal.png');
const aoMap = textureLoader.load('https://threejs.org/examples/models/obj/ninja/ao.jpg');
const displacementMap = textureLoader.load('https://threejs.org/examples/models/obj/ninja/displacement.jpg');

const settings = {
  metalness: 1.0,
  roughness: 0.4,
  ambientIntensity: 0.2,
  aoMapIntensity: 1.0,
  envMapIntensity: 1.0,
  displacementScale: 2.436143, // from original model
  normalScale: 1.0
};

var material = new THREE.MeshStandardMaterial({

  color: 0x888888,
  roughness: settings.roughness,
  metalness: settings.metalness,

  normalMap: normalMap,
  normalScale: new THREE.Vector2(1, - 1), // why does the normal map require negation in this case?

  aoMap: aoMap,
  aoMapIntensity: 1,

  displacementMap: displacementMap,
  displacementScale: settings.displacementScale,
  displacementBias: -0.428408, // from original model

  envMap: reflectionCube,
  envMapIntensity: settings.envMapIntensity,

  side: THREE.DoubleSide
});

const bridgeHeight = 60
const groundFunctionX = [0, 20, 30, 50, 70]
const groundFunctionY = [0, 20, 10, 30, 20]
const solutionArcs = [0, 1, 3, 4]

{
  var boxGeometry = new THREE.BoxGeometry(10, 10, 10);
  var cube = new THREE.Mesh(boxGeometry, material);
  scene.add(cube);
  cube.rotation.set(0, 0, 0);
}

{
  // Render ground
  for (let i = 0; i < groundFunctionX.length - 1; i++) {
    const dx = groundFunctionX[i + 1] - groundFunctionX[i]
    const dy = groundFunctionY[i + 1] - groundFunctionY[i]

    const length = Math.sqrt((dx * dx) + (dy * dy))

    const geometry = new THREE.PlaneGeometry(length, 20);
    const material = new THREE.MeshBasicMaterial({ color: i % 2 == 0 ? 0x5F4444 : 0x795353, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);

    var ang = Math.atan(dx / dy)
    ang = Math.atan2(dy, dx)
    plane.rotation.set(0, -ang, 0)

    // TODO: This is necessary only because the planes are center (i.e. position point is in the middle of the plane)
    //       So this can possibly be simplified so that less calculations are used (it doesn't matter if the plane
    //       is centered somewhere else).
    //       This could potentially improve the camera sees the bridge (because of the different center), since right now
    //       the bridge is a bit moved to the right (i.e. not centered).
    var x = groundFunctionX[i] + dx / 2
    var y = groundFunctionY[i] + dy / 2

    plane.position.set(x, 0, y)
    scene.add(plane);
  }
}

{
  const length = groundFunctionX[groundFunctionX.length - 1] - groundFunctionX[0]
  const geometry = new THREE.PlaneGeometry(length, 20);
  const material = new THREE.MeshBasicMaterial({ color: 0x777777, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(groundFunctionX[0] + length / 2, 0, bridgeHeight)
  scene.add(plane);
}

{
  for (let i = 0; i < solutionArcs.length - 1; i++) {
    const from = solutionArcs[i]
    const to = solutionArcs[i + 1]
    const radius = (groundFunctionX[to] - groundFunctionX[from]) / 2

    const geometry = new THREE.CylinderGeometry(radius, radius, 20, 15, 1, true, 0, Math.PI)
    const material = new THREE.MeshBasicMaterial({ color: 0x454545, side: THREE.DoubleSide });
    const cylinder = new THREE.Mesh(geometry, material);

    const centerX = groundFunctionX[from] + radius
    const centerY = bridgeHeight - radius

    cylinder.position.set(centerX, 0, centerY)
    cylinder.rotation.set(0, -Math.PI / 2, 0)
    scene.add(cylinder);
  }
}

function addPilar(scene, position, radius) {
  const length = bridgeHeight - groundFunctionY[position] - radius
  const geometry = new THREE.PlaneGeometry(length, 20);
  const material = new THREE.MeshBasicMaterial({ color: 0x454545, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);

  plane.position.set(groundFunctionX[position], 0, groundFunctionY[position] + length / 2)
  plane.rotation.set(0, Math.PI / 2, 0)
  scene.add(plane);
}

{
  for (let i = 0; i < solutionArcs.length - 1; i++) {
    const from = solutionArcs[i]
    const to = solutionArcs[i + 1]
    const radius = (groundFunctionX[to] - groundFunctionX[from]) / 2

    addPilar(scene, from, radius)
    addPilar(scene, to, radius)
  }
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();

