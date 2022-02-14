import React from 'react'
import SidebarButton from '../components/SidebarButton'
import { useSelector } from 'react-redux'

const RecalculatePointCloud = () => {

    let projectName = useSelector(state => state.selectedProject.projectName)

    let onClick = async () => {
        console.log("Recalculate point cloud")
        let response = await fetch("http://127.0.0.1:5000/recalculate-pointcloud?project=" + projectName, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        let data = await response.json()
        console.log(data)
    }

    return (
        <>
            <SidebarButton description="Recalculate pointcloud" buttonText="Recalculate" onClick={onClick} />


        </>
    )
}

export default RecalculatePointCloud
