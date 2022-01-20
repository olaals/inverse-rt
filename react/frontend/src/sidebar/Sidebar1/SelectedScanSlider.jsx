import React from 'react';
import SidebarSlider from '../components/SidebarSlider';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedScan } from '../../features/selectedProjectSlice';



const SelectedScanSlider = () => {

    const dispatch = useDispatch();
    let selectedScan = useSelector(state => state.selectedProject.selectedScan);
    let numScans = useSelector(state => state.selectedProject.numScans);

    let onChange = (e) => {
        dispatch(setSelectedScan(e));
    }




    return <>
        <SidebarSlider description="Select pointcloud" onChange={onChange} initValue={selectedScan} max={numScans} min={-1} />


    </>;
};

export default SelectedScanSlider;
