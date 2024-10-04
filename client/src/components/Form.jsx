import React from 'react';

function Form(props) {

    const {isMember} = props

    return ( 
     
            <form name = 'auth-form' id = 'auth-form'>

                <h2>Welcome to RTV!</h2>
                <input placeholder='username' />
                <input placeholder='password' />
                <button>{isMember ? "Login" : "Signup"}</button>

            </form>
       
     );
}

export default Form;