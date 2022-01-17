import React from 'react'
import SidebarDropdown from './components/SidebarDropdown'
import { useDispatch } from 'react-redux'
import { setColor } from '../features/colorSlice'
import { setDummyValue } from '../features/dummySlice'
import SidebarSlider from './components/SidebarSlider'
import { useSelector } from 'react-redux'


const Sidebar4 = () => {
    const dispatch = useDispatch()


    let onClick = (e) => {
        console.log("onClick", e.target.value)
        dispatch(setColor(e.target.value))
    }

    let dispatchDummy = (value) => {
        dispatch(setDummyValue(value))
    }

    let option = [
        [0, "#00ff00", "blue"],
        [1, "#00ffff", "yellow"],
        [2, "#0000ff", "green"],
    ]

    let initValue = useSelector(state => state.dummy.value)


    return (
        <div>
            <h1>Sidebar4</h1>
            <SidebarDropdown description="Select cube color" options={option} onChange={onClick} />
            <SidebarSlider initValue={initValue} onChange={dispatchDummy}></SidebarSlider>

        </div>
    )
}

export default Sidebar4
