import React, { useEffect, useContext } from "react";
import IssueList from "./IssueList";
import { UserContext } from "../../context/UserProvider";

export default function PublicPage() {
  const { getAllIssues, handleUpvote, handleDownvote, issues } =
    useContext(UserContext);

  useEffect(() => {
    getAllIssues(); // Fetch all issues using context function
  }, []);

  return (
    <div>
      <h1>All Issues</h1>
      <IssueList
        issues={issues}
        handleUpvote={handleUpvote}
        handleDownvote={handleDownvote}
      />
    </div>
  );
}
