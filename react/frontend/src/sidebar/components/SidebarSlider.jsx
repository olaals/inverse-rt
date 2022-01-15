import React from 'react'
import SidebarDescription from './SidebarDescription'
import InputNumberEditor from './InputNumberEditor'
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const SidebarSlider = ({ initValue, min, max }) => {
    const [value, setValue] = React.useState(initValue);

    const increment = () => {
        setValue(value + 1);
    };
    const decrement = () => {
        setValue(value - 1);
    };
    const clg = (e) => {
        setValue(e)
    }


    const calcPercentage = (value, min, max) => {
        return (value - min) / (max - min) * 100;
    }

    return (
        <div className="sidebarRow">
            <SidebarDescription text="Slider" />
            <div className="sidebarRight">
                <div className="blSlider">
                    <div style={{ width: calcPercentage(value, min, max) + "%" }} className="blSliderBar"></div>
                    <InputNumberEditor className="inputNumberEditor" value={value} min={min} max={max} onChange={clg} />
                    <div className="blSlider__decrement" onClick={decrement}> <AiOutlineLeft className="blSlider__icon" /></div>
                    <div className="blSlider__increment" onClick={increment}> <AiOutlineRight className="blSlider__icon" /></div>
                </div>

            </div>

        </div>
    )
}

export default SidebarSlider
