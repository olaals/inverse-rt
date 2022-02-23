import React from 'react'
import InconsistentPoints from './Sidebar3/InconsistentPoints'
import PointIndexDisplay from './Sidebar3/PointIndexDisplay'
import PointPosDisplay from './Sidebar3/PointPosDisplay'
import QuerySurfaceNormals from './Sidebar3/QuerySurfaceNormals'
import ScanIndexDisplay from './Sidebar3/ScanIndexDisplay'
import ShowVecTowardsLaser from './Sidebar3/ShowVecTowardsLaser'

const Sidebar3 = () => {
    return (
        <div>
            <h1>Point Select</h1>
            <PointIndexDisplay />
            <ScanIndexDisplay />
            <PointPosDisplay />
            <ShowVecTowardsLaser />
            <InconsistentPoints />
            <QuerySurfaceNormals />

        </div>
    )
}

export default Sidebar3
