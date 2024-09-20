import { ROUTERS } from "./utis/router";

import Homepage from "./pages/user/homepage";
import { Route, Routes} from "react-router-dom";
import MasterLayout from "./theme/masterLayout/masterlayout";
import Login from "./pages/user/loginpage/login";
import ForgotPassword from './pages/user/loginpage/ForgotPassword/ForgotPassword';
import EnterOtp from './pages/user/loginpage/EnterOtp/EnterOtp';
import ResetPassword from './pages/user/loginpage/ResetPassword/ResetPassword';
import PrivateRoute  from "./component/private-route";
import { Children } from "react";

const renderUserRouter = () => {
    const userRouter = [
        {
            path: ROUTERS.USER.HOME,
            Component: Homepage,
            useLayout: true
        },
        {
            path: ROUTERS.USER.LOGIN,
            Component: Login,
            useLayout: false
        },
        {
            path: ROUTERS.USER.FORGOT_PASSWORD,
            Component: ForgotPassword,
            useLayout: false
        },
        {
            path: ROUTERS.USER.SEND_OTP,
            Component: PrivateRoute,
            children: [
                {
                    path: ROUTERS.USER.SEND_OTP,
                    Component: EnterOtp
                }
            ],
            useLayout: false,
        },
        {
            path: ROUTERS.USER.RESET_PASSWORD,
            Component: PrivateRoute,
            children: [
                {
                    path: ROUTERS.USER.SEND_OTP,
                    Component: ResetPassword
                }
            ],
            useLayout: false,
        }
    ];
    
    return (
        
        <Routes>
            {userRouter.map((item, key) => (
                <Route
                    key={key}
                    path={item.path}
                    element={
                        item.useLayout ? (
                            <MasterLayout>
                                <item.Component />
                            </MasterLayout>
                        ) : (
                            <item.Component />
                        )
                    }
                />
            ))}
        </Routes>
);
}


const RouterControl = () => {
    return renderUserRouter();
};

export default RouterControl;
