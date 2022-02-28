// import THREE as es6 module
import * as THREE from 'three';
import { store, subscribe, BACKEND_URL } from '../app/store';
import { setIndex } from '../features/selectPointSlice';



export class ClickHandler {
  constructor(scene, camera, pc_module) {
    console.log("ClickHandler")
    this.scene = scene
    this.camera = camera
    this.raycaster = new THREE.Raycaster()
    this.raycaster.params.Points.threshold = 0.001;
    this.clickAble = []
    this.selected = null
    this.pc_module = pc_module
    this.listenToClick()
    this.last_click = null
  }

  fetchVecTowardsLaserOrig(index) {
    let url = BACKEND_URL + "/get-vec-towards-laser-origin?index=" + index;
    return fetch(url).then(response => response.json().then(data => {
      return data.vector
    }))
  }

  async fetch_point(index) {
    let res = await fetch(BACKEND_URL + '/get-point?index=' + index);
    let data = await res.json();
    let point = data.point;
    return point;
  }


  listenToClick() {
    console.log("listenToClick")
    subscribe("threeCanvasClick.clickedPos", (state) => {

      console.log("listenToClick", state.threeCanvasClick.clickedPos)
      let clickedPos = state.threeCanvasClick.clickedPos
      if (clickedPos == this.last_click) {
        return
      }
      this.last_click = clickedPos
      const mouse = new THREE.Vector2();
      mouse.x = clickedPos[0]
      mouse.y = clickedPos[1]
      this.raycaster.setFromCamera(mouse, this.camera);
      const intersections = this.raycaster.intersectObjects([this.pc_module.pointcloud], false);
      const intersection = (intersections.length) > 0 ? intersections[0] : null;
      console.log(intersection)
      if (intersection) {
        //this.createSphereAtClick(intersection.point)
        //let point = intersection.point
        let index = intersection.index
        this.fetch_point(index).then(point => {
          let from_scan = this.pc_module.getScanFromIndex(index)
          this.createSphereAtClick(point)
          console.log("from_scan", from_scan)
          this.fetchVecTowardsLaserOrig(index).then(vec_towards_laser => {
            console.log("vec_towards_laser", vec_towards_laser)
            store.dispatch(setIndex({ index: index, from_scan: from_scan, position: point, vec_towards_laser: vec_towards_laser }));
          })
        })
      }


    })
  }

  attachEventListener() {

    // get mouse position
    let mouse = new THREE.Vector2();
    let rect = that.canvas.getBoundingClientRect()
    //console.log(rect.x, rect.y)
    //console.log(rect)
    mouse.x = ((event.clientX - rect.x) / this.canvas.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.y) / this.canvas.clientHeight) * 2 + 1;
    console.log(mouse)
    this.raycaster.setFromCamera(mouse, this.camera);
    const intersections = this.raycaster.intersectObjects(this.clickAble, false);
    console.log(intersections)
    const intersection = (intersections.length) > 0 ? intersections[0] : null;
    console.log(intersection)
    // if interscetion is not null
    console.log("intersection")
    if (intersection) {
      this.fetch_point(intersection.index).then(point => {
        console.log("point create sphere at click", point)
        this.createSphereAtClick(point)
      })
    }
  }

  appendClickable(obj) {
    this.clickAble.push(obj)
  }

  createSphereAtClick(pos) {
    this.removeSphere()
    let radius = store.getState().settings.selectSphereRadius;
    let geometry = new THREE.SphereGeometry(radius, 32, 32);
    // semi transparent sphere
    let material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.8
    });
    let sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(pos[0], pos[1], pos[2]);
    this.selected = sphere
    this.scene.add(sphere);
  }

  removeSphere() {
    if (this.selected) {
      this.scene.remove(this.selected)
      this.selected = null
    }
  }

}
