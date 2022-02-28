import React from 'react'
import SidebarDisplay from '../components/SidebarDisplay'
import { useSelector, useDispatch } from 'react-redux'

const NormalSameIdxDisp = () => {

    let same_idx = useSelector(state => state.pointDebug.selected_same_idx)
    if (same_idx == null) {
        same_idx = "None"
    }


    return (
        <SidebarDisplay desc="Normal same idx:" text={"" + same_idx} />
    )
}

export default NormalSameIdxDisp