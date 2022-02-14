import React from 'react'
import SidebarDescription from './SidebarDescription'
import InputNumberEditor from './InputNumberEditor'
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useSelector } from 'react-redux';


const SidebarSlider = ({ description, initValue, min, max, onChange }) => {

    const [value, setValue] = React.useState(initValue);
    const [dispatchTimer, setDispatchTimer] = React.useState(null);



    const increment = (e) => {
        e.preventDefault();
        if (value < max) {
            onChange(value + 1)
            setValue(value + 1);
        }
    };
    const decrement = (e) => {
        e.preventDefault();
        if (value > min) {
            onChange(value - 1)
            setValue(value - 1);
        }
    };

    const clg = (e) => {
        clearTimeout(dispatchTimer);
        setValue(e)
        setDispatchTimer(setTimeout(() => {
            onChange(e)
        }, 150))
    }


    const calcPercentage = (value, min, max) => {
        return (value - min) / (max - min) * 100;
    }

    return (
        <div className="sidebarRow">
            <SidebarDescription text={description} />
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

SidebarSlider.defaultProps = {
    description: "Give description",
    initValue: 0,
    min: 0,
    max: 100,
    onChange: (e) => {
        console.log(e)
    }
}

export default SidebarSlider
