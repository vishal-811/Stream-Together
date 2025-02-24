import React, { useState } from "react";
import { Lock, User } from "lucide-react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import { Base_url } from "@/lib";

const StreamSyncSignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const isLoggedIn = useAuth((state) => state.isLoggedin);
  const setIsLoggedIn = useAuth((state) => state.setIsLoggedin);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await axios.post(
        `${Base_url}/auth/signin`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setIsLoggedIn(true);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen w-full p-2 bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-zinc-100 mb-6 text-center">
          Sign In to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border-b border-zinc-700 py-2">
            <User className="text-zinc-400 w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent text-zinc-100 placeholder-zinc-600 focus:outline-none flex-grow"
            />
          </div>

          <div className="flex items-center border-b border-zinc-700 py-2">
            <Lock className="text-zinc-400 w-5 h-5 mr-2" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent text-zinc-100 placeholder-zinc-600 focus:outline-none flex-grow"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 rounded-lg font-semibold transition-all mt-4 flex items-center justify-center 
    ${
      loading
        ? "bg-orange-400 cursor-not-allowed"
        : "bg-orange-500 hover:bg-orange-600 text-zinc-950"
    }
  `}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-zinc-950"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="text-center text-zinc-400 mt-4">
          Don't have an account?
          <a href="/signup" className="text-orange-500 hover:underline">
            {" "}
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default StreamSyncSignIn;
