import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, Route, Routes } from "react-router-dom";
import logo from "../components/assets/Cyberbytelogo.jpeg";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import httpClient from "../hooks/server";

const Login = () => {
  // const { login } = useAuth();
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // try {
    //   const response = await fetch("http://localhost:3000/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ username, password }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     const user = await currentUser(data.token);
    //     // console.log(user);
    //     login(user);
    //     navigate("/");
    //     // Monitor current logged in user
    //   } else {
    //     setError("Invalid username or password");
    //   }
    // } catch (error) {
    //   console.error(error);
    //   setError("An error occurred. Please try again");
    // }
    console.log(formData);

    httpClient
      .post("/login", {
        username: formData.username,
        password: formData.password,
      })
      .then((response) => {
        console.log(response);
        localStorage.setItem("user", response.data.token);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setError("Invalid username or password");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <h1 className="text-3xl text-center font-extrabold mb-4 text-orange-400">
            PettyCash App
          </h1>
          <img src={logo} alt="logo" className="mx-auto w-48" />
          <h1 className="text-2xl font-bold mb-6">Login</h1>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-bold mb-2"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
              }}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
              required
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Login
          </button>

          <div className="mt-2">
            <p>
              Don't have an account?{" "}
              <Link
                to="/create-account"
                className="text-blue-600 hover:text-orange-600 transition duration-300"
              >
                Click here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
