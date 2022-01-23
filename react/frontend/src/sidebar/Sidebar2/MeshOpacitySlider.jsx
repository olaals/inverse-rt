import React from 'react';
import SidebarSlider from '../components/SidebarSlider';
import { setMeshOpacity } from '../../features/settingsSlice';
import { useDispatch, useSelector } from 'react-redux';


const MeshOpacitySlider = () => {

    const dispatch = useDispatch();

    let meshOpacity = useSelector(state => state.settings.meshOpacity);


    let onChange = (e) => {
        dispatch(setMeshOpacity(e));
    }


    return <>
        <SidebarSlider description="Mesh opacity" initValue={meshOpacity} min={0} max={100} onChange={onChange}></SidebarSlider>
    </>;
};

export default MeshOpacitySlider;
