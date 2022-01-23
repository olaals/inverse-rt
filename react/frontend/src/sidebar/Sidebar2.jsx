import React from 'react'
import MeshOpacitySlider from './Sidebar2/MeshOpacitySlider'
import PointCloudSizeSlider from './Sidebar2/PointCloudSizeSlider'
import SceneBackgroundColor from './Sidebar2/SceneBackgroundColor'

const Sidebar2 = () => {
    return (
        <div>
            <h1>Sidebar2</h1>
            <SceneBackgroundColor />
            <MeshOpacitySlider />
            <PointCloudSizeSlider />
        </div>
    )
}

export default Sidebar2

