import { NavLink, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Admin() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://backend-seven-kappa-97.vercel.app/admin/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                alert('Failed to load users. Please try again.');
            }
        };
        fetchUsers();
    }, []);

    const handleShowMore = (userId) => {
        navigate(`/admin/users/${userId}`);
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await axios.delete(`https://backend-seven-kappa-97.vercel.app/admin/users/${userId}`);
            setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
            alert('User deleted successfully.');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Please try again.');
        }
    };

    const handleSignOut = () => {
        navigate('/signin');
        window.location.reload();
    };

    return (
        <>
            <nav className="h-[100px] w-full bg-black flex items-center justify-between px-20 py-10 mb-[30px] sticky top-0 z-10">
                <div className="flex items-center">
                    <div className="mr-[36px] font-bold text-white text-2xl">MovieSaga</div>
                    <ul className="flex space-x-[36px]">
                        <li>
                            <NavLink to="/admin" activeclassname="active" className="p-1 text-white">
                                Users
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div className="flex items-center">
                    <button onClick={handleSignOut} className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                        Sign Out
                    </button>
                </div>
            </nav>
            <div className='px-[200px]'>
                <h2 className="text-[55px] font-bold text-center mb-16 text-white">ADMIN PANEL</h2>
                <div className="w-full">
                    {users.length > 0 ? (
                        users.map(user => (
                            <div key={user._id} className='flex items-center justify-between border-b border-gray-300 py-4'>
                                <div className="flex items-center">
                                    <div className="p-6 bg-orange-500 h-10 w-10 flex items-center justify-center rounded-full uppercase text-white font-bold mr-4">
                                        {user.username.charAt(0)}
                                    </div>
                                    <div className="font-bold text-white mr-32">{user.username}</div>
                                    <div className="text-white">{user.email}</div>
                                </div>
                                <div className="flex">
                                    <button onClick={() => handleShowMore(user.userId)} className="bg-blue-600 text-white h-8 w-32 font-bold rounded-[4px] flex justify-center items-center text-[13px] mr-4 hover:bg-blue-700 transition">
                                        SHOW MORE
                                    </button>
                                    <button onClick={() => handleDelete(user.userId)} className="bg-red-600 text-white h-8 w-32 font-bold rounded-[4px] flex justify-center items-center text-[13px] hover:bg-red-700 transition">
                                        DELETE
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-white">No users found.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Admin;
