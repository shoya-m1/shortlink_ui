import { useState } from "react";
import { loginUser } from "./auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      setMessage(`Login berhasil! Selamat datang, ${res.data.user.name}`);
      if (res.data.user.role === "admin") {
        navigate("/admindashboard");
      } else {
        navigate("/dashboardtest");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Login gagal");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={handleLogin} className="w-80 space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}
