import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setDisplayThreeWin, setDisplayScanWin } from '../features/displaySlice';
import SelectedScanSlider2 from './Sidebar4/SelectedScanSlider2';

const Sidebar4 = () => {

    return <div>
        <h1>Sidebar4</h1>
        <SelectedScanSlider2 />

    </div>;
};

export default Sidebar4;
