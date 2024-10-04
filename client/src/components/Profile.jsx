import React, { useContext } from "react";
import { UserContext } from "../../context/UserProvider";

function Profile() {
  const { user } = useContext(UserContext);
  return (
    <>
      <h1>Username: {user.username}</h1>
    </>
  );
}

export default Profile;
