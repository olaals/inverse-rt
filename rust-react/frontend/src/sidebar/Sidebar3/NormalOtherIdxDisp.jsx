import React from 'react'
import SidebarDisplay from '../components/SidebarDisplay'
import { useSelector, useDispatch } from 'react-redux'

const NormalOtherIdxDisp = () => {

    let other_idx = useSelector(state => state.pointDebug.selected_other_idx)
    if (other_idx == null) {
        other_idx = "None"
    }



    return (
        <SidebarDisplay desc="Normal other idx:" text={"" + other_idx} />
    )
}

export default NormalOtherIdxDisp