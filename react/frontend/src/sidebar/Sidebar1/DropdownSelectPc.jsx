import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SidebarDropdown from '../components/SidebarDropdown';
import { setSelectedPointcloud } from '../../features/selectedProjectSlice';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../../app/store'

let fetchPointclouds = async (project) => {
    let pointclouds = [];
    let url = BACKEND_URL + 'get-project-pointcloud-options?project=' + project;
}





const DropdownSelectPc = () => {

    let selectedProject = useSelector(state => state.selectedProject.projectName);
    let selectedPc = useSelector(state => state.selectedProject.selectedPointcloud);

    return <>
        <SidebarDropdown description={'Select pointcloud'} selectedValue={selectedPc} />
    </>;
};

export default DropdownSelectPc;
