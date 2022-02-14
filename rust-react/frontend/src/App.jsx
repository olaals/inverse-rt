import React from "react";
import ThreeWin from "./three/ThreeWin";
import Sidebar from "./sidebar/Sidebar";
import SidebarSelect from "./sidebar/SidebarSelect";
import Topbar from "./topbar/Topbar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SceneManager } from "./three/sceneManager";
import ScanDisplay from "./scan_display/ScanDisplay";
import { Route, Routes } from "react-router-dom";

const App = () => {
  let sceneManager = null;
  const [sceneHasInit, setSceneHasInit] = useState();

  useEffect(() => {
    sceneManager = new SceneManager();
    setSceneHasInit(sceneManager);
  }, []);


  return (
    <>
      <Topbar />

      <div className="sidebar-content-flex">
        <Routes>
          <Route path="/project_select" element={
            <div>Projectselect</div>
          }>
          </Route>
          <Route path="/" element={
            <>
              <Sidebar />
              <SidebarSelect />
              {sceneHasInit ? <ThreeWin sceneManager={sceneHasInit} /> : null}
            </>
          } />
          <Route path="/2dviewport" element={
            <>
              <Sidebar />
              <SidebarSelect />
              <ScanDisplay />
            </>
          } />
        </Routes>
        { }

      </div>
    </>
  )
}

export default App


