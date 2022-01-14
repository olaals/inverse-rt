import React from 'react'
import SidebarDescription from './SidebarDescription'

const SidebarCheckbox = ({ description }) => {
    return (
        <div className="sidebarRow">
            <SidebarDescription text={description} />
            <div className="sidebarRight">
                <input type="checkbox" className="sbCheckbox" />
            </div>




        </div>
    )
}

export default SidebarCheckbox


