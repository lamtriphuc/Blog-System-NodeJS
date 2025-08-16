import AdminPage from "../pages/AdminPage/AdminPage";
import BookmarkPage from "../pages/BookmarkPage/BookmarkPage";
import CreatePostPage from "../pages/CreatePostPage/CreatePostPage";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import NotificationPage from "../pages/NotificationPage/NotificationPage";
import PostDetailsPage from "../pages/PostDetailsPage/PostDetailsPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import TagPage from "../pages/TagPage/TagPage";
import UpdatePostPage from "../pages/UpdatePostPage/UpdatePostPage";
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
    isShowSidebarRight: true,
  },
  {
    path: "/post-details/:id",
    page: PostDetailsPage,
    isShowHeader: true,
    isShowSidebarRight: false,
  },
  {
    path: "/notification",
    page: NotificationPage,
    isShowHeader: true,
  },
  {
    path: "/create-post",
    page: CreatePostPage,
    isShowHeader: true,
    isShowSidebarRight: true,
  },
  {
    path: "/update-post/:id",
    page: UpdatePostPage,
    isShowHeader: true,
    isShowSidebarRight: true,
  },
  {
    path: "/admin",
    page: AdminPage,
    isAdmin: true,
  },
  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: false,
  },
];
