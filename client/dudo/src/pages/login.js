import React, { useState, useEffect } from 'react';
import '../styles/login.css'

const Login = (props) => {
    function userLogin() {
        var email = document.getElementById("email").value;
        var pass = document.getElementById("pass").value;
        console.log("   Email: " + email);
        console.log("Password: " + pass);
    }

    return (
        <div id="login">
            <div id="center">
                <div id="rightAlign">
                    <h4>Email:</h4>
                    <input id="email" type="text" className="inputs"></input>
                    <div id="break"></div>
                    <h4>Password:</h4>
                    <input id="pass" type="password" className="inputs"></input>
                </div>
            </div>
            <button onClick={userLogin}>Login</button>
        </div>
    );
}
export default Login;