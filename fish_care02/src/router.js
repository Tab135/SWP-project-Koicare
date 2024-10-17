import { ROUTERS } from "./utis/router";
import { Route, Routes } from "react-router-dom";
import MasterLayout from "./theme/masterLayout/masterlayout";
import Login from "./pages/user/loginpage/login";
import ForgotPassword from "./pages/user/loginpage/ForgotPassword/ForgotPassword";
import AddKoiPondPage from "./pages/user/PondPage/AddKoiPondPage/AddKoiPondPage";
import ListKoiPondPage from "./pages/user/PondPage/ListKoiPondPage/ListKoiPondPage";
import EditPondPage from "./pages/user/PondPage/EditPondPage/EditPondPage";
import PrivateRoute from "./component/private-route";
import Homepage from "./pages/user/homepage";
import Profile from "./pages/user/Profile/Profile";
import Koicarepage from "./pages/user/koicarepage";
import OtpVerify from "./pages/user/loginpage/OtpVerify/OtpVerify";
import UpdateProfile from "./pages/user/Profile/UpdateProfile";
import Foodcal from "./pages/user/foodcalpage/foodcal";
import Shop from "./pages/Shop/Shop";
import AddProduct from "./pages/Shop/product/Add_Product/AddProduct";
import Saltcal from "./pages/user/saltCalPage/saltcal";
import LoginRegister from "./pages/user/loginpage/LoginRegister/LoginRegister";
import AddKoiFishPage from "./pages/user/KoiPage/AddKoiFishPage/AddKoiFishPage";
import ListKoiFishPage from "./pages/user/KoiPage/ListKoiFishPage/ListKoiFishPage";
import KoiDetailPage from "./pages/user/KoiPage/KoiDetailPage/KoiDetailPage";
import ProductDetail from "./pages/Shop/product/Product Detail/ProductDetail";
import UpdateProduct from "./pages/Shop/product/Update Product/UpdateProduct";
const renderUserRouter = () => {
  const userRouter = [
    {
      path: ROUTERS.USER.HOME,
      element: (
        <MasterLayout>
          <Homepage />
        </MasterLayout>
      ),
    },
    {
      path: ROUTERS.USER.KOICARE,
      element: <PrivateRoute />,
      children: [
        {
          path: ROUTERS.USER.KOICARE,
          element: (
            <MasterLayout>
              <Koicarepage />
            </MasterLayout>
          ),
        },
      ],
    },
    {
      path: ROUTERS.USER.LOGIN,
      element: <LoginRegister />,
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
          <Profile />,
        </MasterLayout>
      ),
    },
    {
      path: ROUTERS.USER.EDIT_POND,
      element: (
        <MasterLayout>
          <EditPondPage />
        </MasterLayout>
      ),
    },
    {
      path: ROUTERS.USER.OTP_VERIFY,
      element: <OtpVerify />,
      useLayout: false,
    },
    {
      path: ROUTERS.USER.UpdateProfile,
      element: (
        <MasterLayout>
          <UpdateProfile />
        </MasterLayout>
      ),
    },
    {
      path: ROUTERS.USER.FOODCAL,
      element: (
        <MasterLayout>
          <Foodcal />
        </MasterLayout>
      ),
    },
    {
      path: ROUTERS.USER.SALTCAL,
      element: (
        <MasterLayout>
          <Saltcal />
        </MasterLayout>
      ),
    },
    {
      path: ROUTERS.USER.Shop,
      element: (
        <MasterLayout>
          <Shop />
        </MasterLayout>
      ),
    },
    {
      path: ROUTERS.USER.AddProduct,
      element: (
        <MasterLayout>
          <AddProduct />
        </MasterLayout>
      ),
    },
    {
      path: ROUTERS.USER.ADD_KOI_FISH,
      element: (
        <MasterLayout>
          <AddKoiFishPage />
        </MasterLayout>
      ),
    },
    {
      path: ROUTERS.USER.LIST_KOI_FISH,
      element: (
        <MasterLayout>
          <ListKoiFishPage />
        </MasterLayout>
      ),
    },
    {
      path: ROUTERS.USER.KOI_DETAILS,
      element: (
        <MasterLayout>
          <KoiDetailPage />
        </MasterLayout>
      ),
    },
    {
      path: ROUTERS.USER.ProductDetail,
      element: (
        <MasterLayout>
          <ProductDetail />
        </MasterLayout>
      ),
    },
    {
      path: ROUTERS.USER.UpdateProduct,
      element: (
        <MasterLayout>
          <UpdateProduct/>
        </MasterLayout>
      ),
    },
  ];

  return (
    <Routes>
      {userRouter.map((item, key) => (
        <Route key={key} path={item.path} element={item.element}>
          {item.children?.map((child, childKey) => (
            <Route key={childKey} path={child.path} element={child.element} />
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
