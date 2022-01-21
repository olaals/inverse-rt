import * as THREE from 'three';
import { store, subscribe, BACKEND_URL } from '../app/store';
import { onLoadPointcloud } from '../features/selectedProjectSlice';
import { listsToMatrix4 } from './threeUtils';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';




export class PointcloudModule {
  constructor(scene) {
    this.scans = []
    this.cameraPoses = []
    this.laserPoses = []
    this.scene = scene

    this.fetchPointcloud()
    this.activePointcloud = null

    //this.createPointCloud()
    this.showHidePointcloud()
    this.selectActivePointcloud()
  }



  selectActivePointcloud() {
    subscribe("selectedProject.selectedScan", state => {
      console.log("selectActivePointcloud", this.activePointcloud)
      if (this.activePointcloud !== null) {
        this.activePointcloud.material.color.setRGB(1, 0, 0);
      }
      let selectedScan = state.selectedProject.selectedScan
      console.log("selectActivePointcloud", selectedScan)
      if (selectedScan != -1) {
        this.activePointcloud = this.scans[selectedScan]
        // change color of active point cloud to green
        this.activePointcloud.material.color.setRGB(0, 0, 1);

      }
    })
  }

  showHidePointcloud() {
    subscribe("selectedProject.showPointcloud", state => {
      let showPointcloud = state.selectedProject.showPointcloud

      if (showPointcloud) {
        this.scans.forEach(scan => {
          this.scene.add(scan)
        })
      } else {
        this.scans.forEach(scan => {
          this.scene.remove(scan)
        })
      }
    })
  }

  addLaser(matrix4Pose) {
    const url = BACKEND_URL + "/laser.obj"
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
      object.applyMatrix(matrix4Pose)
      // append laser to laserPoses
      this.laserPoses.push(object)
      // add laser to scene
      this.scene.add(object)
    })
  }

  addCamera(matrix4Pose) {
    const url = BACKEND_URL + "/camera.obj"
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
      object.applyMatrix(matrix4Pose)
      // append camera to cameraPoses
      this.cameraPoses.push(object)
      // add camera to scene
      this.scene.add(object)
    })
  }

  fetchPointcloud() {
    this.scans = []

    const fetch_req = async (projectName) => {
      let response = await fetch(BACKEND_URL + "/get-pointcloud?project=" + projectName)
      let json = await response.json()
      let pointclouds = json.pointclouds
      let cameraPoses = json.camera_poses
      let laserPoses = json.laser_poses

      cameraPoses.forEach(pose => {
        this.cameraPoses.push(listsToMatrix4(pose))
      })
      laserPoses.forEach(pose => {
        this.laserPoses.push(listsToMatrix4(pose))
      })


      console.log(cameraPoses[0])
      console.log()
      let cameraPose = listsToMatrix4(cameraPoses[0])
      this.addCamera(cameraPose)
      let laserPose = listsToMatrix4(laserPoses[0])
      this.addLaser(laserPose)



      // update  scene
      this.scene.updateMatrixWorld(true)
      console.log("sphere should be added")



      pointclouds.forEach(pointcloud => {
        this.addPointCloud(pointcloud)
      })
      let numScans = this.scans.length
      store.dispatch(onLoadPointcloud(numScans - 1))
    }

    subscribe("selectedProject.projectName", state => {
      console.log("fetchPointcloud")
      let projectName = state.selectedProject.projectName
      console.log("fetch req project name", projectName)
      fetch_req(projectName)
    })


  }

  addPointCloud(pointcloud) {
    console.log("addPointCloud")
    const geometry = new THREE.BufferGeometry();
    // flatten array pointcloud using flat() array method
    const positions = pointcloud.flat()
    // get length of positions
    const num_points = positions.length / 3
    let colors = []
    let color = new THREE.Color();

    for (let i = 0; i < num_points; i++) {
      //set red color for all points
      color.setRGB(1, 0, 0);
      // append to colors
      colors.push(color.r, color.g, color.b);
    }



    //geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));


    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    // set color attrubute
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    geometry.computeBoundingSphere();

    const material = new THREE.PointsMaterial({ color: 0xFF0000, size: 0.01, vertexColors: true });

    let points = new THREE.Points(geometry, material);
    this.scans.push(points)
  }

  createPointCloud() {
    console.log("createPointCloud")

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
    console.log("positions")
    console.log(positions)
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    //geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    geometry.computeBoundingSphere();

    //

    const material = new THREE.PointsMaterial({ color: 0xFF0000, size: 0.1, vertexColors: true });

    let points = new THREE.Points(geometry, material);
    // append points to scans
    this.scans.append(points)

    //this.scene.add(points);

  }
}