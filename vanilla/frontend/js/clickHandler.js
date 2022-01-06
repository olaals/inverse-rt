// import THREE as es6 module
import * as THREE from 'three';



export class ClickHandler {
  constructor(canvas, scene, camera, pubsub) {
    this.pubsub = pubsub
    this.scene = scene
    this.canvas = canvas
    this.camera = camera
    this.raycaster = new THREE.Raycaster()
    this.raycaster.params.Points.threshold = 0.1;
    this.clickAble = []
    this.attachEventListener()
    this.selected = null
    this.clickX
    this.clickY
  }

  attachEventListener() {
    let that = this

    this.canvas.addEventListener('mousedown', function (event) {
      that.clickX = event.clientX
      that.clickY = event.clientY
    })
    this.canvas.addEventListener('mouseup', (event) => {
      let x = event.clientX
      let y = event.clientY
      if (x != that.clickX || y != that.clickY) {
        return
      }

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
      if (intersection) {
        this.createSphereAtClick(intersection.point)
      }
    })
  }

  appendClickable(obj) {
    this.clickAble.push(obj)
  }

  createSphereAtClick(pos) {
    this.removeSphere()
    let geometry = new THREE.SphereGeometry(0.2, 32, 32);
    // semi transparent sphere
    let material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.8
    });
    let sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(pos.x, pos.y, pos.z);
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