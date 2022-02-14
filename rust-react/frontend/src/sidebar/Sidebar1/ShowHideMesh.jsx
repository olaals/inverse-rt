import React from 'react'
import SidebarCheckbox from '../components/SidebarCheckbox'
import { toggleShowMesh } from '../../features/selectedProjectSlice'
import { useDispatch, useSelector } from 'react-redux'

const ShowHideMesh = () => {
    const dispatch = useDispatch()
    let showMesh = useSelector(state => state.selectedProject.showMesh)

    let onChange = (e) => {
        dispatch(toggleShowMesh())
    }

    return (
        <>
            <SidebarCheckbox description="Show mesh" onChange={onChange} checked={showMesh}></SidebarCheckbox>


        </>
    )
}

export default ShowHideMesh
