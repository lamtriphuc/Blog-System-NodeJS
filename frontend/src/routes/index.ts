import BookmarkPage from "../pages/BookmarkPage/BookmarkPage";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import NotificationPage from "../pages/NotificationPage/NotificationPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import TagPage from "../pages/TagPage/TagPage";
import UserProfilePage from "../pages/UserProfilePage/UserProfilePage";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
    isShowSidebarRight: true,
  },
  {
    path: "/login",
    page: LoginPage,
  },
  {
    path: "/register",
    page: RegisterPage,
  },
  {
    path: "/profile",
    page: UserProfilePage,
    isShowHeader: true,
    isShowSidebarRight: true,
  },
  {
    path: "/tag",
    page: TagPage,
    isShowHeader: true,
  },
  {
    path: "/bookmark",
    page: BookmarkPage,
    isShowHeader: true,
  },
  {
    path: "/notification",
    page: NotificationPage,
    isShowHeader: true,
  },
  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: false,
  },
];
