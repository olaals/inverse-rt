
import React from 'react'
import SidebarButton from '../components/SidebarButton'
import { useSelector, useDispatch } from 'react-redux'
import SidebarCheckbox from '../components/SidebarCheckbox'
import { toggleShowIndSurfaceNormals } from '../../features/pointDebugSlice'

const IndSurfaceNormals = () => {
    let dispatch = useDispatch()

    let show_ind_surface_normals = useSelector(state => state.pointDebug.show_ind_surface_normals)

    let onChange = (e) => {
        dispatch(toggleShowIndSurfaceNormals());
    }

    return (
        <SidebarCheckbox description={"Show individual normals"} checked={show_ind_surface_normals} onChange={onChange} />
    )
}

export default IndSurfaceNormals