import { Facebook, Google } from '@mui/icons-material';
import { useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import axios from 'axios';

function SignUp() {
    const [username, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🛑 Prevent empty inputs
        if (!username || !email || !password) {
            setError("All fields are required!");
            return;
        }

        try {
            const response = await axios.post(
                "https://backend-seven-kappa-97.vercel.app/signup",
                { username, email, password }
            );

            if (response.status === 201) {
                navigate('/signin');
                window.location.reload();
            }
        } catch (error) {
            console.error("❌ Signup Error:", error.response?.data || error.message);

            if (error.response?.status === 409) {
                setError("User already exists. Try signing in.");
            } else if (error.response?.status === 400) {
                setError("Invalid input. Please check your details.");
            } else {
                setError("Something went wrong. Please try again later.");
            }
        }
    };

    return (
        <div className="bg-black min-h-screen flex justify-center mt-5">
            <div className="p-6 bg-transparent text-white">
                <h2 className="text-[55px] font-bold text-center mb-10">SIGN UP</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                    <div className="mb-6 relative">
                        <PersonIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow_default" />
                        <input
                            value={username}
                            placeholder="Username"
                            type="text"
                            id="username"
                            className="bg-transparent w-[340px] px-3 py-2 border-2 rounded-md text-white focus:outline-none focus:border-yellow-500 text-center"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-6 relative">
                        <EmailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow_default" />
                        <input
                            value={email}
                            placeholder="Email"
                            type="email"
                            id="email"
                            className="bg-transparent w-[340px] px-3 py-2 border-2 rounded-md text-white focus:outline-none focus:border-yellow-500 text-center"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-6 relative">
                        <VpnKeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow_default" />
                        <input
                            value={password}
                            placeholder="Password"
                            type="password"
                            id="password"
                            className="bg-transparent w-[340px] px-3 py-2 border-2 rounded-md text-white focus:outline-none focus:border-yellow-500 text-center"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="mb-5 text-center">
                        <p className="text-sm">
                            Already have an account?  
                            <NavLink to="/signin" className="text-yellow_default ml-2">Sign In</NavLink>
                        </p>
                    </div>

                    <div className="mb-10">
                        <Button name="SIGN UP" bgColor="yellow_default" textColor="black" />
                    </div>
                </form>

                <hr className="my-6 border-gray-300 w-[400px]" />
                <p className="text-center my-6">Sign up with</p>
                <div className="text-center">
                    <Facebook className="mr-4" style={{ fontSize: "45px" }} />
                    <Google style={{ fontSize: "40px" }} />
                </div>
            </div>
        </div>
    );
}

export default SignUp;
