import React, { useState } from "react";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Attempting to log in with:", { username, password });
    // In a real application, you would handle the authentication logic here.
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
      <div className="flex items-center justify-end">
        <a
          href="#"
          className="text-sm font-medium text-red-600 hover:underline"
        >
          Forgot Password?
        </a>
      </div>
      <Button onClick={handleLogin}>Login</Button>
    </main>
  );
};

export default LoginForm;
