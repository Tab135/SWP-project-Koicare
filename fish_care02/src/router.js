import { ROUTERS } from "./utis/router";
import { Route, Routes } from "react-router-dom";
import MasterLayout from "./theme/masterLayout/masterlayout";
import Login from "./pages/user/loginpage/login";
import ForgotPassword from "./pages/user/loginpage/ForgotPassword/ForgotPassword";
import AddKoiPondPage from "./pages/user/PondPage/AddKoiPondPage/AddKoiPondPage";
import ListKoiPondPage from "./pages/user/PondPage/ListKoiPondPage/ListKoiPondPage";
import PrivateRoute from "./component/private-route";
import Homepage from "./pages/user/homepage";
import Profile from "./pages/user/Profile/Profile";
import Koicarepage from "./pages/user/koicarepage";
const renderUserRouter = () => {
  const userRouter = [
    {
      path: ROUTERS.USER.HOME,
      element: <MasterLayout>
                  <Homepage />  
              </MasterLayout>,
  },
  {
    path: ROUTERS.USER.KOICARE,
    element: <PrivateRoute/>,
    children: [
        {
            path: ROUTERS.USER.HOME,
            path:  ROUTERS.USER.KOICARE,
            element:<MasterLayout>,
                        <Koicarepage/>
                    </MasterLayout>
        }
    ],
},

    {
      path: ROUTERS.USER.LOGIN,
      element: <Login />,
      useLayout: false,
    },
    {
      path: ROUTERS.USER.FORGOT_PASSWORD,
      element: <ForgotPassword />,
      useLayout: false,
    },
    {
      path: ROUTERS.USER.ADD_POND,
      element: (
        <MasterLayout>
          <AddKoiPondPage />,
        </MasterLayout>
      ),
    },
    {
      path: ROUTERS.USER.LIST_PONDS,
      element: (
        <MasterLayout>
          <ListKoiPondPage />,
        </MasterLayout>
      ),
    },
    {
      path: ROUTERS.USER.Profile,
      element: (
        <MasterLayout>
          <Profile/>,
        </MasterLayout>
      ),
    },
  ];

  return (
    <Routes>
      {userRouter.map((item, key) => (
        <Route key={key} path={item.path} element={item.element}>
          {item.children?.map((child, childKey) => (
            <Route
              key={childKey}
              path={child.path}
              element={child.element} // Render children trong layout
            />
          ))}
        </Route>
      ))}
    </Routes>
  );
};

const RouterControl = () => {
  return renderUserRouter();
};

export default RouterControl;
