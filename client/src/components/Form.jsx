import React, { useState } from "react";
import { useActionData } from "react-router-dom";

function Form(props) {
  const initState = { username: "", email: "", password: "" }; // Include email in the initial state

  const [formData, setFormData] = useState(initState);

  const { isMember, submit } = props;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    submit(formData);
  }

  return (
    <form name="auth-form" id="auth-form" onSubmit={handleSubmit}>
      <h2>Welcome to RTV!</h2>
      <input
        placeholder="username"
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      {!isMember && ( // Show email input only for signup
        <input
          placeholder="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      )}
      <input
        placeholder="password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />
      <button>{isMember ? "Login" : "Signup"}</button>
    </form>
  );
}

export default Form;
