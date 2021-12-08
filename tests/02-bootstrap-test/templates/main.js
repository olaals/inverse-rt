
function dropdown_callback(meshHandler, value) {
  console.log("dropdown callback")
  console.log(value)
  // switch state to assign value to numbers
  switch (value) {
    case "1":
      meshHandler.changeColor(0);
      break;
    case "2":
      meshHandler.changeColor(1);
      break;
    case "3":
      meshHandler.changeColor(2);
      break;
    case "4":
      meshHandler.changeColor(3);
      break;
  }
}

function slider_callback(meshHandler, value, output) {
  output.innerHTML = value + "%";
  meshHandler.scaleAll(value / 100);

}

function init_callbacks(meshHandler) {
  console.log(meshHandler)
  document.getElementById('select-pc').addEventListener('change', function () { dropdown_callback(meshHandler, this.value) })
  var output = document.getElementById("demo");
  var slider = document.getElementById("myRange");
  slider.oninput = function () { slider_callback(meshHandler, slider.value, output) };
}

var container, stats;

var camera, controls, scene, renderer;

var cross;


// Update the current slider value (each time you drag the slider handle)



class MeshHandler {
  constructor(scene) {
    this.scene = scene;
    var geometry = new THREE.SphereGeometry(0.1, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xbbbbcc });
    this.unselect_mat = material
    var select_material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.line_mat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    this.select_mat = select_material

    this.mesh_list = [];
    var line_list = [];
    this.line_list = line_list;
    //for loop
    for (var j = 0; j < 10; j++) {
      let pc_list = [];
      for (var i = 0; i < 100; i++) {
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = j
        mesh.position.y = (Math.random() - 0.5) * 100;
        mesh.position.z = 0
        if (mesh.position.y < 0) {
          mesh.position.z = -mesh.position.y
          mesh.position.y = 0
        }
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        pc_list.push(mesh);
        scene.add(mesh);
      }
      this.mesh_list.push(pc_list);
    }
  }

  changeColor(ind) {
    for (var j = 0; j < 10; j++) {
      for (var i = 0; i < 100; i++) {
        this.mesh_list[j][i].material = this.unselect_mat
      }

      this.removeLines()

      var from_point = new THREE.Vector3(0, 60, 60);
    }

    console.log("ind", ind)

    for (var i = 0; i < 100; i++) {
      this.mesh_list[ind][i].material = this.select_mat
      this.addLinesToPoints(from_point, this.mesh_list[ind])
    }
    render()
  }

  scaleAll(scale) {
    for (var j = 0; j < 10; j++) {
      for (var i = 0; i < 100; i++) {
        this.mesh_list[j][i].scale.set(scale, scale, scale);
        this.mesh_list[j][i].updateMatrix();
      }
    }
    render()
  }

  addLinesToPoints(from, points) {
    for (var i = 0; i < points.length; i++) {
      var point_pos = points[i].position
      var line_buff = new THREE.BufferGeometry().setFromPoints([from, point_pos]);
      var line_geo = new THREE.Line(line_buff, this.line_mat);
      scene.add(line_geo);
      this.line_list.push(line_geo);
    }
  }

  removeLines() {
    var line_list = this.line_list;
    for (var i = 0; i < line_list.length; i++) {
      scene.remove(line_list[i]);
    }
  }

}


init();
animate();

function init() {

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.getElementById('container-threejs');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
  camera.up.set(0, 0, 1);
  camera.position.z = 100;
  camera.position.y = 100;

  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render);

  mh = new MeshHandler(scene);
  init_callbacks(mh);


  //add cube to scene



  light = new THREE.AmbientLight(0xffffff);
  scene.add(light);

  const line_material = new THREE.LineBasicMaterial({
    color: 0x0000ff
  });

  const points = [];
  points.push(new THREE.Vector3(- 10, 0, 0));
  points.push(new THREE.Vector3(0, 10, 0));
  points.push(new THREE.Vector3(10, 0, 0));

  const line_geometry = new THREE.BufferGeometry().setFromPoints(points);

  const line = new THREE.Line(line_geometry, line_material);
  scene.add(line);


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

render();
