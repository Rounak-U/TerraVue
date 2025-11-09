import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallbackHandler() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const name = params.get("name");

        if (token && name) {
            localStorage.setItem("token", token);
            localStorage.setItem("name", name);

            navigate(`/dashboard/${encodeURIComponent(name)}`, { replace: true });
        } else {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <h3>Logging you in with Google...</h3>
        </div>
    );
}
