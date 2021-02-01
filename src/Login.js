import { Button } from '@material-ui/core';
import React from 'react';
import './Login.css';
import { auth, provider } from './firebase';
import { actionTypes } from './reducer';
import { useStateValue } from './StateProvider';

function Login() {

    const signIn = () => {
        auth
            .signInWithPopup(provider)
            .catch((error) => alert(error.message));
    }
    return (
        <div className="login">
            <div className="login_container">
                <img src="https://br-olymptrade.com/wp-content/uploads/2020/07/Bulls-Bears-750x410.jpg" alt="" />
                <div className="login_text">
                    <h1>Sign in to InvestGroup</h1>
                </div>
                <Button type="submit" onClick={signIn}>Sign in With Google</Button>
            </div>
        </div>
    );
}

export default Login
