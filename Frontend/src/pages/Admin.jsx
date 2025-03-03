import { NavLink, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Admin() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3000/admin/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    const handleShowMore = (userId) => {
        navigate(`/admin/users/${userId}`);
    };

    const handleDelete = (userId) => {
        axios.delete(`http://localhost:3000/admin/users/${userId}`)
            .then(response => {
                console.log('User deleted successfully');
                console.log(response);
                setUsers(prevUsers => prevUsers.filter(user => user.userId !== userId));
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    };

    const handleSignOut = () => {
        navigate('/signin');
        window.location.reload();
    };

    return (
        <>
            <nav className="h-[100px] w-full bg-black flex items-center justify-between px-20 py-10 mb-[30px] sticky top-0 z-10">
                <div className="flex items-center">
                    <div className="mr-[36px] font-bold">MovieSaga</div>
                    <ul className="flex space-x-[36px]">
                        <li>
                            <NavLink to="/admin" activeclassname="active" className="p-1">
                                User
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div className="flex items-center relative search-container">
                    <li className='list-none'>
                        <button onClick={handleSignOut} className="p-1">
                            Sign Out
                        </button>
                    </li>
                </div>
            </nav>
            <div className='px-[200px]'>
                <h2 className="text-[55px] font-bold text-center mb-16">ADMIN PANEL</h2>
                <div className="w-full">
                    {users.map(user => (
                        <div key={user._id} className='flex border-b border-gray-300 py-4'>
                            <div className="flex items-center">
                                <div className={`p-6 bg-orange-500 h-10 w-10 text-center flex items-center justify-center rounded-full mr-4 uppercase`}>
                                    {user.username.charAt(0)}
                                </div>
                                <div className="font-bold mr-32">{user.username}</div>
                                <div className="flex-1">{user.email}</div>
                            </div>
                            <div className="mt-2 ml-auto flex">
                                <button onClick={() => handleShowMore(user.userId)} className="bg-blue-600 text-white h-8 w-32 font-bold rounded-[4px] flex justify-center items-center text-[13px] mr-4">
                                    SHOW MORE
                                </button>
                                <button onClick={() => handleDelete(user.userId)} className="bg-red-600 text-white h-8 w-32 font-bold rounded-[4px] flex justify-center items-center text-[13px]">
                                    DELETE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Admin;
