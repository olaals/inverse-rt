import React from 'react'
import SidebarDropdown from './components/SidebarDropdown'
import { useDispatch } from 'react-redux'
import { setColor } from '../features/colorSlice'
import { setDummyValue } from '../features/dummySlice'
import SidebarSlider from './components/SidebarSlider'
import { useSelector } from 'react-redux'
import SidebarButton from './components/SidebarButton'


const Sidebar4 = () => {
    const dispatch = useDispatch()


    let onClick = (e) => {
        dispatch(setColor(e.target.value))
    }

    let btnOnClick = async (e) => {
        let response = await fetch("http://localhost:5000/get-project-names", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log("got response")
        let data = await response.json()
        console.log("data", data)
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
            <SidebarButton description="Fetch test" buttonText="Fetch" onClick={btnOnClick} />

        </div>
    )
}

export default Sidebar4
