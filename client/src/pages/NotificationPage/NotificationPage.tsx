import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setLoading } from "../../store/uiSlice";
import "./NotificationPage.css";
import React from "react";
import { getNotif, markedRead } from "../../api/commonApi";
import { useMutation, useQuery } from "@tanstack/react-query";
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

  const markRead = async (id: number) => {
    try {
      dispatch(setLoading(true));
      const response = await markedRead(id);
      toast.success(response.message)
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

  const { data: notif } = useQuery({
    queryKey: ['notification'],
    queryFn: fetchNotif,
    enabled: !!user
  })

  const mutation = useMutation({
    mutationKey: ['marked-read'],
    mutationFn: markRead,
  })

  const handleClickNotif = (notifId: number, entityId: number) => {
    mutation.mutate(notifId);
    navigate(`/post-details/${entityId}`)
  }

  console.log(notif)

  return <div>
    <h5 className="mb-4">Thông báo</h5>
    {notif?.map((n: any) => {
      return (
        <div
          key={n.id}
          style={{ cursor: 'pointer', minHeight: '40px', color: !n.isRead ? 'blue' : 'unset' }}
          onClick={() => handleClickNotif(n.id, n.entityId)}
        >
          <span>{n.message}</span>
        </div>
      )
    })}
  </div>;
};

export default NotificationPage;
