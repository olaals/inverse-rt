import * as THREE from 'three';
import { store, subscribe, BACKEND_URL } from '../app/store';


export class SurfaceNormalModule {
  constructor(scene) {
    this.scene = scene;
    this.active_displayed = [];
    this.subscribe_to_normals();
  }

  async fetch_normals(index) {
    let res = await fetch(BACKEND_URL + '/get-estimated-normals?index=' + index);
    let data = await res.json();
    return data.normals
  }

  draw_normals(normals, point_pos) {
    normals.forEach(normal => {
      let arr_help = this.getArrowHelper(normal, point_pos);
      this.active_displayed.push(arr_help);
      this.scene.add(arr_help);
    });
  }


  subscribe_to_normals() {
    subscribe('selectPoint.index', (state) => {
      this.active_displayed.forEach(element => {
        this.scene.remove(element);
      });
      console.log("subscribe surf norm selectPoint.index", state.selectPoint.index)
      let show_pointcloud = state.pointDebug.show_surface_normals;
      let index = state.selectPoint.index;
      let pt_pos = state.selectPoint.position;
      console.log("subscribe surf norm show_pointcloud", show_pointcloud)
      if (show_pointcloud) {
        this.fetch_normals(index).then((normals) => {
          this.draw_normals(normals, pt_pos)
        })
      }
    })
  }




  getArrowHelper(vec, point) {
    const dir = new THREE.Vector3(vec[0], vec[1], vec[2]);
    const origin = new THREE.Vector3(point[0], point[1], point[2]);
    const length = 0.2;
    const hex = 0x0000ff;
    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
    return arrowHelper;
  }
}