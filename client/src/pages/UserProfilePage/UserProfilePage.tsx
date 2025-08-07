import './UserProfilePage.css'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../store'
import dayjs from 'dayjs'
import { getUserProfile, upadateUser, updateAvatar } from '../../api/authApi'
import { useState } from 'react'
import { setUser } from '../../store/authSlice'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { setLoading } from '../../store/uiSlice'
import { toast } from 'react-toastify'
import PostComponent from '../../components/PostComponent/PostComponent'
import { getPostByUser, getSavedPost } from '../../api/postApi'
import type { PostData } from '../../types'
import { useNavigate } from 'react-router-dom'

const fetchPostsByUser = async () => {
  const { data } = await getPostByUser();
  return data;
}
const fetchSavedPosts = async () => {
  const { data } = await getSavedPost();
  return data;
}

const UserProfilePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  const { data: userPosts } = useQuery({
    queryKey: ['user-posts'],
    queryFn: fetchPostsByUser
  })
  const { data: savedPosts } = useQuery({
    queryKey: ['saved-post'],
    queryFn: fetchSavedPosts
  })

  const mutation = useMutation({
    mutationFn: upadateUser,
    onSuccess: async data => {
      console.log(data)
      toast.success(data.message);
      // Gọi lại profile mới
      await queryClient.invalidateQueries({ queryKey: ['profile'] }); // hoặc refetchQueries

      // Lấy lại data (nếu cần)
      const { data: profile } = await queryClient.fetchQuery({
        queryKey: ['profile'],
        queryFn: getUserProfile,
      });

      // Cập nhật Redux & localStorage
      dispatch(setUser(profile));
      localStorage.setItem('userProfile', JSON.stringify(profile));
      setBio('');
      setUsername('');
    },
    onError: (err) => {
      toast.error('Có lỗi xảy ra khi cập nhật');
      console.error(err);
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      dispatch(setLoading(true))
      const result = await updateAvatar(selectedFile);
      console.log('Upload thành công:', result);
      const { data: profile } = await queryClient.fetchQuery({
        queryKey: ['profile'],
        queryFn: getUserProfile,
      });
      localStorage.setItem('userProfile', JSON.stringify(profile));
      dispatch(setUser(profile)); // Cập nhật vào Redux
      toast.success('Cập nhật ảnh thành công')
    } catch (error) {
      console.error('Upload thất bại:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUpdateInfo = async () => {
    try {
      dispatch(setLoading(true));
      mutation.mutate({ username, bio });
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <div>
      <h3 className='text-center'>Thông tin cá nhân</h3>
      <div className="profile d-flex justify-content-around mt-4">
        <div className="profile-left">
          <div className='avatar-profile'>
            {user?.avatarUrl ? (
              <img className='image-profile' src={user.avatarUrl} alt="Avatar" />
            ) : (
              <i className="bi bi-person-fill"></i>
            )}
          </div>
          <div className="upload my-3">
            <label htmlFor="formFileSm" className="form-label">Chọn ảnh</label>
            <input
              className="form-control form-control-sm"
              id="formFileSm"
              type="file"
              onChange={handleFileChange}
            />
            <button className='mt-2 ' onClick={handleUpload} disabled={!selectedFile}>
              Cập nhật avatar
            </button>
          </div>
        </div>
        <div className="profile-right">
          <div className='d-flex flex-column gap-3'>
            <span>Tên người dùng: {user?.username}</span>
            <span>Tiểu sử: {user?.bio}</span>
            <span>Ngày tham gia: {user?.createdAt && dayjs(user.createdAt).format('DD/MM/YYYY')}</span>
            <span>Số bài viết: {user?.username}</span>
            <span>Số bình luận: {user?.username}</span>
          </div>
          <div className='mt-3 d-flex justify-content-center'>
            <button
              type='button'
              className="btn btn-primary"
              data-bs-toggle="modal" data-bs-target="#staticBackdrop"
            >Cập nhật thông tin</button>
          </div>
        </div>
      </div>
      <div className='user-posts mt-5'>
        <h4 className='my-4 text-center'>Bài viết của bạn</h4>
        {userPosts?.map((post: PostData) => {
          return (
            <PostComponent
              key={post.id}
              post={post}
              isBookmark={savedPosts?.some((saved: any) => saved.id === post.id)}
              onClick={() => navigate(`/post-details/${post.id}`)}
            />
          )
        })}
      </div>
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">Cập nhật thông tin</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <span>Tên người dùng: </span>
              <input type="text" className="form-control update-username" placeholder="nguyenvanhai"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <span>Tiểu sử: </span>
              <textarea className="form-control update-bio" rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleUpdateInfo}>Lưu</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage