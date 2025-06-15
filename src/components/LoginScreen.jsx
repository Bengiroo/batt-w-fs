import React, { useState } from "react";
import axios from "axios";
import "./LoginScreen.css"; // ⬅️ Create this CSS file

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
        <div className="login-terminal">
            <h1 className="terminal-title">COMMAND LOGIN</h1>
            <input
                className="terminal-input"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="terminal-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="terminal-button" onClick={handleAuth}>
                {isRegistering ? "Register" : "Login"}
            </button>
            <button
                className="terminal-toggle"
                onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError("");
                }}
            >
                {isRegistering ? "Have access? LOGIN" : "New operator? REGISTER"}
            </button>
            {error && <div className="terminal-error">{error}</div>}
        </div>
    );
}
