import React, { useState, useContext } from "react";
import Form from "./Form";
import { UserContext } from "../../context/UserProvider";

function Auth() {
  const { login, signup } = useContext(UserContext);

  const [isMember, setIsMember] = useState(false);

  const toggleForm = () => {
    setIsMember(!isMember);
  };

  return (
    <div id="auth-div">
      {isMember ? (
        <>
          <Form isMember={isMember} submit={login} />
          <button onClick={toggleForm}>Create an Account?</button>
        </>
      ) : (
        <>
          <Form isMember={isMember} submit={signup} />{" "}
          {/* Here it should trigger signup */}
          <button onClick={toggleForm}>Already a Member?</button>
        </>
      )}
    </div>
  );
}

export default Auth;
