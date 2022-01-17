import React from 'react'
import SidebarDescription from './SidebarDescription'

const SidebarButton = ({ description, buttonText, onClick }) => {
    return (
        <div className="sidebarRow">
            <SidebarDescription text={description} />
            <div className="sidebarRight">
                <button className="sbButton" onClick={onClick}>{buttonText}</button>


            </div>
        </div>
    )
}

SidebarButton.defaultProps = {
    description: "",
    buttonText: "",
    onClick: () => { console.log("Clicked sidebar button") }
}

export default SidebarButton
