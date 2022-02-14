import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SidebarDropdown from '../components/SidebarDropdown';
import { setSelectedPointcloud } from '../../features/selectedProjectSlice';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../../app/store'

let fetchPointcloudOptions = async (project) => {
    let pointclouds = [];
    let url = BACKEND_URL + '/get-project-pointcloud-options?project=' + project;
    let response = await fetch(url);
    let json = await response.json();
    pointclouds = json.pointcloud_options
    return pointclouds;
}





const DropdownSelectPc = () => {
    let [options, setOptions] = React.useState([[0, 0, "No pointclouds"]])
    const dispatch = useDispatch();

    let selectedProject = useSelector(state => state.selectedProject.projectName);
    let selectedPc = useSelector(state => state.selectedProject.selectedPointcloud);

    useEffect(() => {
        fetchPointcloudOptions(selectedProject).then(pointclouds => {
            let idx = 0;
            let options = []
            pointclouds.forEach((pointcloud) => {
                options.push([idx, pointcloud, pointcloud])
                idx += 1
            })
            setOptions(options)
        })
    }, []);

    let onChange = (e) => {
        dispatch(setSelectedPointcloud(e.target.value))
    }





    return <>
        <SidebarDropdown description={'Select pointcloud'} selectedValue={selectedPc} options={options} onChange={onChange} />
    </>;
};

export default DropdownSelectPc;
