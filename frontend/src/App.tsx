import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import DefaultComponentNotSideBar from "./components/DefaultComponentNotSideBar/DefaultComponentNotSideBar";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {routes.map((route, index) => {
            const Page = route.page;
            const Layout = route.isShowSidebarRight
              ? DefaultComponent
              : DefaultComponentNotSideBar;
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
