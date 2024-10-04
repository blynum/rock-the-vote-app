import React, { useState } from "react";
import axios from "axios";

export const UserContext = React.createContext();

export default function UserProvider(props) {
  const initState = {
    user: {},
    token: "",
    issues: [],
  };

  const [userState, setUserState] = useState(initState);

  async function signup(creds) {
    try {
      const res = await axios.post("/api/auth/signup", creds);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function login(creds) {
    try {
      const res = await axios.post("/api/auth/login", creds);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <UserContext.Provider value={{ ...userState, signup, login }}>
      {props.children}
    </UserContext.Provider>
  );
}
