import ProductDashboard from "../pages/Shop/Dash board/ShopDashBoard";
import OrderList from "../pages/Shop/Order/ListOrder";

export const ROUTERS = {
    USER: {
        HOME: "/",
        LOGIN: "/login",
        KOICARE: "/koicare",
        FORGOT_PASSWORD: "/forgot-password",
        ADD_POND: "/add-pond",
        LIST_PONDS: "/list-ponds",
        EDIT_POND: "/edit-pond/:pondId",
        Profile: "/get-profile/:userId",
        OTP_VERIFY: "/otp-verify",
        UpdateProfile: "/adminusershop/update/:userId",
        FOODCAL:"/koicare/food-cal",
        SALTCAL: "/koicare/salt-cal",
        Shop : "/public/product",
        ADD_KOI_FISH: "/add-koi",
        LIST_KOI_FISH: "/list-koi",
        KOI_DETAILS: "/list-koi/:koiId",
        AddProduct: "/shop/addPro",
        ProductDetail: "/public/product/:productId",
        UpdateProduct:"/shop/updatePro/:productId",
        WATERPAGE: "/koicare/waterpage",
        STATITIC: "/koicare/statitic",
        CREATE_BLOG: '/shop/blog/create',
        LIST_BLOGS: '/shop/blog/list',
        Cart: "/user/cart/getCartByUser",
        OrderList : "/user/order/getOrder/:orderId",
        ShopDashboard: "/shop/product"



    }
}; 