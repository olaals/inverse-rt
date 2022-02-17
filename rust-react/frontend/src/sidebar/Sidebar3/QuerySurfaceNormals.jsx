import React from 'react'
import SidebarButton from '../components/SidebarButton'
import { useSelector, useDispatch } from 'react-redux'

const QuerySurfaceNormals = () => {
    return (
        <SidebarButton description={"Get surface normals"} buttonText={"Query"} />
    )
}

export default QuerySurfaceNormals