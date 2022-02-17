import React from 'react'
import SidebarDescription from './SidebarDescription'

const SidebarDisplay = ({ desc, text }) => {
    return (
        <div className="sidebarRow">
            <SidebarDescription text={desc} />
            <div className="sidebarRight">
                <div className="sidebarDisplayText">
                    {text}
                </div>
            </div>
        </div>
    )
}

export default SidebarDisplay