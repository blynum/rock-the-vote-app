import React, { useState } from "react";

function Form(props) {
  const initState = { username: "", email: "", password: "" }; // Initial state includes all fields

  const [formData, setFormData] = useState(initState);
  const { isMember, submit } = props;

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();

    // For login, send only email and password. For signup, send all fields.
    const dataToSend = isMember
      ? { email: formData.email, password: formData.password } // Login: email and password only
      : formData; // Signup: send all fields

    submit(dataToSend);
  }

  return (
    <form name="auth-form" id="auth-form" onSubmit={handleSubmit}>
      <h2>Welcome to RTV!</h2>

      {!isMember && ( // Show username input only for signup
        <input
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      )}

      <input
        placeholder="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        placeholder="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />

      <button type="submit">{isMember ? "Login" : "Signup"}</button>
    </form>
  );
}

export default Form;
