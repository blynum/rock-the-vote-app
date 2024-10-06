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
    errMsg: "",
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
    } catch (error) {
      // Check if response exists before trying to access it
      const errorMessage =
        error.response?.data?.errMsg || "Email Already Taken.";
      handleAuthErr(errorMessage);
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
    } catch (error) {
      // Check if response exists before trying to access it
      const errorMessage =
        error.response?.data?.errMsg || "Incorrect Username/Email or Password.";
      handleAuthErr(errorMessage);
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

  function handleAuthErr(errMsg) {
    setUserState((prevUserState) => {
      return {
        ...prevUserState,
        errMsg,
      };
    });
  }

  function resetAuthErr() {
    setUserState((prevUserState) => {
      return {
        ...prevUserState,
        errMsg: "",
      };
    });
  }
  /*   function resetAuthErr() {
    setUserState((prevUserState) => {
      return {
        ...prevUserState,
        errMsg: "",
      };
    });
  } */
  function resetAuthErr() {
    setUserState((prevUserState) => {
      return {
        ...prevUserState,
        errMsg: "",
      };
    });
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

  async function addIssue(newIssue) {
    try {
      const res = await userAxios.post("api/issues/", newIssue);
      setUserState((prevState) => {
        return {
          ...prevState,
          issues: [...prevState.issues, res.data],
        };
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Delete issue function
  async function deleteIssue(issueId) {
    try {
      await userAxios.delete(`/api/issues/${issueId}`);
      setUserState((prevState) => {
        return {
          ...prevState,
          issues: prevState.issues.filter((issue) => issue._id !== issueId),
        };
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Edit issue function
  async function editIssue(issueId, updatedIssue) {
    try {
      const res = await userAxios.put(`/api/issues/${issueId}`, updatedIssue);
      setUserState((prevState) => {
        return {
          ...prevState,
          issues: prevState.issues.map((issue) =>
            issue._id === issueId ? res.data : issue
          ),
        };
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <UserContext.Provider
      value={{
        ...userState,
        signup,
        login,
        logout,
        getUserIssues,
        addIssue,
        editIssue,
        deleteIssue,
        handleAuthErr,
        resetAuthErr,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
