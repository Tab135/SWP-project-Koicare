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
import ProtectedRoute from "./component/private-route/protect";
import WaterPage from "./pages/user/waterpage/ListWater/waterpage";
import Statitic from "./pages/user/statiticpage/statitic";
import CreateBlogPage from "./pages/Shop/Blogs/CreateBlogsPage/CreateBlogsPage";
import ListBlogsPage from "./pages/user/BlogPage/ListBlogsPage/ListBlogsPage";
import BlogDetail from "./pages/user/BlogPage/BlogDetails/BlogDetails";
import UpdateBlog from "./pages/Shop/Blogs/UpdateBlog/UpdateBlog";
import Cart from "./pages/Shop/Cart/ListCart/ListCart";
import OrderList from "./pages/Shop/Order/ListOrder";
import Dashboard from "./pages/Shop/Dash board/ShopDashBoard";
import ShopDashboard from "./pages/Shop/Dash board/ShopDashBoard";
import DashBoard from "./pages/admin/dashboard/dashboard";
import Payment from "./pages/Shop/Order/Payment";
import AddCate from "./pages/Shop/Category/AddCategory/AddCate";
import UpdateCategory from "./pages/Shop/Category/UpdateCategory/UpdateCategory";
import History from "./pages/user/User history buy/History";
import Detail from "./pages/user/User history buy/Detail";
import News from "./pages/Shop/Newspage/AddNews/addNews";
import ViewNews from "./pages/user/newspage/Viewnews/viewNews";
import ListNews from "./pages/user/newspage/ListNew/listNews";
import UpdateNews from "./pages/Shop/Newspage/UpdateNews/updateNews";
const RouterControl = () => {
  const publicRoutes = [
    { path: ROUTERS.USER.HOME, element: <Homepage /> },
    { path: ROUTERS.USER.LOGIN, element: <LoginRegister />, useLayout: false },
    {
      path: ROUTERS.USER.FORGOT_PASSWORD,
      element: <ForgotPassword />,
      useLayout: false,
    },
    { path: ROUTERS.USER.OTP_VERIFY, element: <OtpVerify />, useLayout: false },
    { path: ROUTERS.USER.Shop, element: <Shop /> },
    { path: ROUTERS.USER.ProductDetail, element: <ProductDetail /> },
    { path: ROUTERS.USER.ViewNews,element:<ViewNews/>},
    { path: ROUTERS.USER.ListNews,element:<ListNews/>},
    { path: ROUTERS.USER.LIST_BLOGS, element: <ListBlogsPage /> },
    { path: ROUTERS.USER.BlogDetail, element: <BlogDetail /> },
  ];

  const protectedRoutes = [
    { path: ROUTERS.USER.News,element:<News/>},
    { path: ROUTERS.USER.UpdateNews,element:<UpdateNews/>},
    { path: ROUTERS.USER.KOICARE, element: <Koicarepage /> },
    { path: ROUTERS.USER.ADD_POND, element: <AddKoiPondPage /> },
    { path: ROUTERS.USER.LIST_PONDS, element: <ListKoiPondPage /> },
    { path: ROUTERS.USER.Profile, element: <Profile /> },
    { path: ROUTERS.USER.EDIT_POND, element: <EditPondPage /> },
    { path: ROUTERS.USER.UpdateProfile, element: <UpdateProfile /> },
    { path: ROUTERS.USER.FOODCAL, element: <Foodcal /> },
    { path: ROUTERS.USER.SALTCAL, element: <Saltcal /> },
    { path: ROUTERS.USER.AddProduct, element: <AddProduct /> },
    { path: ROUTERS.USER.ADD_KOI_FISH, element: <AddKoiFishPage /> },
    { path: ROUTERS.USER.LIST_KOI_FISH, element: <ListKoiFishPage /> },
    { path: ROUTERS.USER.KOI_DETAILS, element: <KoiDetailPage /> },
    { path: ROUTERS.USER.UpdateProduct, element: <UpdateProduct /> },
    { path: ROUTERS.USER.WATERPAGE, element: <WaterPage /> },
    { path: ROUTERS.USER.STATITIC, element: <Statitic /> },
    { path: ROUTERS.USER.CREATE_BLOG, element: <CreateBlogPage /> },
    { path: ROUTERS.USER.UpdateBlog, element: <UpdateBlog /> },
    { path: ROUTERS.USER.Cart, element: <Cart /> },
    { path: ROUTERS.USER.OrderList, element: <OrderList /> },
    { path: ROUTERS.USER.ShopDashboard, element: <ShopDashboard /> },
    { path: ROUTERS.ADMIN.DASHBOARD, element: <DashBoard />, useLayout: false },
    { path: ROUTERS.USER.Payment, element: <Payment/> },
    { path: ROUTERS.USER.AddCate, element: <AddCate /> },
    { path: ROUTERS.USER.UpdateCategory, element: <UpdateCategory /> },
    { path: ROUTERS.USER.History, element: <History/> },
    { path: ROUTERS.USER.Detail, element: <Detail/> },
    
  ];

  return (
    <Routes>
      {publicRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            route.useLayout === false ? (
              route.element
            ) : (
              <MasterLayout>{route.element}</MasterLayout>
            )
          }
        />
      ))}
      <Route element={<ProtectedRoute />}>
        {protectedRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              route.useLayout === false ? (
                route.element
              ) : (
                <MasterLayout>{route.element}</MasterLayout>
              )
            }
          />
        ))}
      </Route>
    </Routes>
  );
};

export default RouterControl;
