import React from 'react'
import { IoIosApps } from "react-icons/io";
import { FaWrench } from "react-icons/fa";
import { GiMagnifyingGlass } from "react-icons/gi";
import "./css/icons.css"

const SidebarSelect = () => {
    const logClick = () => {
        console.log("Clicked!");
    }
    return (

        <div className="sidebarSelect">
            <div className="icon-div" onClick={logClick}>
                <IoIosApps className="icon-sidebar-select" />
            </div>
            <div className="icon-div">
                <FaWrench className="icon-sidebar-select" />
            </div>
            <div className="icon-div">
                <GiMagnifyingGlass className="icon-sidebar-select" />
            </div>



        </div>
    )
}

export default SidebarSelect
