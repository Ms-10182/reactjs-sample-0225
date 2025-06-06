import React, { useState } from 'react';
import Login from '../components/Auth/Login';
import SignUp from '../components/Auth/SignUp';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleAuthMode = () => {
        setIsLogin((prevMode) => !prevMode);
    };

    return (
        <div className="auth-page">
            {isLogin ? <Login toggleAuthMode={toggleAuthMode} /> : <SignUp toggleAuthMode={toggleAuthMode} />}
        </div>
    );
};

export default AuthPage;