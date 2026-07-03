import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/admin/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            const data =
                await response.json();

            if (data.success) {

                localStorage.setItem(
                    "admin",
                    JSON.stringify(
                        data.admin
                    )
                );

                alert(
                    "Welcome Admin!"
                );

                navigate(
                    "/dashboard"
                );

            } else {

                alert(
                    data.message
                );

            }

        } catch (error) {

            console.error(
                error
            );

            alert(
                "Server Error"
            );

        }

    };

    return (

        <div
            className="admin-login"
        >

            <h1>
                SPORTIFYX ADMIN
            </h1>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) =>
                    setUsername(
                        e.target.value
                    )
                }
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(
                        e.target.value
                    )
                }
            />

            <button
                onClick={
                    handleLogin
                }
            >
                Login
            </button>

        </div>

    );
}

export default AdminLogin;