import React from 'react'
import { IoIosApps } from "react-icons/io";
import { FaWrench } from "react-icons/fa";
import { GiMagnifyingGlass } from "react-icons/gi";
import { GrTest } from "react-icons/gr";
import "./css/icons.css"
import { useDispatch, useSelector } from 'react-redux'
import { selectSidebar } from '../features/sidebarSelectSlice'

const SidebarSelect = () => {
    const dispatch = useDispatch()
    const sidebar = useSelector(state => state.selectedSidebar.value)

    const getClassnames = (value) => {
        const classNames = "icon-div" + " " + (sidebar == value ? "sidebarIconSelected" : "")
        return classNames
    }

    return (

        <div className="sidebarSelect">
            <div className={getClassnames(0)} onClick={() => { dispatch(selectSidebar(0)) }}>
                <IoIosApps className="icon-sidebar-select" />
            </div>
            <div className={getClassnames(1)} onClick={() => { dispatch(selectSidebar(1)) }}>
                <FaWrench className="icon-sidebar-select" />
            </div>
            <div className={getClassnames(2)} onClick={() => { dispatch(selectSidebar(2)) }}>
                <GiMagnifyingGlass className="icon-sidebar-select" />
            </div>
            <div className={getClassnames(3)} onClick={() => { dispatch(selectSidebar(3)) }}>
                <GrTest className="icon-sidebar-select" />
            </div>




        </div>
    )
}

export default SidebarSelect
