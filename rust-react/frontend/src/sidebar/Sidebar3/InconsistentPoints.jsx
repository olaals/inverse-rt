import React from 'react'
import SidebarButton from '../components/SidebarButton'
import { useSelector, useDispatch } from 'react-redux'

const InconsistentPoints = () => {
    return (
        <SidebarButton description={"Get incosistent pts"} buttonText={"Query"} />
    )
}

export default InconsistentPoints