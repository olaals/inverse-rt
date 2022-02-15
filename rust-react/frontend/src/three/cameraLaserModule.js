import * as THREE from 'three';
import { store, subscribe, BACKEND_URL } from '../app/store';
import { onLoadPointcloud } from '../features/selectedProjectSlice';
import { listsToMatrix4 } from './threeUtils';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export class CameraLaserModule {
  constructor(scene) {
    console.log("cameraLaserModule")
    this.scene = scene
    this.cameraPoses = []
    this.laserPoses = []

    this.getPoses()
    this.showCamLaser()
    this.camera = null
    this.laser = null
    this.addLaser()
    this.addCamera()
    this.wasHidden = true
  }

  showCamLaser() {
    subscribe("selectedProject.selectedScan", state => {
      let selectedScan = state.selectedProject.selectedScan
      if (selectedScan == -1) {
        this.wasHidden = true
        this.scene.remove(this.camera)
        this.scene.remove(this.laser)
        return
      }

      if (this.wasHidden) {
        console.log("added camera to scene")
        this.scene.add(this.camera)
        this.scene.add(this.laser)
        this.wasHidden = false
      }

      this.camera.setRotationFromMatrix(this.cameraPoses[selectedScan])
      this.laser.setRotationFromMatrix(this.laserPoses[selectedScan])
      // set translation of laser based on laser pose
      this.laser.position.setFromMatrixPosition(this.laserPoses[selectedScan])
      this.camera.position.setFromMatrixPosition(this.cameraPoses[selectedScan])





    })
  }

  getPoses() {
    subscribe("selectedProject.projectName", state => {
      let selectedProject = state.selectedProject.projectName

      const fetchPoses = async () => {
        const response = await fetch(BACKEND_URL + "/get-cam-laser-poses?project=" + selectedProject)
        const data = await response.json()
        console.log("getPoses", data)
        data.camera_poses.forEach(pose => {
          this.cameraPoses.push(listsToMatrix4(pose))
        })
        data.laser_poses.forEach(pose => {
          this.laserPoses.push(listsToMatrix4(pose))
        })

        console.log(this.cameraPoses)
      }

      fetchPoses()

    })

  }

  addLaser() {
    const url = BACKEND_URL + "/assets/laser.obj"
    const loader = new OBJLoader();
    loader.load(url, (object) => {
      // create phong material
      const material = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        specular: 0xccccaa,
        shininess: 2,
        flatShading: true
      });
      // add material to object
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material = material
        }
      })
      // set pose of laser
      //object.applyMatrix4(matrix4Pose)
      // append laser to laserPoses
      this.laser = object
    })
  }

  addCamera() {
    const url = BACKEND_URL + "/assets/camera.obj"
    const loader = new OBJLoader();
    loader.load(url, (object) => {
      // create phong material
      const material = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        specular: 0xccccaa,
        shininess: 2,
        flatShading: true
      });
      // add material to object
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material = material
        }
      })
      // set pose of camera
      //object.applyMatrix4(matrix4Pose)
      // append camera to cameraPoses
      this.camera = object
    })
  }

}