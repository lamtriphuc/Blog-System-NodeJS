import { useState } from "react";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log(email, password);
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
        <button className="btn mt-4 w-100" onClick={handleLogin}>
          Đăng nhập
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
