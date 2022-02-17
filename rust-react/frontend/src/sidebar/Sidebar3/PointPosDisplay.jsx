import React from 'react'
import SidebarDisplay from '../components/SidebarDisplay'
import { useSelector, useDispatch } from 'react-redux'


const PointPosDisplay = () => {

    let pt_pos = useSelector(state => state.selectPoint.position)
    if (pt_pos == null) {
        pt_pos = "None"
    }

    let round = (num) => {
        return Math.round(num * 1000) / 1000
    }

    return (
        <SidebarDisplay desc="Position:" text={`x: ${round(pt_pos[0])} y: ${round(pt_pos[1])} z: ${round(pt_pos[2])}`} />
    )
}

export default PointPosDisplay