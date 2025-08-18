import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{ width: "250px", height: 'calc(100vh - 60px)' }}>
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                <span className="fs-4">Quản trị</span>
            </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <li><Link className="nav-link" to="/admin/dashboard">Dashboard</Link></li>
                <li><Link className="nav-link" to="/admin/users">Người dùng</Link></li>
                <li><Link className="nav-link" to="/admin/posts">Bài viết</Link></li>
                <li><Link className="nav-link" to="/admin/reports">Báo cáo</Link></li>
                <li><Link className="nav-link" to="/admin/settings">Cài đặt</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar
