import React, { useEffect } from 'react'
import SidebarCheckbox from '../components/SidebarCheckbox'
import { useDispatch, useSelector } from 'react-redux'
import { toggleShowVecTowardsLaserOrig } from '../../features/pointDebugSlice'


const ShowVecTowardsLaser = () => {
    let dispatch = useDispatch()


    let showVecTowardsLaser = useSelector(state => state.pointDebug.showVecTowardsLaserOrig)

    let onChange = (e) => {
        dispatch(toggleShowVecTowardsLaserOrig())
    }

    return (
        <SidebarCheckbox description={"Show vector towards laser"} checked={showVecTowardsLaser} onChange={onChange} />
    )
}

export default ShowVecTowardsLaser