import { useNavigate } from "react-router-dom";
import "./HeaderAdminComponent.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { logoutUser } from "../../api/authApi";
import { toast } from "react-toastify";
import { clearUser } from "../../store/authSlice";
import { useAppDispatch } from "../../store/hooks";
import { setLoading } from "../../store/uiSlice";


const HeaderAdminComponent = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userProfile');
      dispatch(clearUser());
      toast.success(res.message);
    } catch (error) {
      console.log(error)
    } finally {
      navigate('/');
    }
  };


  return (
    <div className="header d-flex">
      <div className="w-100 d-flex align-items-center justify-content-between px-3">
        <div className="left-block fs-4" onClick={() => navigate("/")}>
          Forume
        </div>
        <div className="right-block d-flex gap-4 align-items-center">
          {!user ? (
            <div
              className="login item d-flex align-items-center px-2"
              onClick={() => navigate('/login')}
            >
              <span>Đăng nhập</span>
            </div>
          ) : (
            <div className="dropdown">
              <div
                className="login item d-flex align-items-center px-2 dropdown-toggle"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ cursor: 'pointer' }}
              >
                <span>{user.username}</span>
              </div>
              <ul className="dropdown-menu" aria-labelledby="userDropdown">
                <li><a className="dropdown-item" href="/profile">Hồ sơ</a></li>
                {user.role == 1 && (<li><a className="dropdown-item" href="/admin">Quản trị</a></li>)}
                <li><a className="dropdown-item" onClick={handleLogout}>Đăng xuất</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderAdminComponent;
