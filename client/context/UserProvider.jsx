import React, { useState } from "react";
import axios from "axios";

export const UserContext = React.createContext();

const userAxios = axios.create();

userAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function UserProvider(props) {
  const initState = {
    user: JSON.parse(localStorage.getItem("user")) || {},
    token: localStorage.getItem("token") || "",
    issues: [],
  };

  const [userState, setUserState] = useState(initState);

  async function signup(creds) {
    try {
      const res = await axios.post("/api/auth/signup", creds);
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUserState((prevUserState) => {
        return {
          ...prevUserState,
          user: user,
          token: token,
        };
      });

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function login(creds) {
    try {
      const res = await axios.post("/api/auth/login", creds);
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUserState((prevUserState) => {
        return {
          ...prevUserState,
          user: user,
          token: token,
        };
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function logout() {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUserState((prevUserState) => {
        return {
          ...prevUserState,
          token: "",
          user: {},
        };
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserIssues() {
    try {
      const res = await userAxios.get("/api/issues/my-issues");
      setUserState((prevState) => {
        return {
          ...prevState,
          issues: res.data,
        };
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <UserContext.Provider
      value={{ ...userState, signup, login, logout, getUserIssues }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
