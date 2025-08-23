import React from 'react'
import { toast } from 'react-toastify';
import { setLoading } from '../../store/uiSlice';
import { useAppDispatch } from '../../store/hooks';
import { getStats } from '../../api/commonApi';
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
    const dispatch = useAppDispatch()

    const fetchStats = async () => {
        try {
            const response = await getStats();
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

    const { data: stats } = useQuery({
        queryKey: ['stats'],
        queryFn: fetchStats
    })

    return (
        <div style={{ width: '100%' }}>
            <h3 className='mb-5'>Dashboard</h3>
            <div className="manage d-flex justify-content-between">
                <div
                    className="manage-tag d-flex flex-column justify-content-center align-items-center"
                    style={{
                        width: '200px',
                        height: '100px',
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        background: 'orange'
                    }}>
                    <h4>{stats?.users}</h4>
                    <span>Người dùng</span>
                </div>
                <div
                    className="manage-tag d-flex flex-column justify-content-center align-items-center"
                    style={{
                        width: '200px',
                        height: '100px',
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        background: '#87CEFA'
                    }}>
                    <h4>{stats?.posts}</h4>
                    <span>Bài viết</span>
                </div>
                <div
                    className="manage-tag d-flex flex-column justify-content-center align-items-center"
                    style={{
                        width: '200px',
                        height: '100px',
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        background: '#F0FFF0'
                    }}>
                    <h4>{stats?.tags}</h4>
                    <span>Thẻ</span>
                </div>
                <div
                    className="manage-tag d-flex flex-column justify-content-center align-items-center"
                    style={{
                        width: '200px',
                        height: '100px',
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        background: '#FFDE21'
                    }}>
                    <h4>{stats?.reports}</h4>
                    <span>Báo cáo</span>
                </div>
            </div>
        </div>
    )
}

export default Dashboard