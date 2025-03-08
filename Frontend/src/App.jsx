import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Trending from "./pages/Trending";
import TopRated from "./pages/TopRated";
import Series from "./pages/Series";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";
import ShowMore from "./pages/ShowMore";
import Admin from "./pages/Admin";
import UserData from "./pages/UserData";

const API_BASE_URL = "https://backend-seven-kappa-97.vercel.app"; // ✅ Update with actual backend URL

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/authenticated`, { withCredentials: true }) // ✅ Ensure withCredentials is enabled
      .then((response) => {
        setAuthenticated(response.data.authenticated);
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
      });
  }, []);

  const isAdminPage = window.location.pathname.startsWith("/admin");

  return (
    <Router>
      {!isAdminPage && <Navbar />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv-series" element={<Series />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/top-rated" element={<TopRated />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/users/:userId" element={<UserData />} />

        {/* ✅ Fix Authentication Logic */}
        {authenticated ? (
          <Route path="/:mediaType/:id" element={<ShowMore />} />
        ) : (
          <Route path="/:mediaType/:id" element={<Navigate to="/signin" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
