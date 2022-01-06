import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js';
//import { ClickHandler } from './clickHandler';
//import { MeshModule } from './meshModule'
//import { PointcloudModule } from './pointcloudModule'


export class SceneManager {
  constructor(canvas, content) {
    //this.pubsub = pubsub
    this.canvas = canvas
    this.content = content
    const width = content.clientWidth
    const height = content.clientHeight
    //this.stats = this.createStats()

    this.scene = this.createScene()
    this.renderer = this.createRenderer(canvas, content)
    this.camera = this.createCamera(width, height)
    //this.clickHandler = new ClickHandler(canvas, this.scene, this.camera, pubsub)
    this.controls = this.createControls(this.camera, this.renderer)
    this.initLights()
    this.createCube()
    console.log("Finished creating scene")
    //this.initSceneModules(this.scene, pubsub)

    //this.points = this.createPointCloud()
    //this.loadObj('/get_obj')
  }

  //initSceneModules(scene, pubsub) {
  //this.meshModule = new MeshModule(scene, pubsub)
  //this.pointcloudModule = new PointcloudModule(scene, pubsub)
  //}

  createCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    this.scene.add(cube)
  }

  initLights() {
    // add 3 point lights to scene
    const light = new THREE.PointLight(0xffffff, 1, 30);
    light.position.set(5, 5, 5);
    this.scene.add(light);
    const light2 = new THREE.PointLight(0xffffff, 1, 30);
    light2.position.set(5, -5, 5);
    this.scene.add(light2);

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

  createPointCloud() {

    const particles = 500000;

    const geometry = new THREE.BufferGeometry();

    const positions = [];
    const colors = [];

    const color = new THREE.Color();

    const n = 10, n2 = 4; // particles spread in the cube
    const indices = new Uint16Array(particles);

    for (let i = 0; i < particles; i++) {
      indices[i] = i;

      // positions

      const x = Math.random() * n - n2;
      const y = Math.random() * n - n2;
      const z = Math.random() * n - n2;

      positions.push(x, y, z);

      // colors

      const vx = (x / n) + 0.5;
      const vy = (y / n) + 0.5;
      const vz = (z / n) + 0.5;

      color.setRGB(vx, vy, vz);

      colors.push(color.r, color.g, color.b);

    }

    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    geometry.computeBoundingSphere();

    //

    const material = new THREE.PointsMaterial({ size: 0.1, vertexColors: true });

    let points = new THREE.Points(geometry, material);
    this.scene.add(points);

    this.clickHandler.appendClickable(points)

    return points

  }

  createScene() {
    var scene = new THREE.Scene()
    //add axeshelper
    var axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);

    return scene
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
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    this.scene.add(camera)
    camera.up.set(0, 0, 1)
    camera.position.set(5, 5, 5)
    camera.lookAt(this.scene.position)
    return camera
  }

  resizeCanvas(width, height) {
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  update() {
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
    //this.stats.update();
  }
  // add points function given position
  addPoints(position) {
    const geometry = new THREE.SphereGeometry(0.1, 32, 32)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.set(position[0], position[1], position[2])
    this.scene.add(sphere)
  }
}