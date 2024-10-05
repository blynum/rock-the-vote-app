import React, { useContext, useEffect } from "react";
import { UserContext } from "../../context/UserProvider";
import IssueList from "./IssueList";

function Profile() {
  const { user, getUserIssues, issues } = useContext(UserContext);

  useEffect(() => {
    getUserIssues();
  }, []);

  return (
    <>
      <h1>Username: {user.username}</h1>
      <IssueList issues={issues} />
    </>
  );
}

export default Profile;
