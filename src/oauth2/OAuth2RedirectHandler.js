import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuth2RedirectHandler() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(search);
        const token = params.get("token");
        if (token) {
            login(token).then(() => navigate("/", { replace: true }));
        } else {
            navigate("/login", {
                state: { message: params.get("error") || "OAuth login failed" }
            });
        }
    }, [search, login, navigate]);

    return <div>Signing you in…</div>;
}