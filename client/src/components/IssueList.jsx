import React from "react";
import Issue from "./Issue";

export default function IssueList({
  issues,
  onDelete,
  onEdit,
  handleUpvote,
  handleDownvote,
}) {
  return (
    <div>
      {issues.map((issue) => (
        <Issue
          key={issue._id}
          {...issue}
          onDelete={onDelete}
          onEdit={onEdit}
          handleUpvote={handleUpvote}
          handleDownvote={handleDownvote}
        />
      ))}
    </div>
  );
}
