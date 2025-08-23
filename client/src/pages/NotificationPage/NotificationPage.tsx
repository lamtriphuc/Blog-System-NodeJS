import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setLoading } from "../../store/uiSlice";
import "./NotificationPage.css";
import React from "react";
import { getNotif } from "../../api/commonApi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const fetchNotif = async () => {
    try {
      const response = await getNotif();
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message;
      console.log('Lỗi: ', message);
      toast.error('Lỗi: ', message);
      return [];
    } finally {
      dispatch(setLoading(false)); // Đảm bảo tắt loading khi logout
    }
  }

  const { data: notif } = useQuery({
    queryKey: ['notification'],
    queryFn: fetchNotif,
    enabled: !!user
  })

  console.log(notif)

  return <div>
    <h5 className="mb-4">Thông báo</h5>
    {notif?.map((n: any) => {
      return (
        <div
          key={n.id}
          style={{ cursor: 'pointer', minHeight: '40px' }}
          onClick={() => navigate(`/post-details/${n.entityId}`)}
        >
          <span>{n.message}</span>
        </div>
      )
    })}
  </div>;
};

export default NotificationPage;
