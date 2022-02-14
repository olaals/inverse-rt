import React from 'react';
import SidebarSlider from '../components/SidebarSlider';
import { useSelector, useDispatch } from 'react-redux';
import { setPointcloudSize } from '../../features/settingsSlice';

const PointCloudSizeSlider = () => {
    const dispatch = useDispatch();
    let pointCloudSize = useSelector(state => state.settings.pointCloudSize);

    const onChange = (e) => {
        dispatch(setPointcloudSize(e));
    }



    return <>
        <SidebarSlider description={"Pointcloud size"} min={1} max={1000} initValue={pointCloudSize} onChange={onChange} />
    </>;
};

export default PointCloudSizeSlider;
