import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { togglePointcloud } from '../../features/selectedProjectSlice';
import SidebarCheckbox from '../components/SidebarCheckbox';

const ShowHidePointcloud = () => {
    const dispatch = useDispatch();
    let showPointcloud = useSelector(state => state.selectedProject.showPointcloud);

    let onChange = (e) => {
        dispatch(togglePointcloud());
    }


    return <>
        <SidebarCheckbox description="Show pointcloud" onChange={onChange} checked={showPointcloud}></SidebarCheckbox>
    </>;
};

export default ShowHidePointcloud;
