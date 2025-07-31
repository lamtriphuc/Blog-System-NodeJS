import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import DefaultComponentNotSideBar from "./components/DefaultComponentNotSideBar/DefaultComponentNotSideBar";
import { Fragment } from "react/jsx-runtime";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('userProfile');
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {routes.map((route, index) => {
            const Page = route.page;
            const Layout = route.isShowSidebarRight
              ? DefaultComponent
              : (route.isShowHeader) ? DefaultComponentNotSideBar
                : Fragment
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              ></Route>
            );
          })}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
