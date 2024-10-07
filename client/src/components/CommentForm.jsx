import React, { useState, useContext } from "react";
import { UserContext } from "../../context/UserProvider";

export default function CommentForm({ issueId, onCommentAdded }) {
  const [text, setText] = useState("");
  const { addComment } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim() === "") {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      await onCommentAdded(text); // Use the provided callback to handle comment addition
      setText(""); // Clear the input
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("Could not post comment. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment"
        required
      />
      <button type="submit">Post Comment</button>
    </form>
  );
}
