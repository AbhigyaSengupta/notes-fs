import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!token) return null;

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.put("/user/upload-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = res.data.user;
      dispatch(setUser(updatedUser));   
      setSuccess("Profile image updated!");
      
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to upload profile image"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold">
              {user?.name?.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div>
          <p className="font-medium">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Change profile picture
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleProfileUpload}
        disabled={loading}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
      />

      {loading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
      {success && <p className="text-sm text-green-600 mt-2">{success}</p>}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default Profile;