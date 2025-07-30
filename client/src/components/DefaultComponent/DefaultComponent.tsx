import type { ReactNode } from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import SidebarLeftComponent from "../SidebarLeftComponent/SidebarLeftComponent";
import SidebarRightComponent from "../SidebarRightComponent/SidebarRightComponent";
import "./DefaultComponent.css";

const DefaultComponent: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <HeaderComponent />
      <div className="container d-flex content position-relative">
        <aside className="fixed-sidebar sidebar-left">
          <SidebarLeftComponent />
        </aside>
        <main className="main-content flex-grow-1 p-4">{children}</main>
        <aside className="fixed-sidebar sidebar-right">
          <SidebarRightComponent />
        </aside>
      </div>
    </div>
  );
};

export default DefaultComponent;
