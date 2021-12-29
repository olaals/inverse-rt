
export function initSidebar(pubsub) {
  initTabsCallbacks()
  initProjectSelectCallback(pubsub)
  fetchProjects()
  showHideMeshCallback(pubsub)
  fetchPointcloud(pubsub)
}

function initTabsCallbacks() {
  let tabs = document.querySelectorAll('[data-target-tab]')
  let tabContents = document.querySelectorAll('[data-tab-content]')
  // foreach tab select element
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(tabb => tabb.classList.remove('active'))
      tab.classList.add('active')
      const id = (tab.getAttribute("data-target-tab"))
      tabContents.forEach(tabContent => tabContent.classList.remove('active'))
      const target = document.getElementById(id)
      target.classList.add('active')
    })
  })
}

async function fetchProjects() {
  let projectSelect = document.getElementById("project-select")
  console.log(projectSelect)
  let response = await fetch('/get_projects')
  let json = await response.json()
  let projects = json.projects
  projects.reverse()
  projects.forEach(project => {
    var option = document.createElement('option');
    option.text = option.value = project;
    projectSelect.add(option, 0);
  })
}

async function setActiveProject(project) {
  let response = await fetch('/set_project', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      project: project
    })
  })
  let json = await response.json()
  console.log(json)
}

function initProjectSelectCallback(pubsub) {
  let projectSelect = document.getElementById("project-select")
  console.log(projectSelect)
  projectSelect.addEventListener('change', (evt) => {
    let name = evt.target.value
    console.log("dropdown evt listener:", name)
    initProject(evt)
    setActiveProject(name)
    pubsub.publish('selected_project', name)
  })
}

function getActiveProject() {
  let projectSelect = document.getElementById("project-select")
  console.log(projectSelect)
  let projectName = projectSelect.options[projectSelect.selectedIndex].value
  return projectName
}


function showHideMeshCallback(pubsub) {
  document.getElementById('show-mesh-checkbox').addEventListener('change', (evt) => {
    let checked = evt.target.checked
    pubsub.publish("show_hide_mesh", checked)
  })
}

function fetchPointcloud(pubsub) {
  console.log("fetchPointcloud")
  document.getElementById("import-pointcloud-button").addEventListener('click', async () => {
    console.log("import-pointcloud-button")
    // fetch pointcloud with get_pointcloud
    let projectName = getActiveProject()
    console.log(projectName)
    let url = `/get_pointcloud?project=${projectName}`
    let response = await fetch(url)
    let json = await response.json()
    let points = json.pointcloud
    pubsub.publish("pointcloud", points)
    console.log(points)
  })

}

function initProject(projectName) {
  console.log(projectName)
}