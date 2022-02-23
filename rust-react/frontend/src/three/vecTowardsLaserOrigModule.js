import * as THREE from 'three';
import { store, subscribe, BACKEND_URL } from '../app/store';


export class VecTowardsLaserOrigModule {
  constructor(scene) {
    this.scene = scene;
    this.active_vector = null;
    this.drawVector();
  }

  getArrowHelper(vec, point) {
    const dir = new THREE.Vector3(vec[0], vec[1], vec[2]);
    const origin = new THREE.Vector3(point[0], point[1], point[2]);
    const length = 0.2;
    const hex = 0xffff00;
    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
    return arrowHelper;
  }



  drawVector() {
    subscribe('pointDebug.showVecTowardsLaserOrig', (state) => {
      let show = state.pointDebug.showVecTowardsLaserOrig;
      let vec = state.selectPoint.vec_towards_laser;
      let point = state.selectPoint.position;
      if (show && vec) {
        console.log("drawVector", vec, point)
        if (this.active_vector) {
          this.scene.remove(this.active_vector)
        }
        let arr_help = this.getArrowHelper(vec, point);
        this.active_vector = arr_help;
        this.scene.add(arr_help);
      }
      if (!show && this.active_vector) {
        this.scene.remove(this.active_vector)
      }
    })
    subscribe('selectPoint.position', (state) => {
      let show = state.pointDebug.showVecTowardsLaserOrig;
      let vec = state.selectPoint.vec_towards_laser;
      let point = state.selectPoint.position;
      if (show && vec) {
        console.log("drawVector", vec, point)
        if (this.active_vector) {
          this.scene.remove(this.active_vector)
        }
        let arr_help = this.getArrowHelper(vec, point);
        this.active_vector = arr_help;
        this.scene.add(arr_help);
      }

    })
  }

}