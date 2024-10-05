import React, { useState } from "react";

export default function Issue(props) {
  const { _id, title, description, imgURL, onDelete, onEdit } = props;

  // State to manage edit mode and updated values
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newImgURL, setNewImgURL] = useState(imgURL);

  // Handle delete action (only if onDelete is passed)
  const handleDelete = () => {
    if (onDelete) {
      onDelete(_id); // Call the delete function passed as prop
    }
  };

  // Toggle between editing and viewing modes
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Handle save action for editing (only if onEdit is passed)
  const handleSave = () => {
    if (onEdit) {
      const updatedIssue = {
        title: newTitle,
        description: newDescription,
        imgURL: newImgURL,
      };
      onEdit(_id, updatedIssue); // Call the edit function passed as prop
      setIsEditing(false); // Exit editing mode
    }
  };

  return (
    <div className="issue-card">
      {isEditing ? (
        // Edit mode: Wrap input fields in a div with class 'edit-mode'
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

          {/* Buttons for saving or canceling edit */}
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
        // View mode: Display issue details
        <>
          <h1>{title}</h1>
          <h4>{description}</h4>
          {imgURL && <img src={imgURL} alt="Issue" />}
          {/* Only render the Delete button if onDelete is passed */}
          {onDelete && <button onClick={handleDelete}>Delete</button>}
          {/* Only render the Edit button if onEdit is passed */}
          {onEdit && <button onClick={handleEditToggle}>Edit</button>}
        </>
      )}
    </div>
  );
}
