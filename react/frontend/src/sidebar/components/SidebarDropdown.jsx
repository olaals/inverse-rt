import React from 'react'
import SidebarDescription from './SidebarDescription'

const SidebarDropdown = ({ description }) => {
    return (
        <div className="sidebarRow">
            <SidebarDescription text={description} />
            <div className="sidebarRight">
                <select className="sidebarDropdown">
                    <option value="0">Project 1</option>
                    <option value="1">Project 2</option>
                    <option value="2">Project 3</option>
                </select>
            </div>
        </div>
    )
}

export default SidebarDropdown
