import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export class MeshModule {
  constructor(scene, pubsub) {
    this.scene = scene
    this.pubsub = pubsub

    this.loadObjOnProjectSelect()
    this.showHideMesh()
    this.activeMesh = null
  }

  loadObjOnProjectSelect() {
    let that = this
    this.pubsub.subscribe('selected_project', (projectName) => {
      if (this.activeMesh != null) {
        this.scene.remove(this.activeMesh)
      }
      console.log("loadObjOnProjectSelect")
      const url = "/get_mesh?project=" + projectName
      const loader = new OBJLoader();
      loader.load(url, (obj) => {
        // create phong material
        const material = new THREE.MeshPhongMaterial({
          color: 0xaaaaaa,
          specular: 0xccccaa,
          shininess: 2,
          flatShading: true
        });
        // add material to object
        obj.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material = material
          }
        })
        this.activeMesh = obj
        that.scene.add(obj)
      }
      )
    })
  }

  showHideMesh() {
    this.pubsub.subscribe('show_hide_mesh', (showTrue) => {
      if (this.activeMesh == null) return
      let object = this.activeMesh
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.visible = showTrue;
        }
      });


    })
  }


}
