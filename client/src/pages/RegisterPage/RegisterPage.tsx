import { useState } from "react";
import "./RegisterPage.css";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../store/hooks";
import { setLoading } from "../../store/uiSlice";
import { registerUser } from "../../api/authApi";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reTypePassword, setReTypePassword] = useState("");
  const [name, setName] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const register = async (data: any) => {
    try {
      dispatch(setLoading(true));
      const response = await registerUser(data);
      toast.success(response.message)
      navigate('/login')
      //  { data, statusCode, message }
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Có lỗi xảy ra';
      console.error('Lỗi khi sửa bài viết:', message);
      toast.error(message);
      throw new Error(message); // phải throw để mutation biết là lỗi
    } finally {
      dispatch(setLoading(false));
    }
  }

  const mutation = useMutation({
    mutationKey: ['create-user'],
    mutationFn: register,
  })

  const handleLogin = () => {
    console.log(email, password, reTypePassword, name);
    if (password !== reTypePassword) {
      toast.error('Mật khẩu không khớp');
      return;
    }
    mutation.mutate({ email, password, username: name });
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
