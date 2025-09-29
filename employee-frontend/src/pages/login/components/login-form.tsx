import React, { useState } from "react";
import Cookies from "js-cookie"; // Import the js-cookie library
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const navigate = useNavigate(); // 2. Initialize the hook
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      // 1. Make the API request to your endpoint
      const loginUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/login`;
      const response = await fetch(loginUrl, {
        // Using a relative path
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }), // Send username and password
      });

      const data = await response.json();

      // 2. Check if the request was successful
      if (!response.ok) {
        // If the server returns an error (e.g., 401 Unauthorized), throw an error
        throw new Error(
          data.message || "Login failed. Please check your credentials."
        );
      }

      // 3. Save the access token in a cookie
      if (data.access_token) {
        // The cookie will expire in 1 day. You can adjust this.
        Cookies.set("access_token", data.access_token, { expires: 1 });
        console.log("Login successful! Token saved to cookie.");
        navigate("/");
      } else {
        throw new Error("No access token received from server.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message); // Display the error message to the user
    } finally {
      setIsLoading(false); // Stop the loading indicator
    }
  };

  return (
    <main className="space-y-6">
      <div className="space-y-4">
        <Input
          id="username"
          label="Username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Display error message if it exists */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-end">
        <a
          href="#"
          className="text-sm font-medium text-red-600 hover:underline"
        >
          Forgot Password?
        </a>
      </div>

      {/* Disable button while loading and show a loading message */}
      <Button
        onClick={handleLogin}
        disabled={isLoading}
        className={`
    bg-indigo-600 font-semibold text-white shadow-lg
    hover:bg-indigo-700
    focus:ring-indigo-500
    disabled:bg-indigo-400 disabled:cursor-wait
    ${isLoading ? "animate-pulse" : ""}
  `}
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </main>
  );
};

export default LoginForm;
