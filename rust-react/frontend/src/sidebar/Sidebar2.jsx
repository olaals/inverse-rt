import React from 'react'
import MeshOpacitySlider from './Sidebar2/MeshOpacitySlider'
import PointCloudSizeSlider from './Sidebar2/PointCloudSizeSlider'
import SceneBackgroundColor from './Sidebar2/SceneBackgroundColor'
import SelectSphereRadius from './Sidebar2/SelectSphereRadius'

const Sidebar2 = () => {
    return (
        <div>
            <h1>Sidebar2</h1>
            <SceneBackgroundColor />
            <MeshOpacitySlider />
            <PointCloudSizeSlider />
            <SelectSphereRadius />
        </div>
    )
}

export default Sidebar2

