import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setViewThreeWin } from '../features/sidebarSelectSlice';

const Sidebar4 = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        console.log("Sidebar4: useEffect");
        dispatch(setViewThreeWin(false));
        return () => {
            dispatch(setViewThreeWin(true));
        }
    }, []);

    return <div>
        <h1>Sidebar4</h1>

    </div>;
};

export default Sidebar4;
