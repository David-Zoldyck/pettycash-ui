import { useState } from "react";
import PetiCashForm from "./components/form.jsx";
import Display from "./components/displaypage/display.jsx";
import { Link, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import logo from "../src/components/assets/Cyberbytelogo.jpeg";
import httpClient from "./hooks/server.js";
import { useUser } from "./hooks/useUser.js";
import { useEffect } from "react";
import { getCurrentUser } from "./utils/currentUser.js";
import { BsPersonFill } from "react-icons/bs";

function App() {
  const [user, setUser] = useState("");

  const fetchData = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(user);
  return (
    <>
      <nav className="bg-orange-600 h-12 sticky top-0">
        <div className="container h-full mx-auto px-4">
          <ul className="flex flex-row items-center space-x- text-center h-12 justify-between">
            <div className="flex flex-row space-x-12">
              <li className="text-white hover:bg-orange-200 hover:text-black font-semibold w-16 h-12 flex items-center px-[9px] transition duration-300">
                <Link to="/">Home</Link>
              </li>
              <li className="text-white hover:bg-orange-200 hover:text-black font-semibold w-28 h-12 flex items-center px-[9px] transition duration-300">
                <Link to="/create-request">Submit Form</Link>
              </li>
              <li className="text-white hover:bg-orange-200 hover:text-gray-900 font-semibold w-28 h-12 flex items-center px-[9px] transition duration-300">
                <Link to="/show-requests">View Forms</Link>
              </li>
            </div>
            {/* <div>
              <li>
                <Link
                  to="/create-account"
                  className="text-white hover:bg-orange-200 hover:text-gray-900 font-semibold w-28 h-12 flex items-center px-[9px] transition duration-300"
                >
                  Create User
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-white hover:bg-orange-200 hover:text-gray-900 font-semibold w-28 h-12 flex items-center px-[9px] transition duration-300"
                >
                  Login
                </Link>
              </li>
            </div> */}

            <div className="flex flex-row items-center space-x-2 hover:bg-orange-200 hover:text-gray-900 cursor-pointer h-full p-3">
              <BsPersonFill className="w-7 h-7 text-white" />
              <li className="capitalize text-white font-semibold">
                {user.username}
              </li>
            </div>
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
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
