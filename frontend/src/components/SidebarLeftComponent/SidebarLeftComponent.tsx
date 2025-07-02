import "./SidebarLeftComponent.css";

const SidebarComponent = () => {
  return (
    <div className="sidebar-left pt-2">
      <div className="sidebar-item p-2 m-2 d-flex align-items-center gap-2">
        <i className="bi bi-house-door-fill"></i>
        <span>Trang chủ</span>
      </div>
      <div className="sidebar-item p-2 m-2 d-flex align-items-center gap-2">
        <i className="bi bi-tags-fill"></i>
        <span>Thẻ</span>
      </div>
      <div className="sidebar-item p-2 m-2 d-flex align-items-center gap-2">
        <i className="bi bi-bookmark-fill"></i>
        <span>Đã lưu</span>
      </div>
    </div>
  );
};

export default SidebarComponent;
