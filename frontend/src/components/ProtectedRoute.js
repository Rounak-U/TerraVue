import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ element }) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return element;
}

export default ProtectedRoute;
