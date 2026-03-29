import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, clearAuth } from "../features/auth/authSlice";
import { clearNotes } from "../features/notes/notesSlice";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await dispatch(logoutUser());
    } finally {
      dispatch(clearAuth());
      dispatch(clearNotes());
      navigate("/login");
    }
  };

  return logout;
};

export default useLogout;
