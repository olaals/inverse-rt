import React from 'react'
import SidebarDisplay from '../components/SidebarDisplay'
import { useSelector, useDispatch } from 'react-redux'

const PointIndexDisplay = () => {
    let dispatch = useDispatch()


    let selectedPoint = useSelector(state => state.selectPoint.index)
    if (!selectedPoint) {
        selectedPoint = "None"
    }
    console.log("selectedPoint", selectedPoint)

    return (
        <SidebarDisplay desc="Selected point:" text={selectedPoint} />
    )
}

export default PointIndexDisplay