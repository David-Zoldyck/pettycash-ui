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
import axios from "axios";
import BarChart from "./components/BarChart.jsx";
import DashboardStats from "./components/DashboardStats.jsx";

function App() {
  // const { user } = useUser();
  const { user } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({});
  const [pending, setPending] = useState("");
  const base_url = import.meta.env.VITE_API_BASE_URL;
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

  const isPending = stats.pendingForms > 0;

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
    }
  });

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
      return;
    }
  }, [user]);

  useEffect(() => {
    const url =
      user.role === "admin"
        ? `${import.meta.env.VITE_API_BASE_URL}/stats`
        : `${import.meta.env.VITE_API_BASE_URL}/user-stats`;
    httpClient
      .get(url)
      .then(({ data }) => {
        setStats(data);
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error);
      });
  }, [user]);

  return (
    <>
      <NavBar />
      <div className="flex flex-col justify-center space-y-[1px] px-10">
        <div className=" items-center">
          <h1 className="text-gray-800 text-lg font-medium">Overview</h1>
        </div>
        {/* className="flex flex-row space-x-7 justify-center gap-3 py-4 divide-y
        divide-orange-200" */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 sm:place-self-center gap-7 py-4">
          {/* <div className="grid grid-cols gap-3 py-4 divide-y divide-orange-200"> */}
          <div className="shadow cursor-pointer shadow-orange-200 hover:shadow-md hover:shadow-orange-300 rounded bg-white p-7 w-64">
            <div className="text-center text-sm font-bold text-gray-600">
              Total
            </div>
            <div className="flex justify-center">
              <span className="text-4xl font-bold text-orange-600">
                {stats.totalForms}
              </span>
            </div>
          </div>
          <div className="shadow cursor-pointer shadow-orange-200 hover:shadow-md hover:shadow-orange-300 rounded bg-white p-7 w-64">
            <div className="text-center text-sm font-bold text-gray-600">
              Approved
            </div>
            <div className="flex justify-center">
              <span className="text-4xl font-bold text-orange-600">
                {stats.approvedForms}
              </span>
            </div>
          </div>
          <div className="shadow cursor-pointer shadow-orange-200 hover:shadow-md hover:shadow-orange-300 rounded bg-white p-7 w-64">
            <div className="text-center text-sm font-bold text-gray-600">
              Rejected
            </div>
            <div className="flex justify-center">
              <span className="text-4xl font-bold text-orange-600">
                {stats.rejectedForms}
              </span>
            </div>
          </div>
          {isPending && (
            <div className="shadow cursor-pointer shadow-orange-200 hover:shadow-md hover:shadow-orange-300 rounded bg-white  p-7 w-64">
              <div className="text-center text-sm font-bold text-gray-600">
                Pending
              </div>
              <div className="flex justify-center">
                <span className="text-4xl font-bold text-orange-600">
                  {stats.pendingForms}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white flex items-center justify-center p-16">
        <div className="text-center">
          <img src={logo} alt="logo" className="mx-auto w-48" />

          <h1 className="text-5xl font-extrabold mb-4 text-orange-600">
            PettyCash App
          </h1>
          {/* <BarChart
            totalForms={stats.totalForms}
            approvedForms={stats.approvedForms}
            rejectedForms={stats.rejectedForms}
          /> */}
          {/* <div className="grid grid-cols-4 gap-6">
            <DashboardStats forms={stats.totalForms} title="Total Forms" />
            <DashboardStats
              forms={stats.approvedForms}
              title="Approved Forms"
            />
            <DashboardStats
              forms={stats.rejectedForms}
              title="Rejected Forms"
            />
            <DashboardStats forms={stats.pendingForms} title="Pending Forms" />
          </div> */}
          {/* <div>
            <h2>Total forms: {stats.totalForms}</h2>
            <h2>Approved forms: {stats.approvedForms}</h2>
            <h2>Rejected forms: {stats.rejectedForms}</h2>
            <h2>Pending forms: {stats.pendingForms}</h2>
          </div> */}
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
