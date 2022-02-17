import React from 'react'
import SidebarDisplay from '../components/SidebarDisplay'
import { useSelector, useDispatch } from 'react-redux'

const ScanIndexDisplay = () => {
    let from_scan = useSelector(state => state.selectPoint.from_scan)
    if (from_scan == null) {
        from_scan = "None"
    }

    return (
        <SidebarDisplay desc="From scan:" text={from_scan} />
    )
}

export default ScanIndexDisplay