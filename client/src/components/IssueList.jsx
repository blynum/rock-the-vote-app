import React from "react";
import Issue from "./Issue";

export default function IssueList({
  issues,
  onDelete,
  onEdit,
  handleUpvote,
  handleDownvote,
  fetchComments,
  addComment,
  editComment,
  deleteComment,
}) {
  return (
    <div>
      {issues.map((issue) => {
        return (
          <Issue
            key={issue._id}
            {...issue}
            onDelete={onDelete}
            onEdit={onEdit}
            handleUpvote={handleUpvote}
            handleDownvote={handleDownvote}
            fetchComments={fetchComments}
            addComment={addComment}
            editComment={editComment}
            deleteComment={deleteComment}
          />
        );
      })}
    </div>
  );
}
