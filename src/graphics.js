import * as THREE from 'three'
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls'

/*
TODO: This is rendered incorrectly:

5 60 5 7
0 0
10 30
40 55
50 45
60 20

Actually I realized that the arcs sometimes look a bit deformed. Why is that? Probably another bug.

*/

const PLANE_WIDTH = 35

// TODO: Should be configurable, for example choose which element to transform into the canvas, size, etc.
function createScene () {
  const WIDTH = 800
  const HEIGHT = 400

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(WIDTH, HEIGHT)
  renderer.setClearColor(0xDDDDDD, 1)

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.x = 35
  camera.position.y = 150
  camera.position.z = 100
  new OrbitControls(camera, renderer.domElement) // eslint-disable-line no-new

  scene.add(camera)
  return { renderer, scene, camera }
}

function renderGround (scene, ground) {
  for (let i = 0; i < ground.length - 1; i++) {
    const dx = ground[i + 1].x - ground[i].x
    const dy = ground[i + 1].y - ground[i].y

    const length = Math.sqrt((dx * dx) + (dy * dy))

    const geometry = new THREE.PlaneGeometry(length, PLANE_WIDTH)
    const material = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x5F4444 : 0x795353, side: THREE.DoubleSide })
    const plane = new THREE.Mesh(geometry, material)

    let ang = Math.atan(dx / dy)
    ang = Math.atan2(dy, dx)
    plane.rotation.set(0, -ang, 0)

    // TODO: This is necessary only because the planes are center (i.e. position point is in the middle of the plane)
    //       So this can possibly be simplified so that less calculations are used (it doesn't matter if the plane
    //       is centered somewhere else).
    //       This could potentially improve the camera sees the bridge (because of the different center), since right now
    //       the bridge is a bit moved to the right (i.e. not centered).
    const x = ground[i].x + dx / 2
    const y = ground[i].y + dy / 2

    plane.position.set(x, 0, y)
    scene.add(plane)
  }
}

function renderBridgeTop (scene, bridgeHeight, ground) {
  const length = ground[ground.length - 1].x - ground[0].x
  const geometry = new THREE.PlaneGeometry(length, PLANE_WIDTH)
  const material = new THREE.MeshBasicMaterial({ color: 0x777777, side: THREE.DoubleSide })
  const plane = new THREE.Mesh(geometry, material)
  plane.position.set(ground[0].x + length / 2, 0, bridgeHeight)
  scene.add(plane)
}

function renderArcs (scene, bridgeHeight, solutionArcs, ground) {
  for (let i = 0; i < solutionArcs.length - 1; i++) {
    const from = solutionArcs[i]
    const to = solutionArcs[i + 1]
    const radius = (ground[to].x - ground[from].x) / 2

    const geometry = new THREE.CylinderGeometry(radius, radius, PLANE_WIDTH, 15, 1, true, 0, Math.PI)
    const material = new THREE.MeshBasicMaterial({ color: 0x454545, side: THREE.DoubleSide })
    const cylinder = new THREE.Mesh(geometry, material)

    const centerX = ground[from].x + radius
    const centerY = bridgeHeight - radius

    cylinder.position.set(centerX, 0, centerY)
    cylinder.rotation.set(0, -Math.PI / 2, 0)
    scene.add(cylinder)
  }
}

function renderOnePillar (scene, bridgeHeight, ground, position, radius) {
  const length = bridgeHeight - ground[position].y - radius
  const geometry = new THREE.PlaneGeometry(length, PLANE_WIDTH)
  const material = new THREE.MeshBasicMaterial({ color: 0x454545, side: THREE.DoubleSide })
  const plane = new THREE.Mesh(geometry, material)

  plane.position.set(ground[position].x, 0, ground[position].y + length / 2)
  plane.rotation.set(0, Math.PI / 2, 0)
  scene.add(plane)
}

function renderPillars (scene, solutionArcs, bridgeHeight, ground) {
  for (let i = 0; i < solutionArcs.length - 1; i++) {
    const from = solutionArcs[i]
    const to = solutionArcs[i + 1]
    const radius = (ground[to].x - ground[from].x) / 2

    renderOnePillar(scene, bridgeHeight, ground, from, radius)
    renderOnePillar(scene, bridgeHeight, ground, to, radius)
  }
}

function drawBridge (scene, bridgeHeight, ground, solutionArcs) {
  scene.remove.apply(scene, scene.children)

  renderGround(scene, ground)
  renderBridgeTop(scene, bridgeHeight, ground)
  renderArcs(scene, bridgeHeight, solutionArcs, ground)
  renderPillars(scene, solutionArcs, bridgeHeight, ground)
}

module.exports = {
  createScene,
  drawBridge
}
