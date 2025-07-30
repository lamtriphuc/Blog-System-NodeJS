import type { ReactNode } from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import SidebarLeftComponent from "../SidebarLeftComponent/SidebarLeftComponent";
import "./DefaultComponentNotSideBar.css";

const DefaultComponent: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <HeaderComponent />
      <div className="container d-flex content position-relative">
        <aside className="fixed-sidebar sidebar-left">
          <SidebarLeftComponent />
        </aside>
        <main className="main-content-not-show-sidebar flex-grow-1 mt-2">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DefaultComponent;
