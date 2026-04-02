import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { store, persistor } from "./app/store";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotesPage from "./pages/NotesPage";
import Navbar from "./components/Navbar";
import Protected from "./components/Protected";
import Profile from "./pages/Profile";

const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? <Navigate to="/notes" replace /> : children;
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Toaster position="top-center" reverseOrder={false} />
          <Navbar />
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            <Route element={<Protected />}>
              <Route path="/" element={<NotesPage />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
