import React, { useEffect, useState } from "react";
import axios from "axios";
import IssueList from "./IssueList"; // Reuse the same IssueList component

export default function PublicPage() {
  const [publicIssues, setPublicIssues] = useState([]);

  useEffect(() => {
    async function fetchAllIssues() {
      try {
        const res = await axios.get("/api/issues"); // Fetch all issues
        setPublicIssues(res.data); // Set the response data to the state
      } catch (error) {
        console.error(error);
      }
    }
    fetchAllIssues();
  }, []); // Run this effect on component mount

  return (
    <div>
      <h1>All Issues</h1>
      <IssueList issues={publicIssues} /> {/* Reuse IssueList component */}
    </div>
  );
}
