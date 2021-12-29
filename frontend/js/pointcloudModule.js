import * as THREE from 'three';



export class PointcloudModule {
  constructor(scene, pubsub) {
    this.scene = scene
    this.pubsub = pubsub

    this.loadPointcloud()
    this.activePointcloud = null
    //this.createPointCloud()
  }

  loadPointcloud() {
    this.pubsub.subscribe('pointcloud', (pointcloud) => {
      console.log("loadPointcloud")
      console.log(pointcloud)
      this.addPointCloud(pointcloud)
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

    console.log("positions")
    console.log(positions)


    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    // set color attrubute
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    geometry.computeBoundingSphere();

    const material = new THREE.PointsMaterial({ color: 0xFF0000, size: 0.01, vertexColors: true });

    let points = new THREE.Points(geometry, material);
    this.scene.add(points);
    console.log("points added")

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
    this.scene.add(points);

  }
}