
import { ROUTERS } from "./utis/router";

import Homepage from "./pages/user/homepage";
import { Route, Routes } from "react-router-dom";
import MasterLayout from "./theme/masterLayout/masterlayout";
import Login from "./pages/user/loginpage/login";


const renderUserRouter =()=>{
    const userRouter =[
        {
            path: ROUTERS.USER.HOME,
            Component:  Homepage,
            useLayout: true
        },
        {
            path: ROUTERS.USER.LOGIN,
            Component: Login,
            useLayout: false
        },
    ]
    return(
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
    )
}


const RouterControl = () =>{
    return renderUserRouter();
};

export default RouterControl;
