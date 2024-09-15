import { Link } from 'react-router-dom';
import { ROUTERS } from '../../../utis/router';
import LoginRegister from './LoginRegister/LoginRegister';

const Login = () => {
  return (
    <>
      <LoginRegister />
      <Link to={ROUTERS.USER.FORGOT_PASSWORD}>Forgot Password?</Link>
    </>
  );
};

export default Login;