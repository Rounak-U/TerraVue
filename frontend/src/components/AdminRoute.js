import React from 'react';
import { Navigate } from 'react-router-dom';
import { ADMIN_TOKEN_KEY } from '../api/admin';

const AdminRoute = ({ element }) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    return element;
};

export default AdminRoute;
