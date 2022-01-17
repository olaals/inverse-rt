import React from 'react'
import SidebarDropdown from '../components/SidebarDropdown'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedProject } from '../../features/selectedProjectSlice'

let fetchProjectNames = async () => {
    let response = await fetch("http://localhost:5000/get-project-names", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    // handle failed request
    if (!response.ok) {
        throw new Error(response.statusText)
    }

    let data = await response.json()
    return data.project_names
}




const DropdownSelectProject = () => {
    let [options, setOptions] = React.useState([[0, 0, "No projects"]])
    const dispatch = useDispatch()
    useEffect(() => {
        fetchProjectNames().then(data => {
            // map projects and assign unique id
            let idx = 0;
            let options = []
            data.forEach((project) => {
                options.push([idx, project, project])
                idx += 1
            })

            setOptions(options)
        })
    }, [])

    let onChange = (e) => {
        dispatch(setSelectedProject(e.target.value))
    }

    let selectedProject = useSelector(state => state.selectedProject.projectName)






    return (
        <>
            <SidebarDropdown description="Select project" options={options} onChange={onChange} selectedValue={selectedProject} />


        </>
    )
}

export default DropdownSelectProject
