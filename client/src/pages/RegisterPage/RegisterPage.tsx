import { useState } from "react";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reTypePassword, setReTypePassword] = useState("");
  const [name, setName] = useState("");

  const handleLogin = () => {
    console.log(email, password, reTypePassword, name);
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center min-vh-100 bg-secondary">
      <div className="login-form w-25 bg-light p-4">
        <h6 className="text-center">Đăng ký</h6>
        <label htmlFor="inputName" className="form-label">
          Tên
        </label>
        <input
          type="name"
          id="inputName"
          className="form-control"
          aria-describedby="passwordHelpBlock"
          onChange={(e) => setName(e.target.value)}
        ></input>
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
        <label htmlFor="inputPassword" className="form-label">
          Nhập lại mật khẩu
        </label>
        <input
          type="password"
          id="inputReTypePassword"
          className="form-control"
          aria-describedby="passwordHelpBlock"
          onChange={(e) => setReTypePassword(e.target.value)}
        ></input>
        <button className="btn btn-primary mt-4 w-100" onClick={handleLogin}>
          Đăng ký
        </button>
        <div className="extra-text mt-3">
          <span>Bạn đã có tài khoản? </span>
          <a href="/login" className="to-login">
            Đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
