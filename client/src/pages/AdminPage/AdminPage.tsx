import { useState } from 'react'
import HeaderAdminComponent from '../../components/HeaderAdminComponent/HeaderAdminComponent'
import Sidebar from '../../components/SidebarAdmin/SidebarAdmin'
import Dashboard from '../../components/AdminComponent/Dashboard';
import UserAmdin from '../../components/AdminComponent/UserAdmin';
import { Outlet } from 'react-router-dom';

const AdminPage = () => {
    return (
        <div>
            <HeaderAdminComponent />
            <div className='d-flex' style={{ paddingTop: '60px' }}>
                <Sidebar />
                <div className='admin-content px-2 mt-3 w-100'>
                    <Outlet />
                </div>
            </div>
        </div >
    )
}

export default AdminPage