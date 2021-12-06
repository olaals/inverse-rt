
var container, stats;

var camera, controls, scene, renderer;

var cross;

init();
animate();

function init() {


  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.getElementById('container-threejs');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 20;

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);

  // world
  let baseGeometry = new THREE.SphereBufferGeometry(1, 12, 12);
  let spheres = [];
  let colors = [0xfafafa, 0xff0000];
  for (let i = 0; i < 7000; i++) {
    let geometry = baseGeometry.clone();
    spheres.push(geometry)
  }
  //let material = new THREE.MeshBasicMaterial();
  var material = new THREE.MeshLambertMaterial({ color: 0xFF0000, shading: THREE.FlatShading });
  var mergedSphereGeometries = THREE.BufferGeometryUtils.mergeBufferGeometries(spheres);
  let mesh = new THREE.Mesh(mergedSphereGeometries, material);
  scene.add(mesh);

  //cube geometry in three.js
  //var geometry = new THREE.SphereGeometry(0.05, 32, 32);


  //// add cube threejs

  ////for loop
  //for (var i = 0; i < 10000; i++) {
  //var mesh = new THREE.Mesh(geometry, material);
  //mesh.position.x = (Math.random() - 0.5) * 100;
  //mesh.position.y = (Math.random() - 0.5) * 100;
  //mesh.position.z = 0
  //mesh.updateMatrix();
  //mesh.matrixAutoUpdate = false;
  //scene.add(mesh);
  //}
  ////add cube to scene



  light = new THREE.AmbientLight(0xffffff);
  scene.add(light);


  // renderer

  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();

}

function animate() {

  requestAnimationFrame(animate);
  controls.update();

}

function render() {
  renderer.render(scene, camera);
}