import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isSignedIn } from '../../services/api';
import './ProtectedRoute.scss';

function ProtectedRoute() {
    const [isSignin, setIsSignin] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await isSignedIn();
                const isSignin = response.isSuccess;
                setIsSignin(isSignin);

                const hasLoggedInBefore = localStorage.getItem("hasLoggedInBefore");

                if (!isSignin && hasLoggedInBefore === "true") {
                    localStorage.setItem('hasLoggedInBefore', 'false');
                }

                if (isSignin) {
                    localStorage.setItem("hasLoggedInBefore", "true");
                }
            } catch (error) {
                console.error("Sessão expirada", error);
                setIsSignin(false);

                const hasLoggedInBefore = localStorage.getItem("hasLoggedInBefore");
                
                if (hasLoggedInBefore === "true") {
                    localStorage.setItem('hasLoggedInBefore', 'false');
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [location.pathname]);

    if (isLoading) {
        return <div className="wrapperLoading"><div className="loading"></div></div>;
    }

    return isSignin ? <Outlet /> : <Navigate to="/entrar" />;
}

export default ProtectedRoute;