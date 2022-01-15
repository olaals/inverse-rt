import React from 'react'
import SidebarSlider from './components/SidebarSlider'

const Sidebar2 = () => {
    return (
        <div>
            <h1>Sidebar2</h1>
            <SidebarSlider initValue={22} min={21} max={100} />
        </div>
    )
}

export default Sidebar2

