import React, {useState} from 'react';
import Form from './Form';

function Auth() {

    const [isMember, setIsMember] = useState(false)

    const toggleForm = () => {
        setIsMember(!isMember)
    }

    return ( 
        <div id = "auth-div">

        {
          isMember ? 
          
          <>
          <Form isMember = {isMember} /> 
          <button onClick = {toggleForm} >Create an Account?</button>
                 
          </>
          
          : 
          
          <>
          <Form isMember = {isMember} /> 
          <button onClick = {toggleForm}>Already a Member?</button>
                   
          </>
        }
        
     
       
        </div>
     );
}

export default Auth;