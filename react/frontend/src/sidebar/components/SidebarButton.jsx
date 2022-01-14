import React from 'react'
import SidebarDescription from './SidebarDescription'

const SidebarButton = ({ description, buttonText }) => {
    return (
        <div className="sidebarRow">
            <SidebarDescription text={description} />
            <div className="sidebarRight">
                <button className="sbButton">{buttonText}</button>


            </div>
        </div>
    )
}

export default SidebarButton
