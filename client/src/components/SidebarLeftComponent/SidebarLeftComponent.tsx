import { useNavigate } from "react-router-dom";
import "./SidebarLeftComponent.css";

const SidebarComponent = () => {
  const navigate = useNavigate();
  return (
    <div className="sidebar-left pt-2">
      <div
        className="sidebar-item p-2 m-2 d-flex align-items-center gap-2"
        onClick={() => navigate("/")}
      >
        <i className="bi bi-house-door-fill"></i>
        <span>Trang chủ</span>
      </div>
      <div
        className="sidebar-item p-2 m-2 d-flex align-items-center gap-2"
        onClick={() => navigate("/tag")}
      >
        <i className="bi bi-tags-fill"></i>
        <span>Thẻ</span>
      </div>
      <div
        className="sidebar-item p-2 m-2 d-flex align-items-center gap-2"
        onClick={() => navigate("/bookmark")}
      >
        <i className="bi bi-bookmark-fill"></i>
        <span>Đã lưu</span>
      </div>
    </div>
  );
};

export default SidebarComponent;
