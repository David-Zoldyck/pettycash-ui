import { useState } from "react";
import PetiCashForm from "./components/form.jsx";
import Display from "./components/displaypage/display.jsx";
import { Link, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import logo from "../src/components/assets/Cyberbytelogo.jpeg";

function App() {
  return (
    <>
      <nav className="bg-orange-600 py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <ul className="flex space-x-4">
            <li>
              <Link
                to="/"
                className="text-orange-100 hover:text-white transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/create-request"
                className="text-orange-100 hover:text-white transition duration-300"
              >
                Submit PettyCash Form
              </Link>
            </li>
            <li>
              <Link
                to="/show-requests"
                className="text-orange-100 hover:text-white transition duration-300"
              >
                View Submitted Forms
              </Link>
            </li>
            <li>
              <Link
                to="/create-account"
                className="text-orange-100 hover:text-white transition duration-300"
              >
                Create User
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="text-orange-100 hover:text-white transition duration-300"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="bg-white flex items-center justify-center h-screen">
        <div className="text-center">
          <img src={logo} alt="logo" className="mx-auto w-48" />

          <h1 className="text-5xl font-extrabold mb-4 text-orange-600">
            PettyCash App
          </h1>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Add routes for other pages */}
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
