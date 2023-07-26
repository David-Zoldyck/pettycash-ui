import { useState } from "react";
import PetiCashForm from "./components/form.jsx";
import Display from "./components/displaypage/display.jsx";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import logo from "../src/components/assets/Cyberbytelogo.jpeg";
import httpClient from "./hooks/server.js";
import { useUser } from "./hooks/useUser.js";
import { useEffect } from "react";
import { getCurrentUser } from "./utils/currentUser.js";
import { BsPersonFill } from "react-icons/bs";
import { useContext } from "react";
import { AuthContext } from "./pages/useContext/context.js";
import Modal from "react-modal";
import NavBar from "./components/NavBar.jsx";

function App() {
  // const { user } = useUser();
  const { user } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleModal = () => {
    setShowModal(true);
  };

  const removeUser = () => {
    setShowModal(false);
    window.localStorage.clear();
    window.location.replace("/");
  };

  const isAdmin = user.role === "admin";

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
    }
  });

  return (
    <>
      <NavBar />

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
