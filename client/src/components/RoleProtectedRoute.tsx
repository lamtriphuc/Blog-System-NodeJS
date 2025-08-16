import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { useDispatch } from "react-redux";
import { setLoading } from "../store/uiSlice";
import { useEffect } from "react";

interface RoleProtectedRouteProps {
    children: React.ReactNode;
    requiredRole: number;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, requiredRole }) => {
    const dispatch = useDispatch();
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        if (!user) {
            dispatch(setLoading(true));
        } else {
            dispatch(setLoading(false));
        }
    }, [user]);

    // Nếu đang load user => chưa kiểm tra quyền
    if (user === undefined || user === null) {
        return null; // hoặc <LoadingSpinner />
    }

    // Check quyền
    if (Number(user.role) !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default RoleProtectedRoute;
