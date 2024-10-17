const User = () => {
const [username, setUsername] = useState(null);
    const UserProfile = () => {
       

        useEffect(() => {
            let token = localStorage.getItem('token');
            if (!token) {
                token = sessionStorage.getItem('token');
            }
        }, []);

        return (
            <div className="header_login">
                {username ? (
                    <LogoutButton username={username} />
                ) : (
                    <Link to={ROUTERS.USER.LOGIN}>Login</Link>
                )}
            </div>
        );
        
    };

    const LogoutButton = ({ username }) => {

        const handleLogout = () => {
            sessionStorage.getItem('token');
            sessionStorage.removeItem('token');
            window.location.href = '/';
        };
        

        return (
            <div>
                <span>Welcome, {username}!</span>
                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        );
    };
}
export default User;