import React from 'react'
import SidebarDescription from './SidebarDescription'

const SidebarDropdown = ({ description, options, onChange }) => {

    return (
        <div className="sidebarRow">
            <SidebarDescription text={description} />
            <div className="sidebarRight">
                <select className="sidebarDropdown" onChange={(e) => onChange(e)}>
                    {options.map((packed) => {
                        let [index, value, option] = packed
                        console.log(index, value, option)
                        return <option value={value} key={index}>{option}</option>
                    })}
                </select>
            </div>
        </div>
    )
}

SidebarDropdown.defaultProps = {
    description: "Give description",
    options: [
        [0, 0, "option1"],
        [1, 1, "option2"],
        [2, 2, "option3"],
    ],
    onChange: (e) => {
        console.log(e.target.value)
    }
}

export default SidebarDropdown
