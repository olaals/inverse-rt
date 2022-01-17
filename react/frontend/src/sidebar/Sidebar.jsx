import React from 'react'
import Header from './Header'
import Sidebar1 from './Sidebar1'
import Sidebar2 from './Sidebar2'
import Sidebar3 from './Sidebar3'
import Sidebar4 from './Sidebar4'

import { useSelector } from 'react-redux'
import "./css/sidebarItems.css"

const Sidebar = () => {

    const sidebar = useSelector(state => state.selectedSidebar.value)




    return (
        <div className="sidebar">
            <Header />
            {sidebar == 0 ? <Sidebar1 /> : null}
            {sidebar == 1 ? <Sidebar2 /> : null}
            {sidebar == 2 ? <Sidebar3 /> : null}
            {sidebar == 3 ? <Sidebar4 /> : null}

        </div>
    )
}

export default Sidebar