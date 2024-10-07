import React, { useContext, useEffect } from "react";
import { UserContext } from "../../context/UserProvider";
import IssueList from "./IssueList";
import IssueForm from "./IssueForm";

function Profile() {
  const {
    user,
    getUserIssues,
    issues,
    deleteIssue,
    editIssue,
    handleUpvote,
    handleDownvote,
  } = useContext(UserContext);

  useEffect(() => {
    getUserIssues();
  }, []);

  return (
    <>
      <h1>Username: {user.username}</h1>
      <IssueForm />
      <IssueList
        issues={issues}
        onDelete={deleteIssue}
        onEdit={editIssue}
        handleUpvote={handleUpvote}
        handleDownvote={handleDownvote}
      />
    </>
  );
}

export default Profile;
