import { Facebook, Google } from '@mui/icons-material';
import Checkbox from '@mui/material/Checkbox';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { yellow } from '@mui/material/colors';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useState } from 'react';
import axios from 'axios';

const REACT_APP_API_URL = "https://backend-seven-kappa-97.vercel.app";

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post(`${REACT_APP_API_URL}/signin`, { email, password });

            if (response.status === 200) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('userId', response.data.userId);
                navigate('/');
                window.location.reload();
            } else {
                setError("Incorrect email or password. Please try again.");
            }
        } catch (error) {
            setError("Wrong email or password.");
        }
    };

    return (
        <div className="bg-black min-h-screen flex justify-center mt-5">
            <div className="p-6 bg-transparent text-white">
                <h2 className="text-[55px] font-bold text-center mb-16">LOGIN</h2>
                <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                    <div className="mb-8 relative">
                        <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow_default" />
                        <input 
                            placeholder="Email" 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="bg-transparent w-[340px] px-3 py-2 border-[2px] rounded-md text-white focus:outline-none focus:border-yellow-500 text-center"
                            required 
                        />
                    </div>
                    <div className="mb-8 relative">
                        <VpnKeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow_default" />
                        <input 
                            placeholder="Password" 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="bg-transparent w-[340px] px-3 py-2 border-[2px] rounded-md text-white focus:outline-none focus:border-yellow-500 text-center"
                            required 
                        />
                    </div>
                    <div className="mb-5 flex items-center">
                        <Checkbox sx={{ color: yellow[500], '&.Mui-checked': { color: yellow[500] } }} />
                        <label htmlFor="remember" className="text-sm">Remember me</label>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="mb-5 text-center">
                        <p className="text-sm">Don't Have an Account? 
                            <NavLink to="/signup" className="text-yellow_default ml-2">Sign Up</NavLink>
                        </p>
                    </div>
                    <div className="mb-[100px]">
                        <Button name='SIGN IN' bgColor='yellow_default' textColor='black' />
                    </div>
                </form>
                <hr className="my-6 border-gray-300 w-[400px]" />
                <p className="text-center my-6">Log in with</p>
                <div className="text-center">
                    <Facebook className='mr-4' style={{ fontSize: "45px" }} />
                    <Google style={{ fontSize: "40px" }} />
                </div>
            </div>
        </div>
    );
}

export default SignIn;
