import React from 'react'
import SidebarButton from './components/SidebarButton'
import SidebarCheckbox from './components/SidebarCheckbox'
import SidebarSlider from './components/SidebarSlider'
import DropdownSelectProject from './Sidebar1/DropdownSelectProject'
import { useSelector } from 'react-redux'
import ShowHideMesh from './Sidebar1/ShowHideMesh'

const Sidebar1 = () => {

    let projectIsSelected = useSelector(state => state.selectedProject.projectIsSelected)

    return (
        <div>
            <h1>Sidebar1</h1>
            <DropdownSelectProject />
            {projectIsSelected ? <ShowHideMesh /> : null}
            {projectIsSelected ? <SidebarCheckbox description="Show point cloud" /> : null}
            {projectIsSelected ? <SidebarSlider initValue={22} min={0} max={100}></SidebarSlider> : null}
            {projectIsSelected ? <SidebarButton description="Add new project" buttonText="Press" /> : null}




            <div className="sidebarRow">
                <div className="sidebarLeft"></div>
                <div className="sidebarRight"></div>
            </div>


        </div>
    )
}

export default Sidebar1


