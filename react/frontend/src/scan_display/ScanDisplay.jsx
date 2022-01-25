import React from 'react';
import './css/scanDisplay.css';
import { useDispatch, useSelector } from 'react-redux';
import { BACKEND_URL } from '../app/store';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

let convertIntegerToStringWithLength = (integer, length) => {
    let string = integer.toString();
    while (string.length < length) {
        string = '0' + string;
    }
    return string;
}

const ScanDisplay = () => {
    const projectName = useSelector(state => state.selectedProject.projectName);
    const selectedScan = useSelector(state => state.selectedProject.selectedScan);
    console.log("projectName: ", projectName);
    console.log("selectedScan: ", selectedScan);
    const scanIDString = convertIntegerToStringWithLength(selectedScan, 2);


    return <div className="scanDisplayWindow">
        {selectedScan != -1 ?
            <TransformWrapper>
                <TransformComponent>
                    <img src={BACKEND_URL + "/get_scan_image?project=" + projectName + "&id=" + scanIDString}></img>
                </TransformComponent>
            </TransformWrapper>
            : null}
    </div>;
};

export default ScanDisplay;
