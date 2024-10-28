

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
        LIST_BLOGS: '/public/blog/list',
        BlogDetail: "/public/blog/:blogId",
        UpdateBlog: "/public/blog/update/:blogId",
        Cart: "/user/cart/getCartByUser",
        OrderList : "/user/order/getOrder/:orderId",
        ShopDashboard: "/shop/product",
        Payment:"/user/payment/payment-success",
        AddCate:  "/shop/addCate",
        UpdateCategory: "/shop/updateCate/:cateId",
        History: "/user/track/history",
        Detail:"/user/detail/:orderId",
        News:"/shop/news/",
        ViewNews:"/public/news/:newsId",
        ListNews:"/public/news",
        UpdateNews:"/shop/updatenews/:newsId",


    },
    ADMIN: {
        DASHBOARD: "/admin/dashboard",
    
    }
}; 