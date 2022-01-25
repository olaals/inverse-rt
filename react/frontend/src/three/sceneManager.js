import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { store, subscribe } from '../app/store'
//import { ClickHandler } from './clickHandler';
import { MeshModule } from './meshModule'
import { PointcloudModule } from './pointcloudModule';
import { CameraLaserModule } from './cameraLaserModule';
import { SceneSettingsModule } from './sceneSettingsModule';


export class SceneManager {
  constructor() {

    this.scene = this.createScene()
    this.initLights()
    this.initSceneModules(this.scene)

  }

  initSceneModules(scene) {
    this.meshModule = new MeshModule(scene)
    this.pointcloudModule = new PointcloudModule(scene)
    this.cameraLaserModule = new CameraLaserModule(scene)
    this.sceneSettingsModule = new SceneSettingsModule(scene)
  }

  getScene() {
    return this.scene
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



  createScene() {
    var scene = new THREE.Scene()
    //add axeshelper
    var axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);

    return scene
  }

}