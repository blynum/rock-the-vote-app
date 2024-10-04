import react, { useContext } from "react";
import Auth from "./components/Auth";
import Profile from "./components/Profile";
import Public from "./components/Public";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";

export default function App() {
  const { token, logout } = useContext(UserContext);
  return (
    <>
      {token && <Navbar logout={logout} />}
      <div id="app">
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/profile" /> : <Auth />}
          />
          <Route
            path="profile"
            element={token ? <Profile /> : <Navigate to="/" />}
          />
          <Route
            path="public"
            element={token ? <Public /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </>
  );
}
