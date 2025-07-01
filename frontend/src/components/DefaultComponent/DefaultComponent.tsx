import type { ReactNode } from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import SidebarLeftComponent from "../SidebarLeftComponent/SidebarLeftComponent";
import SidebarRightComponent from "../SidebarRightComponent/SidebarRightComponent";
import "./DefaultComponent.scss";

const DefaultComponent: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <HeaderComponent />
      <div className="container d-flex content position-relative">
        <div className="fixed-sidebar sidebar-left">
          <SidebarLeftComponent />
        </div>
        <div className="main-content flex-grow-1 p-4">{children}</div>
        <div className="fixed-sidebar sidebar-right">
          <SidebarRightComponent />
        </div>
      </div>
    </div>
  );
};

export default DefaultComponent;
