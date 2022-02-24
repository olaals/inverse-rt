import React from 'react'
import SidebarDropdown from '../components/SidebarDropdown'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedProject } from '../../features/selectedProjectSlice'
import { BACKEND_URL } from '../../app/store'

let fetchProjectNames = async () => {
    console.log("fetchProjectNames")
    let response = await fetch(BACKEND_URL + "/get-project-names", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    })

    // handle failed request
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    console.log("fetchProjectNames response: ", response)

    let data = await response.json()
    return data.project_names
}




const DropdownSelectProject = () => {
    let [options, setOptions] = React.useState([[0, 0, "No projects"]])
    const dispatch = useDispatch()
    useEffect(() => {
        fetchProjectNames().then(data => {
            console.log(data)
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
