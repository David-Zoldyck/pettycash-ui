import React, { useState } from "react";
import axios from "axios";
import httpClient from "../hooks/server";
import { json } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.status === 200) {
      setMessage(data.message);
      setShowCodeForm(true);
    } else {
      setError(response.error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const response = await fetch("http://localhost:3000/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        code,
        password: newPassword,
      }),
    });
    const data = await response.json();

    if (response.status === 200) {
      setMessage(data.message);
    } else {
      setError(response.error);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-8">
        <form onSubmit={showCodeForm ? handleResetPassword : handleEmailSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Enter your email:
            </label>
            <input
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {showCodeForm ? "Submit" : "Send Code"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
