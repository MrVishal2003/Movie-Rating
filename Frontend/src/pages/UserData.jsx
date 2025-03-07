import { useParams, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "@mui/icons-material";

const API_BASE_URL = "https://backend-seven-kappa-97.vercel.app"; // ✅ Updated backend URL

function UserData() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/admin/users/${userId}`) // ✅ Updated API URL
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("❌ Error fetching user details:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const handleRemoveRating = async (ratingId) => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/ratings/${ratingId}`); // ✅ Updated API URL

      // ✅ Refresh user data after deleting a rating
      const response = await axios.get(`${API_BASE_URL}/admin/users/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error("❌ Error removing rating:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  const { user, ratings } = userData;

  const handleSignOut = () => {
    navigate("/signin");
    window.location.reload();
  };

  return (
    <>
      {/* ✅ Navbar */}
      <nav className="h-[100px] w-full bg-black flex items-center justify-between px-20 py-10 mb-[30px] sticky top-0 z-10">
        <div className="flex items-center">
          <div className="mr-[36px] font-bold text-white">MovieSaga</div>
          <ul className="flex space-x-[36px]">
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) => (isActive ? "text-orange-400" : "text-white p-1")}
              >
                Users
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="flex items-center">
          <button onClick={handleSignOut} className="p-1 text-white">
            Sign Out
          </button>
        </div>
      </nav>

      {/* ✅ User Info */}
      <div className="px-[200px]">
        <div className="flex justify-center mb-5">
          <div className="flex flex-col justify-center items-center">
            <div className="p-6 bg-orange-500 h-[120px] w-[120px] text-[50px] text-center flex items-center justify-center rounded-full mb-6">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="font-bold text-[25px]">{user.username}</div>
            <div className="text-[14px] text-gray-400 mb-3">{user.email}</div>
          </div>
        </div>

        {/* ✅ Movie Ratings */}
        {ratings.length > 0 ? (
          ratings.map((review) => (
            <div key={review._id} className="mb-10">
              <div className="flex justify-between">
                <div>
                  <div className="flex">
                    <div className="font-bold text-[17px] mr-20">{review.moviename}</div>
                    <div className="text-[14px] text-gray-400">
                      {`${review.day} ${review.month}, ${review.year}`}
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(10)].map((_, index) => (
                      <Star
                        key={index}
                        className={index < review.rating ? "text-yellow-400" : "text-gray-400"}
                        style={{ fontSize: "18px" }}
                      />
                    ))}
                  </div>
                  <div className="mb-2">{review.comment}</div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleRemoveRating(review.ratingId)}
                    className="bg-red-600 hover:bg-red-700 text-white h-[33px] w-[160px] font-bold rounded-[4px] flex justify-center items-center text-[13px]"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
              <hr className="mt-4 border-gray-600" />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">No ratings available</div>
        )}
      </div>
    </>
  );
}

export default UserData;
