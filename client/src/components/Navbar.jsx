import React from 'react';
import {Link} from "react-router-dom"

function Navbar() {
    return ( 
        <div id = "navbar">
        <Link to = "/profile"><button>Profile</button></Link>
        <Link to = "/public"><button>Public</button></Link>
        <Link to = "/"><button>Logout</button></Link>
        </div>
     );
}

export default Navbar;