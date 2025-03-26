import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

export default function Protected({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch user details from Redux store
    const user = useSelector(state => state.auth.user);

    // Redirect unauthenticated users
    useEffect(() => {
        if (!user) {
            navigate("/", { state: { from: location }, replace: true });
        }
    }, [user, navigate, location]);

    // Render children only if user exists
    return user ? <>{children}</> : null;
}