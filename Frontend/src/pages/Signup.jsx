import { Facebook, Google } from '@mui/icons-material';
import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import axios from 'axios';

const REACT_APP_API_URL = "https://backend-seven-kappa-97.vercel.app";

function SignUp() {
    const [username, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post(`${REACT_APP_API_URL}/signup`, { username, email, password });

            if (response.status === 201) {
                navigate('/signin');
                window.location.reload();
            } else {
                setError("Unexpected error occurred.");
            }
        } catch (error) {
            if (error.response?.status === 400) {
                setError("User already exists.");
            } else {
                setError("Signup failed. Please try again.");
            }
        }
    };

    return (
        <div className="bg-black min-h-screen flex justify-center mt-5">
            <div className="p-6 bg-transparent text-white">
                <h2 className="text-[55px] font-bold text-center mb-16">SIGN UP</h2>
                <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                    <div className="mb-8 relative">
                        <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow_default" />
                        <input value={username} placeholder="Username" type="text" id="username" name="username"
                            className="bg-transparent w-[340px] px-3 py-2 border-[2px] rounded-md text-white focus:outline-none focus:border-yellow-500 text-center"
                            onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-8 relative">
                        <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow_default" />
                        <input value={email} placeholder="Email" type="email" id="email" name="email"
                            className="bg-transparent w-[340px] px-3 py-2 border-[2px] rounded-md text-white focus:outline-none focus:border-yellow-500 text-center"
                            onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-8 relative">
                        <VpnKeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow_default" />
                        <input value={password} placeholder="Password" type="password" id="password" name="password"
                            className="bg-transparent w-[340px] px-3 py-2 border-[2px] rounded-md text-white focus:outline-none focus:border-yellow-500 text-center"
                            onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="mb-5 text-center">
                        <p className="text-sm">Already have an account? <NavLink to="/signin" className="text-yellow_default ml-2">Sign In</NavLink></p>
                    </div>
                    <div className='mb-[100px]'>
                        <Button name='SIGN UP' bgColor='yellow_default' textColor='black' />
                    </div>
                </form>
                <hr className="my-6 border-gray-300 w-[400px]" />
                <p className="text-center my-6">Sign up with</p>
                <div className="text-center">
                    <Facebook className='mr-4' style={{ fontSize: "45px" }} />
                    <Google style={{ fontSize: "40px" }} />
                </div>
            </div>
        </div>
    );
}

export default SignUp;
