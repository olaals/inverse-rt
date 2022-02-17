import * as THREE from 'three';


export const listsToMatrix4 = (lists) => {
  let matrix = new THREE.Matrix4();
  matrix.set(
    lists[0][0], lists[0][1], lists[0][2], lists[0][3],
    lists[1][0], lists[1][1], lists[1][2], lists[1][3],
    lists[2][0], lists[2][1], lists[2][2], lists[2][3],
    lists[3][0], lists[3][1], lists[3][2], lists[3][3]
  );
  return matrix;
}


export const createBufferGeo = (pointcloud, pc_color, pc_size) => {
  console.log("addPointCloud")
  const geometry = new THREE.BufferGeometry();
  const positions = pointcloud.flat()
  const num_points = positions.length / 3
  let colors = []
  let color = new THREE.Color();
  let indices = new Uint32Array(num_points);

  for (let i = 0; i < num_points; i++) {
    indices[i] = i;
    color.setRGB(1.0, 1.0, 1.0);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();
  const material = new THREE.PointsMaterial({ color: pc_color, size: pc_size, vertexColors: true });
  let points = new THREE.Points(geometry, material);
  return points;
}

export const createPointCloud = () => {
  console.log("createPointCloud")

  const particles = 500000;

  const geometry = new THREE.BufferGeometry();

  const positions = [];
  const colors = [];

  const color = new THREE.Color();

  const n = 10, n2 = 4; // particles spread in the cube
  const indices = new Uint32Array(particles);

  for (let i = 0; i < particles; i++) {
    indices[i] = i;
    const x = Math.random() * n - n2;
    const y = Math.random() * n - n2;
    const z = Math.random() * n - n2;

    positions.push(x, y, z);
    color.setRGB(1.0, 1.0, 0);
    colors.push(color.r, color.g, color.b);

  }

  console.log("positions", positions)

  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();



  //

  const material = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1, vertexColors: true });
  let points2 = new THREE.Points(geometry, material);
  return points2;

}