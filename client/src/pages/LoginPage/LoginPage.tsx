import { useState } from "react";
import "./LoginPage.css";
import { loginUser } from "../../api/authApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // const handleLogin = async () => {
  //   try {
  //     setError(null);
  //     const res = await loginUser(email, password);
  //     console.log(res)
  //     localStorage.setItem('accessToken', res.access_token);
  //     navigate('/')
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       const message = error.response?.data?.message;

  //       if (typeof message === 'string') {
  //         toast.error(message); // hiển thị lỗi rõ ràng từ NestJS
  //       } else if (Array.isArray(message)) {
  //         toast.error(message[0]); // nếu trả về mảng lỗi
  //       } else {
  //         toast.error('Đăng nhập thất bại!');
  //       }
  //     } else {
  //       console.log(error)
  //       toast.error('Lỗi không xác định!');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await loginUser(email, password); // nếu lỗi -> sẽ vào catch
      console.log(res);
      localStorage.setItem('accessToken', res.data.access_token);
      toast.success('Đăng nhập thành công');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center min-vh-100 bg-secondary">
      <div className="login-form w-25 bg-light p-4">
        <h6 className="text-center">Đăng nhập</h6>
        <label htmlFor="inputEmail" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="inputEmail"
          className="form-control"
          aria-describedby="passwordHelpBlock"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <label htmlFor="inputPassword" className="form-label">
          Mật khẩu
        </label>
        <input
          type="password"
          id="inputPassword"
          className="form-control"
          aria-describedby="passwordHelpBlock"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button className="btn btn-primary mt-4 w-100" onClick={handleLogin}>
          {loading ? (
            <div className="spinner-border spinner-border-sm text-light" role="status"></div>
          ) : (
            'Đăng nhập'
          )}
        </button>
        <div className="extra-text mt-3">
          <span>Bạn chưa có tài khoản? </span>
          <a href="/register" className="to-register">
            Đăng ký ngay{" "}
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
