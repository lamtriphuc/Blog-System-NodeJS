import { useNavigate } from "react-router-dom";
import "./HeaderComponent.css";
const HeaderComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="header d-flex">
      <div className="container d-flex align-items-center justify-content-between">
        <div className="left-block fs-4" onClick={() => navigate("/")}>
          Forume
        </div>
        <div className="d-flex w-50">
          <input className="form-control" type="text" placeholder="Tìm kiếm" />
        </div>
        <div className="right-block d-flex gap-4 align-items-center">
          <div className="create-post d-flex gap-1 align-items-center item px-2">
            <i className="bi bi-plus-lg"></i>
            <span>Tạo bài đăng</span>
          </div>
          <div className="notification item d-flex justify-content-center align-items-center">
            <i className="bi bi-bell"></i>
          </div>
          <div
            className="login item d-flex align-items-center px-2"
            onClick={() => navigate("/login")}
          >
            <span>Đăng nhập</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
