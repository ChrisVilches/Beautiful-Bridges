/* eslint-env browser */

import * as THREE from 'three'
import _ from 'underscore'
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls'
import steelTexture from 'Textures/steel-texture.jpg'
import groundTexture from 'Textures/ground-texture.jpg'

const PLANE_WIDTH = 35

const CAMERA_POSITION = [0, -200, 0]

function resizeRendererToDisplaySize (renderer) {
  const canvas = renderer.domElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const needResize = (canvas.width !== width || canvas.height !== height) && width > 0 && height > 0
  if (needResize) {
    renderer.setSize(width, height, false)
  }
  return needResize
}

export function createScene (domContainer, canvasSelector) {
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setClearColor(0xDDDDDD, 1)

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
  const controls = new OrbitControls(camera, renderer.domElement)

  const resetCameraPosition = () => {
    camera.position.set(...CAMERA_POSITION)
    camera.rotation.set(0, 0, 0)
    controls.target.set(0, 0, 0)
    controls.update()
  }

  function renderCanvas () {
    requestAnimationFrame(renderCanvas)
    renderer.render(scene, camera)

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
  }

  resetCameraPosition()

  scene.add(camera)

  renderCanvas()

  return {
    resetCameraPosition,
    drawBridge: function (bridgeHeight, ground, solutionArcs) {
      drawBridge(scene, bridgeHeight, ground, solutionArcs)
    },
    updateDOM: function () {
      domContainer.find(canvasSelector).html(renderer.domElement)
    }
  }
}

function createMaterialWithTexture (imageUrl, color) {
  const image = new Image()
  const texture = new THREE.Texture(image)
  image.onload = () => { texture.needsUpdate = true }
  image.src = imageUrl

  const material = new THREE.MeshBasicMaterial()
  material.map = texture
  if (typeof color !== 'undefined' && color !== null) {
    material.color = new THREE.Color(color)
  }
  material.needsUpdate = true
  material.side = THREE.DoubleSide
  return material
}

// Create several textures with a different color each. Then pick a random one for each part of the bridge (plane, arc, etc).

const steelMaterials = [0x9B9B9B, 0xB3B3B3, 0xBFBFBF, 0x888888].map(color => createMaterialWithTexture(steelTexture, color))
const groundMaterials = [0x6B545A, 0x6C5D61, 0x8E8487, 0xE1C8AE].map(color => createMaterialWithTexture(groundTexture, color))

const steelMaterial = () => _.sample(steelMaterials)
const groundMaterial = () => _.sample(groundMaterials)

function renderGround (scene, ground) {
  for (let i = 0; i < ground.length - 1; i++) {
    const dx = ground[i + 1].x - ground[i].x
    const dy = ground[i + 1].y - ground[i].y

    const length = Math.sqrt((dx * dx) + (dy * dy))
    const geometry = new THREE.PlaneGeometry(length, PLANE_WIDTH)
    const plane = new THREE.Mesh(geometry, groundMaterial())

    const ang = Math.atan2(dy, dx)
    plane.rotation.set(0, -ang, 0)

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
    const cylinder = new THREE.Mesh(geometry, steelMaterial())

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
  const plane = new THREE.Mesh(geometry, steelMaterial())

  plane.position.set(ground[position].x, 0, ground[position].y + length / 2)
  plane.rotation.set(0, Math.PI / 2, 0)
  scene.add(plane)
}

function renderPillars (scene, solutionArcs, bridgeHeight, ground) {
  if (solutionArcs.length === 0) return

  let prevRadius = Infinity

  for (let i = 0; i < solutionArcs.length - 1; i++) {
    const from = solutionArcs[i]
    const to = solutionArcs[i + 1]
    const radius = (ground[to].x - ground[from].x) / 2
    renderOnePillar(scene, bridgeHeight, ground, from, Math.min(radius, prevRadius))

    prevRadius = radius
  }

  const from = solutionArcs[solutionArcs.length - 2]
  const to = solutionArcs[solutionArcs.length - 1]
  const radius = (ground[to].x - ground[from].x) / 2
  renderOnePillar(scene, bridgeHeight, ground, to, radius)
}

function drawBridge (scene, bridgeHeight, ground, solutionArcs) {
  scene.remove.apply(scene, scene.children)

  renderGround(scene, ground)
  renderBridgeTop(scene, bridgeHeight, ground)
  renderArcs(scene, bridgeHeight, solutionArcs, ground)
  renderPillars(scene, solutionArcs, bridgeHeight, ground)

  // TODO: This is a hack to center all children. It's done this
  //       way because the math used when rendering is inaccurate (positioning only).
  const xLength = ground[ground.length - 1].x - ground[0].x

  scene.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.position.set((child.position.x - xLength / 2) - ground[0].x, child.position.y, child.position.z - bridgeHeight / 2)
    }
  })
}
