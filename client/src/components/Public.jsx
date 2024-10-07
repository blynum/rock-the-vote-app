import React, { useEffect, useContext } from "react";
import IssueList from "./IssueList";
import { UserContext } from "../../context/UserProvider";

export default function PublicPage() {
  const { getAllIssues, handleUpvote, handleDownvote, issues } =
    useContext(UserContext);

  useEffect(() => {
    getAllIssues(); // Fetch all issues using context function
  }, [getAllIssues]);

  // Sort issues by the number of upvotes in descending order
  const sortedIssues = [...issues].sort(
    (a, b) => b.upvotes.length - a.upvotes.length
  );

  return (
    <div>
      <h1>All Issues</h1>
      <IssueList
        issues={sortedIssues}
        handleUpvote={handleUpvote}
        handleDownvote={handleDownvote}
      />
    </div>
  );
}
