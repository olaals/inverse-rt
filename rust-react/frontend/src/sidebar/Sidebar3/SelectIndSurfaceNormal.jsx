
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleShowIndSurfaceNormals, setSelectedSurfaceNormal } from '../../features/pointDebugSlice'
import SidebarSlider from '../components/SidebarSlider';

const SelectIndSurfaceNormal = () => {
    let dispatch = useDispatch();

    let show_ind_surface_normals = useSelector(state => state.pointDebug.show_ind_surface_normals);
    let num_surface_normals = useSelector(state => state.pointDebug.num_surface_normals);
    let selected_surface_normal = useSelector(state => state.pointDebug.selected_surface_normal);

    let onChange = (e) => {
        dispatch(setSelectedSurfaceNormal(e));
    }

    return (
        <>
            {show_ind_surface_normals == true ? <SidebarSlider description={"Select normal"} max={num_surface_normals} onChange={onChange} initValue={selected_surface_normal} /> : null}
        </>
    )
}

export default SelectIndSurfaceNormal