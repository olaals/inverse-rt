
export function initSidebar() {
  initTabsCallbacks()
  initProjectSelectCallback()
  fetchProjects()
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

function initProjectSelectCallback() {
  let projectSelect = document.getElementById("project-select")
  console.log(projectSelect)
  projectSelect.addEventListener('change', (evt) => {
    let name = evt.target.value
    console.log(name)
    initProject(evt)
    setActiveProject(name)
  })
}

function initProject(projectName) {
  console.log(projectName)
}