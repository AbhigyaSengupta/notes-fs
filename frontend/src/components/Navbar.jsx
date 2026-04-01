import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useLogout from "../hooks/useLogout";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const Navbar = () => {
  const logout = useLogout();
  const { token, user } = useSelector((state) => state.auth);
  
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  
  if (!token) return null;

  const shortName = user?.name?.slice(0, 5) || "User";

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <nav className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-lg border-b border-gray-200/50 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 dark:text-gray-100"
            >
              📝 Blogs
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/profile">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-bold uppercase">
                      {shortName}
                    </span>
                  )}
                </div>
              </Link>

              <button
                onClick={() => setDark(!dark)}
                className="p-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Toggle dark mode"
              >
                {dark ? <FaSun className="text-yellow-400" /> : <FaMoon />}
              </button>

              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
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
    </div>
  );
};

export default Navbar;