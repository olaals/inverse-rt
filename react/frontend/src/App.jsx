import React from "react";
import ThreeWin from "./three/ThreeWin";
import Sidebar from "./sidebar/Sidebar";
import SidebarSelect from "./sidebar/SidebarSelect";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SceneManager } from "./three/sceneManager";
import ScanDisplay from "./scan_display/ScanDisplay";

const App = () => {
  let sceneManager = null;
  const [sceneHasInit, setSceneHasInit] = useState();

  const viewThreeWin = useSelector(state => state.display.displayThreeWin);
  const viewScanWin = useSelector(state => state.display.displayScanWin);


  useEffect(() => {
    sceneManager = new SceneManager();
    setSceneHasInit(sceneManager);
  }, []);


  return (
    <div className="sidebar-content-flex">
      <Sidebar />
      <SidebarSelect />
      {sceneHasInit && viewThreeWin ? <ThreeWin sceneManager={sceneHasInit} /> : null}
      {viewScanWin ? <ScanDisplay /> : null}

    </div>
  )
}

export default App


