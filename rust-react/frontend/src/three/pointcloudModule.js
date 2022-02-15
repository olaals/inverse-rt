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
    this.setPointcloudSize()
    this.pointHashTable = {}
  }

  setPointcloudSize() {
    subscribe('settings.pointcloudSize', (state) => {
      console.log("setPointcloudSize", state.settings.pointcloudSize)
      let size = state.settings.pointcloudSize / 100000.0
      this.scans.forEach(scan => {
        // set size of each point in pointcloud to size
        scan.material.size = size
      })
    })
  }

  roundFloatToString(num) {
    // round a decimal number to 5 places and return as string
    return (Math.round(num * 100000) / 100000).toFixed(2)
  }

  getDictIdx(x, y, z) {
    let key = this.roundFloatToString(x) + "," + this.roundFloatToString(y) + "," + this.roundFloatToString(z)
    return key
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
        this.activePointcloud.material.color.setRGB(0, 1, 0);





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

  fetchPointcloud() {
    this.scans = []

    const fetch_req = async (projectName) => {
      let response = await fetch(BACKEND_URL + "/get-pointcloud?project=" + projectName)
      let json = await response.json()
      let pointclouds = json.pointclouds



      let idx = 0
      pointclouds.forEach(pointcloud => {
        this.addPointCloud(pointcloud, idx)
        idx += 1;
      })
      let numScans = this.scans.length
      store.dispatch(onLoadPointcloud(numScans - 1))
    }

    subscribe("selectedProject.projectName", state => {
      console.log("fetchPointcloud")
      let projectName = state.selectedProject.projectName
      fetch_req(projectName)
    })


  }

  addPointCloud(pointcloud, idx) {
    console.log("addPointCloud")
    const geometry = new THREE.BufferGeometry();
    // flatten array pointcloud using flat() array method
    const positions = pointcloud.flat()
    // get length of positions
    const num_points = positions.length / 3
    let colors = []
    let color = new THREE.Color();

    let indices = new Uint16Array(num_points);

    let testKey = ""

    for (let i = 0; i < num_points; i++) {
      indices[i] = i;

      //if (i < 10) {

      this.pointHashTable[i + this.getDictIdx(pointcloud[i][0], pointcloud[i][1], pointcloud[i][2])] = [i, idx];
      if (i == 0 && idx == 0) {
        testKey += this.getDictIdx(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
        console.log("testKey", testKey)
        console.log(this.pointHashTable[testKey])
      }

      //}
      //console.log("pointHashTable", this.pointHashTable)

      //set red color for all points
      color.setRGB(1, 1, 1);
      // append to colors
      colors.push(color.r, color.g, color.b);
    }



    //geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));


    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('random_attr', new THREE.Float32BufferAttribute(positions, 3));
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