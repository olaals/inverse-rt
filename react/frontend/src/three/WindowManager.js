import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { store, subscribe } from '../app/store'
import { setCameraPos } from '../features/selectedProjectSlice';
//import { ClickHandler } from './clickHandler';

export class WindowManager {
  constructor(sceneManager, canvas, content) {
    //this.pubsub = pubsub
    this.canvas = canvas
    this.content = content
    const width = content.clientWidth
    const height = content.clientHeight
    //this.stats = this.createStats()

    this.scene = sceneManager.getScene()
    this.renderer = this.createRenderer(canvas, content)
    this.camera = this.createCamera(width, height)
    //this.clickHandler = new ClickHandler(canvas, this.scene, this.camera, pubsub)
    this.controls = this.createControls(this.camera, this.renderer)

    //this.points = this.createPointCloud()
    //this.loadObj('/get_obj')
  }





  createStats() {
    const statsEl = document.getElementById('stats');
    let stats = new Stats();
    stats.domElement.style.position = 'relative'
    stats.domElement.style.padding = '20px 20px'
    stats.domElement.style.width = '200px'
    stats.domElement.style.height = '100px'
    stats.domElement.style.zIndex = '10000'
    /*
    let statsAll = stats.domElement.queryAll('canvas')
    for (let i = 0; i < statsAll.length; i++) {
      statsAll[i].style.width = '100px'
      statsAll[i].style.height = '80px'
    }
    */
    statsEl.appendChild(stats.domElement);
    return stats

  }


  createControls(camera, renderer) {
    var controls = new OrbitControls(camera, renderer.domElement);
    return controls
  }

  createRenderer(canvas, content) {
    let width = content.clientWidth
    let height = content.clientHeight
    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    })
    renderer.setSize(width, height)
    return renderer
  }

  createCamera(width, height) {
    let cameraPos = store.getState().selectedProject.cameraPos
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    this.scene.add(camera)
    camera.up.set(0, 0, 1)
    camera.position.set(cameraPos[0], cameraPos[1], cameraPos[2])
    camera.lookAt(this.scene.position)
    return camera
  }

  resizeCanvas(width, height) {
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  disptachCameraPose() {
    let cameraPos = this.camera.position
    store.dispatch(setCameraPos([cameraPos.x, cameraPos.y, cameraPos.z]))
  }

  dispose() {
    this.disptachCameraPose()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
    this.renderer.domElement = null;

  }

  update() {
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
    //this.stats.update();
  }
}