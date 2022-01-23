import React from 'react';
import SidebarTextInput from '../components/SidebarTextInput';
import { useSelector, useDispatch } from 'react-redux';
import { setSceneBackgroundColor } from '../../features/settingsSlice';

const SceneBackgroundColor = () => {
    const dispatch = useDispatch();

    let backgroundColor = useSelector(state => state.settings.sceneBackgroundColor);

    const onChange = (e) => {
        dispatch(setSceneBackgroundColor(e.target.value));
    }


    return <>
        <SidebarTextInput description="Scene background color" onChange={onChange} value={backgroundColor} />

    </>;
};

export default SceneBackgroundColor;
