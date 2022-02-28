import React from 'react'
import SidebarSlider from '../components/SidebarSlider'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectSphereRadius } from '../../features/settingsSlice'

const SelectSphereRadius = () => {
    let dispatch = useDispatch()
    let radius = useSelector(state => state.settings.selectSphereRadius)

    const onChange = (e) => {
        let val = e / 50000;
        dispatch(setSelectSphereRadius(val))
    }



    return (
        <SidebarSlider description={"Select sphere radius"} initValue={radius * 50000} max={100} onChange={onChange} />
    )
}

export default SelectSphereRadius