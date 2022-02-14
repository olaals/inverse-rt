import React from 'react'
import SidebarDescription from './SidebarDescription'
import { useEffect } from 'react'

const SidebarCheckbox = ({ description, onChange, checked }) => {

    return (
        <div className="sidebarRow">
            <SidebarDescription text={description} />
            <div className="sidebarRight">
                <input type="checkbox" className="sbCheckbox" onChange={onChange} checked={checked} />
            </div>




        </div>
    )
}

SidebarCheckbox.defaultProps = {
    description: "Give description",
    onChange: (e) => {
        console.log("is checked:", e.target.checked)
    },
    checked: false
}

export default SidebarCheckbox


