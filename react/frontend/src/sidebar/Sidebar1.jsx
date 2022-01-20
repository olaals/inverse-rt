import React from 'react'
import SidebarButton from './components/SidebarButton'
import SidebarCheckbox from './components/SidebarCheckbox'
import SidebarSlider from './components/SidebarSlider'
import DropdownSelectProject from './Sidebar1/DropdownSelectProject'
import { useSelector } from 'react-redux'
import ShowHideMesh from './Sidebar1/ShowHideMesh'
import RecalculatePointCloud from './Sidebar1/RecalculatePointCloud'
import ShowHidePointcloud from './Sidebar1/ShowHidePointcloud'
import SelectedScanSlider from './Sidebar1/SelectedScanSlider'

const Sidebar1 = () => {

    let projectIsSelected = useSelector(state => state.selectedProject.projectIsSelected)

    return (
        <div>
            <h1>Sidebar1</h1>
            <DropdownSelectProject />
            {projectIsSelected ? <ShowHideMesh /> : null}
            {projectIsSelected ? <ShowHidePointcloud /> : null}
            {projectIsSelected ? <RecalculatePointCloud /> : null}
            {projectIsSelected ? <SelectedScanSlider /> : null}




            <div className="sidebarRow">
                <div className="sidebarLeft"></div>
                <div className="sidebarRight"></div>
            </div>


        </div>
    )
}

export default Sidebar1


