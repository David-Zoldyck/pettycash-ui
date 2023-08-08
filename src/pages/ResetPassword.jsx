import React, { useState } from "react";
import axios from "axios";
import httpClient from "../hooks/server";
import { json } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (response.status === 200) {
      setMessage(data.message);
      toast.success("password reset code sent to your email account", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setShowCodeForm(true);
    } else {
      setError(response.error);
      toast.error("An Error has occured", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          password: newPassword,
        }),
      }
    );
    const data = await response.json();

    if (response.status === 200) {
      setMessage(data.message);
      toast.success("Password reset successful", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/home/login");
    } else {
      setError(response.error);
      toast.error("An Error has occured", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <form
            onSubmit={showCodeForm ? handleResetPassword : handleEmailSubmit}
          >
            <h1 className="text-3xl text-center font-extrabold mb-4 text-orange-400">
              PettyCash App
            </h1>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Enter your email:
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={showCodeForm}
              />
            </div>

            {showCodeForm && (
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Enter the code:
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Enter new password:
                  </label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Confirm new password:
                  </label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {error && <div className="text-red-500 mb-4">{error}</div>}
            {message && <div className="text-green-500 mb-4">{message}</div>}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {showCodeForm ? "Submit" : "Send Code"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
