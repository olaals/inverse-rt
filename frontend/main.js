import './style.css'

import { SceneManager } from './js/sceneManager'

let canvas = document.getElementById('canvas')
let content = document.getElementById('content-id')

let sceneManager = new SceneManager(canvas, content)





document.getElementById('fetch-btn').addEventListener('click', () => {
  fetch('/get_data')
    .then(function (response) {
      return response.json();
    })
    .then(response => {
      console.log(response)
      var points = response.points
      // add points to scene in for loop
      points.forEach(point => {
        console.log(point)
        sceneManager.addPoints(point)
      })
    })
})

document.getElementById('post-btn').addEventListener('click', () => {
  fetch('/post_data', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: "test" })
  }).then(response => {
    console.log(response)
  })
})

document.getElementById('text-btn').addEventListener('click', () => {
  console.log('text-btn callback')
  fetch('/get_file', {
    method: 'GET',
  }).then(response => {
    console.log(response)
    response.text().then(text => {
      console.log(text)
    })
  })
})





document.getElementById('resize-btn').addEventListener('click', () => {
  sceneManager.resize()
})





function resize() {
  let width = content.clientWidth
  let height = content.clientHeight
  sceneManager.resizeCanvas(width, height)
}
new ResizeObserver(resize).observe(content)

function animate() {
  requestAnimationFrame(animate);
  sceneManager.update()
}
animate();

