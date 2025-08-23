import { useNavigate } from "react-router-dom";
import "./HeaderComponent.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { logoutUser } from "../../api/authApi";
import { toast } from "react-toastify";
import { clearUser } from "../../store/authSlice";
import { Dropdown } from "react-bootstrap";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";





const HeaderComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const [notifications, setNotifications] = useState<any[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const socket = io(import.meta.env.VITE_SOCKET_URL, {
    query: { userId: user?.id },
  });

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

  useEffect(() => {
    if (!user?.id) return; // chỉ connect khi có user

    // tạo kết nối socket 1 lần
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      query: { userId: user.id },
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => { });

    socketRef.current.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user?.id]);

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
          <Dropdown align="end">
            <Dropdown.Toggle
              variant=""
              id="dropdown-notifications"
              bsPrefix="btn p-0 border-0 bg-transparent"
            >
              <div className="notification item d-flex justify-content-center align-items-center  position-relative ">
                <i className="bi bi-bell"></i>
                {notifications.length > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {notifications.length}
                  </span>
                )}
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ minWidth: "300px", maxHeight: "400px", overflowY: "auto" }}>
              <h6 className="text-center">Thông báo</h6>
              {notifications.length === 0 ? (
                <Dropdown.ItemText>Không có thông báo</Dropdown.ItemText>
              ) : (
                notifications.map((n, idx) => (
                  <Dropdown.ItemText key={idx} style={{ borderTop: '1px solid #ccc', padding: '6px' }}>
                    {n.message || "Bạn có thông báo mới"}
                  </Dropdown.ItemText>
                ))
              )}
              <h6
                className="text-center pt-3"
                style={{ borderTop: '1px solid #ccc', cursor: 'pointer' }}
                onClick={() => navigate(`/notification`)}
              >Xem thêm</h6>
            </Dropdown.Menu>
          </Dropdown>
          {!user ? (
            <div
              className="login item d-flex align-items-center px-2"
              onClick={() => navigate('/login')}
            >
              <span>Đăng nhập</span>
            </div>
          ) : (
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
