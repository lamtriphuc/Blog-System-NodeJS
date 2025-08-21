import { useNavigate } from "react-router-dom";
import "./HeaderComponent.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { logoutUser } from "../../api/authApi";
import { toast } from "react-toastify";
import { clearUser } from "../../store/authSlice";
import { Dropdown } from "react-bootstrap";
const HeaderComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userProfile');
      dispatch(clearUser());
      navigate('/')
      toast.success(res.message);
    } catch (error) {
      console.log(error)
    }
  };


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
          <div className="create-post d-flex gap-1 align-items-center item px-2"
            onClick={() => navigate('/create-post')}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Tạo bài đăng</span>
          </div>
          <div className="notification item d-flex justify-content-center align-items-center">
            <i className="bi bi-bell"></i>
          </div>
          {!user ? (
            <div
              className="login item d-flex align-items-center px-2"
              onClick={() => navigate('/login')}
            >
              <span>Đăng nhập</span>
            </div>
          ) : (
            // <div className="dropdown">
            //    <div
            //     className="login item d-flex align-items-center px-2 dropdown-toggle"
            //     id="userDropdown"
            //     data-bs-toggle="dropdown"
            //     aria-expanded="false"
            //     style={{ cursor: 'pointer' }}
            //   >
            //     <span>{user.username}</span>
            //   </div>
            //   <ul className="dropdown-menu" aria-labelledby="userDropdown">
            //     <li><a className="dropdown-item" href="/profile">Hồ sơ</a></li>
            //     {user.role == 1 && (<li><a className="dropdown-item" href="/admin">Quản trị</a></li>)}
            //     <li><a className="dropdown-item" href="#" onClick={handleLogout}>Đăng xuất</a></li>
            //   </ul>
            // </div> 
            <Dropdown>
              <Dropdown.Toggle variant="" id="dropdown-basic" bsPrefix="btn">
                {user.username}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/profile">Hồ sơ</Dropdown.Item>
                {user.role == 1 && (<Dropdown.Item href="/admin">Quản trị</Dropdown.Item>)}
                <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
