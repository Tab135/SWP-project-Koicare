const User = () => {
const [username, setUsername] = useState(null);
    const UserProfile = () => {
       

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (token) {
                const name = getUsernameFromToken(token);
                setUsername(name);
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
            localStorage.removeItem("token"); 
            setUsername(null); 
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