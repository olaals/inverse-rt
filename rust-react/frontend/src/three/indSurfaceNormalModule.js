
import * as THREE from 'three';
import { store, subscribe, BACKEND_URL } from '../app/store';
import { setNumSurfaceNormals, setSelectedSurfaceNormal, setNormalsSameAndOtherPts } from '../features/pointDebugSlice';


export class IndSurfaceNormalModule {
  constructor(scene) {
    this.scene = scene;
    this.active_displayed = [];
    this.subscribe_to_normals();
    this.normals = [];
    this.other_pts = [];
    this.same_pts = [];
    this.pt_pos = null;
  }

  async fetch_normals(index) {
    console.log("fetch_normals", index);
    let res = await fetch(BACKEND_URL + '/get-estimated-normals?index=' + index);
    let data = await res.json();
    let len = data.normals.length;
    console.log("fetch_normals len", len);
    console.assert(this.normals < 21);


    this.normals = data.normals;
    this.same_pts = data.same_pts;
    this.other_pts = data.other_pts;

    store.dispatch(setNormalsSameAndOtherPts(data));
    console.log("fetch_normals", this.normals, this.same_pts, this.other_pts)
    store.dispatch(setNumSurfaceNormals(len - 1));
    store.dispatch(setSelectedSurfaceNormal(0));
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
      this.removeActiveDisplayed();
      console.log("subscribe surf norm selectPoint.index", state.selectPoint.index)
      let show_pointcloud = state.pointDebug.show_ind_surface_normals;
      let index = state.selectPoint.index;
      this.pt_pos = state.selectPoint.position;
      console.log("subscribe surf norm show_pointcloud", show_pointcloud, this.pt_pos)
      this.fetch_normals(index);
    })

    subscribe('pointDebug.selected_surface_normal', (state) => {
      let selected_surface_normal = state.pointDebug.selected_surface_normal;
      this.removeActiveDisplayed();
      if (selected_surface_normal == -1) {
        return;
      }
      let show_normals = state.pointDebug.show_ind_surface_normals;
      if (!show_normals) {
        return;
      }
      console.log("subscribe surf norm selected_surface_normal", selected_surface_normal)
      let normal = this.normals[selected_surface_normal];
      let same_pt = this.same_pts[selected_surface_normal];
      let other_pt = this.other_pts[selected_surface_normal];
      console.log("normals in state", this.normals)
      console.log("active displated", this.active_displayed)
      console.log("same pts state", this.same_pts)
      console.log("other pts state", this.other_pts)

      console.log("subscribe surf norm same_pt", same_pt, normal, other_pt)
      let normal_arr_help = this.getArrowHelper(normal, this.pt_pos);
      let same_pt_arr_help = this.getArrowHelperFromTo(this.pt_pos, same_pt);
      let other_pt_arr_help = this.getArrowHelperFromTo(this.pt_pos, other_pt);
      this.active_displayed.push(other_pt_arr_help);
      this.active_displayed.push(same_pt_arr_help);
      this.active_displayed.push(normal_arr_help);
      this.scene.add(normal_arr_help);
      this.scene.add(same_pt_arr_help);
      this.scene.add(other_pt_arr_help);
    })

    subscribe('pointDebug.show_ind_surface_normals', (state) => {
      this.removeActiveDisplayed();
      console.log("subscribe show surface normal from toggle", state.pointDebug.show_ind_surface_normals)
      let show_pointcloud = state.pointDebug.show_ind_surface_normals;
      let index = state.selectPoint.index;
      let pt_pos = state.selectPoint.position;
      console.log("subscribe surf norm show_pointcloud", show_pointcloud)
    })
  }


  removeActiveDisplayed() {
    this.active_displayed.forEach(element => {
      this.scene.remove(element);
    });
    this.active_displayed = [];
  }

  getArrowHelper(vec, point) {
    const dir = new THREE.Vector3(vec[0], vec[1], vec[2]);
    const origin = new THREE.Vector3(point[0], point[1], point[2]);
    const length = 0.2;
    const hex = 0x0000ff;
    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
    return arrowHelper;
  }

  getArrowHelperFromTo(from, to) {
    const dir = new THREE.Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
    const origin = new THREE.Vector3(from[0], from[1], from[2]);
    const length = dir.length();
    const hex = 0x00ffff;
    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
    return arrowHelper;
  }
}