import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const logout = useLogout();
  const { token, user } = useSelector((state) => state.auth);

  if (!token) return null;

  const shortName = user?.name?.slice(0, 5) || "User";

  return (
    <nav className="backdrop-blur-md bg-white/80 shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">

          <Link to="/" className="text-2xl font-bold text-gray-900">
            📝 Notes
          </Link>

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold uppercase">
                {shortName}
              </span>
            </div>


            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user?.name}
            </span>

            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition-colors"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
