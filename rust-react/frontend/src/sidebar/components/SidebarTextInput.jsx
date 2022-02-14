import React from 'react';
import SidebarDescription from './SidebarDescription';

const SidebarTextInput = ({ description, value, onChange }) => {

    return <div className="sidebarRow">
        <SidebarDescription text={description} />
        <div className="sidebarRight">
            <input type="text" className="sidebarTextInput" value={value} onChange={onChange} />
        </div>



    </div>;
};

SidebarDescription.defaultProps = {
    description: "Default desc",
    value: "SidebarTextInputDef",
    onChange: (e) => {
        console.log("textInput:", e.target.value)
    }


};

export default SidebarTextInput;
