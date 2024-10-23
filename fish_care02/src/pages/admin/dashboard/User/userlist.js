import React, { useEffect, useState } from 'react';
import axios from 'axios';
const UserDetail = ({ userID, onClose, onDelete }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                let token = localStorage.getItem('token');
                if (!token) {
                    token = sessionStorage.getItem('token');
                }
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`http://localhost:8080/admin/get-user/${userID}`, config);
                setUser(response.data.users);
            } catch (err) {
                setError('Failed to fetch user details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetail();
    }, [userID]);

    const handleDeleteUser = async () => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                let token = localStorage.getItem('token');
                if (!token) {
                    token = sessionStorage.getItem('token');
                }
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token for authentication
                    },
                };
                const response = await axios.delete(`http://localhost:8080/admin/delete/${userID}`, config);
                if (response.status === 200) {
                    alert('User deleted successfully');
                    onDelete(userID); 
                    onClose(); 
                } else {
                    alert('Failed to delete user');
                }
            } catch (err) {
                console.error('Failed to delete user', err);
                alert('An error occurred while deleting the user');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="user-detail">
            <h2>User Details</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Role:</strong> {user.role.name}</p>

            {/* Delete Button */}
            <button className="delete-button" onClick={handleDeleteUser}>Delete User</button>
        </div>
    );
};
const Modal = ({ show, onClose, children }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
            <span className="close-button" onClick={onClose}>×</span>
                {children}
            </div>
        </div>
    );
};
const UserList =() =>{
    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let token = localStorage.getItem('token');
            if (!token) {
                token = sessionStorage.getItem('token');
            }
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get('http://localhost:8080/admin/get-all-users', config); 
                setUsers(response.data.usersList);    
            } catch (err) {
                setError('Failed to fetch users');
                console.error(err);
            } finally {
                setLoading(false); 
            }
        };

        fetchUsers(); 
    }, []); 
    const handleUserDetail = (userID) => {
        console.log('Selected User ID:', userID);
        setSelectedUserId(userID);
        setShowModal(true); 
    };

    const handleCloseDetail = () => {
        setSelectedUserId(null);
        setShowModal(false); 
    };
    const handleDeleteUser = (deletedUserId) => {
        setUsers(users.filter(user => user.id !== deletedUserId));
    };
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
        <h1>User List</h1>
        <table>
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>{user.name}</td>
                        <td>{user.role.name}</td>
                        <td>
                            <button onClick={() => handleUserDetail(user.id)}>Detail</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Modal for user detail */}
        <Modal show={showModal} onClose={handleCloseDetail}>
            {selectedUserId && <UserDetail userID={selectedUserId} onClose={handleCloseDetail} onDelete={handleDeleteUser} />}
        </Modal>
    </div>
    );
}
export default UserList;