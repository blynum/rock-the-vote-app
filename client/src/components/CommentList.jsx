import React from "react";

export default function CommentList({ comments = [] }) {
  if (!comments || comments.length === 0) {
    return <p>No comments yet. Be the first to comment!</p>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment._id} className="comment">
          <p>
            <strong>{comment.userId?.username}</strong> {/* Username */}
          </p>
          <p>{comment.text}</p> {/* Comment text */}
        </div>
      ))}
    </div>
  );
}
