import * as THREE from 'three';
import { store, subscribe, BACKEND_URL } from '../app/store';
import { onLoadPointcloud } from '../features/selectedProjectSlice';
import { setPointcloud } from '../features/pointcloudSlice';
import { listsToMatrix4, createBufferGeo } from './threeUtils';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';




export class PointcloudModule {
  constructor(scene) {
    this.pointcloud = null;
    this.scan_lengths = [];
    this.cumul_scan_lengths = [];
    this.individual_scans = [];

    this.scene = scene

    this.fetchPointcloud()
    this.activePointcloud = null

    //this.createPointCloud()
    this.showHidePointcloud()
    this.selectActivePointcloud()
    this.setPointcloudSize()
  }

  setPointcloudSize() {
    subscribe('settings.pointcloudSize', (state) => {
      console.log("setPointcloudSize", state.settings.pointcloudSize)
      let size = state.settings.pointcloudSize / 100000.0
      this.scans.forEach(scan => {
        scan.material.size = size
      })
    })
  }

  getIndecesFromScan(scan) {
    let scan_len = this.scan_lengths[scan]
    let indeces = Array.from({ length: scan_len }, (v, k) => k + this.cumul_scan_lengths[scan])
    return indeces

  }

  getScanFromIndex(index) {
    let scan = 0
    while (index >= this.cumul_scan_lengths[scan]) {
      scan += 1
    }
    return scan - 1
  }


  selectActivePointcloud() {
    subscribe("selectedProject.selectedScan", state => {
      if (this.activePointcloud != null) {
        this.scene.remove(this.activePointcloud);
      }
      if (state.selectedProject.selectedScan != -1) {
        let set_active = this.individual_scans[state.selectedProject.selectedScan]
        this.scene.add(set_active)
        this.activePointcloud = set_active;
      }
    })
  }

  showHidePointcloud() {
    subscribe("selectedProject.showPointcloud", state => {
      let showPointcloud = state.selectedProject.showPointcloud

      if (showPointcloud) {
        console.log("Showing pc")
        this.scene.add(this.pointcloud);
      } else {
        console.log("Hiding pc")
        this.scene.remove(this.pointcloud);
      }
    })
  }

  fetchPointcloud() {
    this.scans = []

    const fetch_req = async (projectName) => {
      let response = await fetch(BACKEND_URL + "/get-pointcloud?project=" + projectName)
      let json = await response.json()
      let pointclouds = json.pointclouds
      let numScans = pointclouds.length
      let flattend_pointclouds = []
      let cumul_scan_lengths = 0;
      this.cumul_scan_lengths.push(0);

      pointclouds.forEach(pointcloud => {
        this.individual_scans.push(createBufferGeo(pointcloud, 0x00FF00, 0.005))
        let pointcloud_len = pointcloud.length;
        this.scan_lengths.push(pointcloud_len);
        flattend_pointclouds = flattend_pointclouds.concat(pointcloud);
        cumul_scan_lengths += pointcloud_len;
        this.cumul_scan_lengths.push(cumul_scan_lengths)

      })

      let pc_geo = createBufferGeo(flattend_pointclouds, 0xFF0000, 0.001);
      this.pointcloud = pc_geo;
      store.dispatch(onLoadPointcloud(numScans - 1))
    }

    subscribe("selectedProject.projectName", state => {
      let projectName = state.selectedProject.projectName
      fetch_req(projectName)
    })


  }

}