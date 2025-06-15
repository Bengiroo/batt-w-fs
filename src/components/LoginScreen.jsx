import React, { useState } from "react";
import axios from "axios";

export default function LoginScreen({ onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleAuth = async () => {
        try {
            const endpoint = isRegistering ? "register" : "login";
            const res = await axios.post(`http://localhost:4000/auth/${endpoint}`, {
                username,
                password,
            });
            onLogin(res.data.token);
        } catch (err) {
            setError(err.response?.data?.error || "Auth failed.");
        }
    };

    return (
        <div className="login-wrapper">
            <h2>{isRegistering ? "Register" : "Login"}</h2>
            <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleAuth}>
                {isRegistering ? "Register" : "Login"}
            </button>
            <button
                style={{ marginTop: 10, fontSize: 12 }}
                onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError("");
                }}
            >
                {isRegistering ? "Have an account? Login" : "Need an account? Register"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
