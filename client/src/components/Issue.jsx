import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserProvider";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

export default function Issue(props) {
  const {
    _id,
    title,
    description,
    imgURL,
    username,
    upvotes = [],
    downvotes = [],
    onDelete,
    onEdit,
  } = props;

  const {
    handleUpvote,
    handleDownvote,
    fetchComments,
    addComment,
    editComment,
    deleteComment,
  } = useContext(UserContext);

  // State for managing issue edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title || "");
  const [newDescription, setNewDescription] = useState(description || "");
  const [newImgURL, setNewImgURL] = useState(imgURL || "");

  // State for managing comments
  const [comments, setComments] = useState([]);

  // Fetch comments when component mounts
  // Fetch comments only once when the component mounts
  useEffect(() => {
    let isMounted = true; // Track if component is still mounted
    async function loadComments() {
      const fetchedComments = await fetchComments(_id);
      if (isMounted) setComments(fetchedComments); // Only set state if mounted
    }
    loadComments();

    // Cleanup function to set isMounted to false if component unmounts
    return () => {
      isMounted = false;
    };
  }, [_id]); // Only depend on `_id` so it runs once per issue

  // Handle adding a new comment
  const handleAddComment = async (text) => {
    try {
      const newComment = await addComment(_id, text); // Get the new comment
      setComments((prevComments) => [...prevComments, newComment]); // Add it to state
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Handle editing a comment
  const handleEditComment = async (commentId, updatedText) => {
    const updatedComment = await editComment(commentId, updatedText);
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === commentId ? updatedComment : comment
      )
    );
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );
  };

  const handleDelete = () => {
    if (onDelete) onDelete(_id);
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = () => {
    if (onEdit) {
      const updatedIssue = {
        title: newTitle,
        description: newDescription,
        imgURL: newImgURL,
      };
      onEdit(_id, updatedIssue);
      setIsEditing(false);
    }
  };

  return (
    <div className="issue-card">
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description"
          ></textarea>
          <input
            type="text"
            value={newImgURL}
            onChange={(e) => setNewImgURL(e.target.value)}
            placeholder="Image URL"
          />
          <div className="edit-buttons">
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-btn" onClick={handleEditToggle}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1>{title}</h1>
          <h4>{description}</h4>
          <p>Posted by: {username}</p>
          {imgURL && <img src={imgURL} alt="Issue" />}
          {onDelete && <button onClick={handleDelete}>Delete</button>}
          {onEdit && <button onClick={handleEditToggle}>Edit</button>}
          <div className="vote-buttons">
            <button onClick={() => handleUpvote(_id)}>
              Upvote ({upvotes.length})
            </button>
            <button onClick={() => handleDownvote(_id)}>
              Downvote ({downvotes.length})
            </button>
          </div>
          {/* Comment Form and List */}
          <CommentForm issueId={_id} onCommentAdded={handleAddComment} />
          <CommentList
            comments={comments}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
          />
        </>
      )}
    </div>
  );
}
