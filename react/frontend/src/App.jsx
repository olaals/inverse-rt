import React from "react";
import ThreeWin from "./three/ThreeWin";
import Sidebar from "./sidebar/Sidebar";
import SidebarSelect from "./sidebar/SidebarSelect";

const App = () => {
  return (
    <div className="sidebar-content-flex">
      <Sidebar />
      <SidebarSelect />
      <ThreeWin />
    </div>
  )
}

export default App


