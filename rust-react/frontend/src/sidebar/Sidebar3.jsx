import React from 'react'
import InconsistentPoints from './Sidebar3/InconsistentPoints'
import IndSurfaceNormals from './Sidebar3/IndSurfaceNormals'
import NormalOtherIdxDisp from './Sidebar3/NormalOtherIdxDisp'
import NormalSameIdxDisp from './Sidebar3/NormalSameIdxDisp'
import PointIndexDisplay from './Sidebar3/PointIndexDisplay'
import PointPosDisplay from './Sidebar3/PointPosDisplay'
import QuerySurfaceNormals from './Sidebar3/QuerySurfaceNormals'
import ScanIndexDisplay from './Sidebar3/ScanIndexDisplay'
import SelectIndSurfaceNormal from './Sidebar3/SelectIndSurfaceNormal'
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
            <IndSurfaceNormals />
            <SelectIndSurfaceNormal />
            <NormalSameIdxDisp />
            <NormalOtherIdxDisp />

        </div>
    )
}

export default Sidebar3
