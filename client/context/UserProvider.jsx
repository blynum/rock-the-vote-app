import React, { useState } from "react";
import axios from "axios";

export const UserContext = React.createContext();

const userAxios = axios.create();

userAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function UserProvider(props) {
  const initState = {
    user: JSON.parse(localStorage.getItem("user")) || {},
    token: localStorage.getItem("token") || "",
    issues: [],
    comments: [],
    errMsg: "",
  };

  const [userState, setUserState] = useState(initState);

  // Authentication functions
  async function signup(creds) {
    try {
      const res = await axios.post("/api/auth/signup", creds);
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUserState((prevUserState) => ({
        ...prevUserState,
        user,
        token,
      }));
    } catch (error) {
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
      setUserState((prevUserState) => ({
        ...prevUserState,
        user,
        token,
      }));
    } catch (error) {
      const errorMessage =
        error.response?.data?.errMsg || "Incorrect Username/Email or Password.";
      handleAuthErr(errorMessage);
    }
  }

  async function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUserState((prevUserState) => ({
      ...prevUserState,
      user: {},
      token: "",
    }));
  }

  function handleAuthErr(errMsg) {
    setUserState((prevUserState) => ({
      ...prevUserState,
      errMsg,
    }));
  }

  function resetAuthErr() {
    setUserState((prevUserState) => ({
      ...prevUserState,
      errMsg: "",
    }));
  }

  // Issue-related functions
  async function getUserIssues() {
    try {
      const res = await userAxios.get("/api/issues/my-issues");
      setUserState((prevState) => ({
        ...prevState,
        issues: res.data,
      }));
    } catch (error) {
      console.error("Error fetching user issues:", error);
    }
  }

  async function getAllIssues() {
    try {
      const res = await userAxios.get("/api/issues");
      setUserState((prevState) => ({
        ...prevState,
        issues: res.data,
      }));
    } catch (error) {
      console.error("Error fetching all issues:", error);
    }
  }

  async function addIssue(newIssue) {
    try {
      const res = await userAxios.post("/api/issues", newIssue);
      setUserState((prevState) => ({
        ...prevState,
        issues: [...prevState.issues, res.data],
      }));
    } catch (error) {
      console.error("Error adding new issue:", error);
    }
  }

  async function deleteIssue(issueId) {
    try {
      await userAxios.delete(`/api/issues/${issueId}`);
      setUserState((prevState) => ({
        ...prevState,
        issues: prevState.issues.filter((issue) => issue._id !== issueId),
      }));
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  }

  async function editIssue(issueId, updatedIssue) {
    try {
      const res = await userAxios.put(`/api/issues/${issueId}`, updatedIssue);
      setUserState((prevState) => ({
        ...prevState,
        issues: prevState.issues.map((issue) =>
          issue._id === issueId ? res.data : issue
        ),
      }));
    } catch (error) {
      console.error("Error editing issue:", error);
    }
  }

  async function handleUpvote(issueId) {
    try {
      const res = await userAxios.put(`/api/issues/upvotes/${issueId}`);
      setUserState((prevUserState) => ({
        ...prevUserState,
        issues: prevUserState.issues.map((issue) =>
          issue._id === issueId ? res.data : issue
        ),
      }));
    } catch (error) {
      console.error("Error upvoting issue:", error);
    }
  }

  async function handleDownvote(issueId) {
    try {
      const res = await userAxios.put(`/api/issues/downvotes/${issueId}`);
      setUserState((prevUserState) => ({
        ...prevUserState,
        issues: prevUserState.issues.map((issue) =>
          issue._id === issueId ? res.data : issue
        ),
      }));
    } catch (error) {
      console.error("Error downvoting issue:", error);
    }
  }

  // Comment-related functions
  async function fetchComments(issueId) {
    try {
      const res = await userAxios.get(`/api/comments/${issueId}`);
      return res.data; // Return fetched comments
    } catch (error) {
      console.error("Error fetching comments:", error);
      return []; // Return empty array if there's an error
    }
  }

  async function addComment(issueId, text) {
    try {
      console.log("Sending comment data:", { issueId, text }); // Log data before sending
      const res = await userAxios.post("/api/comments", { issueId, text });
      return res.data; // Return the new comment for immediate UI update
    } catch (error) {
      console.error("Error adding comment:", error.response || error);
      throw error; // Re-throw to handle it in the calling component
    }
  }

  async function editComment(commentId, updatedText) {
    try {
      const res = await userAxios.put(`/api/comments/${commentId}`, {
        text: updatedText,
      });
      setUserState((prevState) => ({
        ...prevState,
        comments: prevState.comments.map((comment) =>
          comment._id === commentId ? res.data : comment
        ),
      }));
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  }

  async function deleteComment(commentId) {
    try {
      await userAxios.delete(`/api/comments/${commentId}`);
      setUserState((prevState) => ({
        ...prevState,
        comments: prevState.comments.filter(
          (comment) => comment._id !== commentId
        ),
      }));
    } catch (error) {
      console.error("Error deleting comment:", error);
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
        getAllIssues,
        addIssue,
        editIssue,
        deleteIssue,
        handleAuthErr,
        resetAuthErr,
        handleUpvote,
        handleDownvote,
        fetchComments,
        addComment,
        editComment,
        deleteComment,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
