
import * as THREE from 'three';
import { store, subscribe, BACKEND_URL } from '../app/store';
import { setNumSurfaceNormals, setSelectedSurfaceNormal, setNormalsSameAndOtherPts, setSameOtherNormalIdx } from '../features/pointDebugSlice';
import { setSameAndOtherIdx } from '../features/selectNormalSlice';


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

  async fetch_from_to(from_idx, to_idx) {
    let res = await fetch(BACKEND_URL + '/get-vector-from-to?from_index=' + from_idx + '&to_index=' + to_idx);
    let data = await res.json();
    let vector = data.vector;
    return vector;
  }

  async fetch_point(index) {
    let res = await fetch(BACKEND_URL + '/get-point?index=' + index);
    let data = await res.json();
    let point = data.point;
    return point;
  }


  async draw_vector_from_to(from_idx, to_idx) {
    let vector = await this.fetch_from_to(from_idx, to_idx);
    let this_pt = await this.fetch_point(from_idx);
    console.log("draw_vector_from_to", vector)
    let arr_help = this.getArrowHelperTrueLen(vector, this_pt, 0x00ffff);
    this.active_displayed.push(arr_help);
    this.scene.add(arr_help);
  }

  async drawSphereAt(idx) {
    let point = await this.fetch_point(idx);
    let radius = store.getState().settings.selectSphereRadius;
    let geometry = new THREE.SphereGeometry(radius, 32, 32);
    let material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    let sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(point[0], point[1], point[2]);
    this.active_displayed.push(sphere);
    this.scene.add(sphere);
  }


  async dispatchIndex(same_idx, other_idx) {
    setTimeout(() => {
      store.dispatch(setSameOtherNormalIdx({ same_idx: same_idx, other_idx: other_idx }));
    }, 10);
  }






  subscribe_to_normals() {
    subscribe('selectPoint.index', (state) => {
      this.removeActiveDisplayed();
      let show_pointcloud = state.pointDebug.show_ind_surface_normals;
      let index = state.selectPoint.index;
      this.pt_pos = state.selectPoint.position;
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
      let this_index = state.selectPoint.index;
      let normal = state.pointDebug.normals[selected_surface_normal];
      let same_idx = state.pointDebug.same_idx[selected_surface_normal];
      let other_idx = state.pointDebug.other_idx[selected_surface_normal];
      this.dispatchIndex(same_idx, other_idx);
      this.drawSphereAt(other_idx);
      this.drawSphereAt(same_idx);

      let normal_arr_help = this.getArrowHelper(normal, this.pt_pos);
      this.active_displayed.push(normal_arr_help);
      this.scene.add(normal_arr_help);
    })

    subscribe('pointDebug.show_ind_surface_normals', (state) => {
      this.removeActiveDisplayed();
      let show_pointcloud = state.pointDebug.show_ind_surface_normals;
      let index = state.selectPoint.index;
      let pt_pos = state.selectPoint.position;
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

  getArrowHelperTrueLen(vec, origin_pt, hex_color) {
    const dir = new THREE.Vector3(vec[0], vec[1], vec[2]);
    const origin = new THREE.Vector3(origin_pt[0], origin_pt[1], origin_pt[2]);
    const length = dir.length();
    const hex = hex_color;
    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
    return arrowHelper;
  }

  createSphereAt(pos, radius) {
    let geometry = new THREE.SphereGeometry(radius, 32, 32);
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(pos[0], pos[1], pos[2]);
    return sphere;
  }


}