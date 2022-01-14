import React from 'react'
import SidebarDescription from './SidebarDescription'

const SidebarSlider = () => {
    return (
        <div className="sidebarRow">
            <SidebarDescription text="Slider" />
            <div className="sidebarRight">
                <div className="blSlider">
                    <div className="blSliderValue"></div>
                </div>
            </div>

        </div>
    )
}

export default SidebarSlider
