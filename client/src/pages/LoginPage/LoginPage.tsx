import { useState } from "react";
import "./LoginPage.css";
import { getUserProfile, loginUser } from "../../api/authApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../store/authSlice";
import type { RootState } from "../../store";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();


  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      localStorage.setItem('accessToken', data.data.access_token);
      toast.success(data.message);
      try {
        const profile = await queryClient.fetchQuery({
          queryKey: ['profile'],
          queryFn: getUserProfile,
        });
        dispatch(setUser(profile));
        localStorage.setItem('userProfile', JSON.stringify(profile));
        navigate('/');
      } catch (err) {
        console.log('Lấy profile thất bại. Err: ', err);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || error.message);
    },
  })

  const handleLogin = async () => {
    loginMutation.mutate({ email, password });
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
