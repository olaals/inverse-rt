import React from 'react'
import SidebarButton from '../components/SidebarButton'
import { useSelector, useDispatch } from 'react-redux'
import SidebarCheckbox from '../components/SidebarCheckbox'
import { toggleShowSurfaceNormals } from '../../features/pointDebugSlice'

const QuerySurfaceNormals = () => {
    let dispatch = useDispatch()

    let show_surface_normals = useSelector(state => state.pointDebug.show_surface_normals)

    let onChange = (e) => {
        dispatch(toggleShowSurfaceNormals());
    }

    return (
        <SidebarCheckbox description={"Show all surface normals"} checked={show_surface_normals} onChange={onChange} />
    )
}

export default QuerySurfaceNormals