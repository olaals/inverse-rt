import React from 'react'
import SidebarButton from './components/SidebarButton'
import SidebarCheckbox from './components/SidebarCheckbox'
import SidebarDropdown from './components/SidebarDropdown'

const Sidebar1 = () => {

    return (
        <div>
            <h1>Sidebar1</h1>
            <SidebarDropdown description="Select project2" />
            <SidebarButton description="Add new project" buttonText="Press" />
            <SidebarCheckbox description="Checkbox" />
            <SidebarCheckbox description="Checkbox" />
            <SidebarButton description="Add new project" buttonText="Press" />



            <div className="sidebarRow">
                <div className="sidebarLeft"></div>
                <div className="sidebarRight"></div>
            </div>


        </div>
    )
}

export default Sidebar1


