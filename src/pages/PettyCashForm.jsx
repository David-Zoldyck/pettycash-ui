// import logo from "./logo.svg";
import { useState, useContext } from "react";
import PetiCashForm from "../components/form.jsx";
import Display from "../components/displaypage/display.jsx";
import { Link, Route, Routes } from "react-router-dom";
import { AuthContext } from "./useContext/context.js";
import axios from "axios";
import httpClient from "../hooks/server.js";
import { BsPersonFill } from "react-icons/bs";

export function PettyCashForm() {
  const initialState = {
    name: "",
    date: "",
    accountDetails: {
      number: "",
      bank: "",
      accountName: "",
    },
    authorizedBy: "",
    items: [],
  };
  const [form, setForm] = useState(initialState);
  const [itemForm, setItemForm] = useState({ name: "", amount: 0 });
  const [showForm, setShowForm] = useState(true);
  const [total, setTotal] = useState();
  const { user } = useContext(AuthContext);

  const handleReturn = () => {
    setForm(initialState);
    setTotal(null);
    setShowForm(true);
  };

  const onSubmit = async (data) => {
    // Calculate the total amount
    const total = data.items.reduce(
      (accumulator, item) => accumulator + parseInt(item.amount),
      0
    );
    // console.log("Total:", total);
    setTotal(total);

    // const response = await axios.post(
    //   "http://localhost:3000/create-request",
    //   { ...data, total }
    // );
    httpClient
      .post("/create-request", {
        ...data,
        total,
      })
      .then((res) => {
        console.log(res.data);
        setForm(res.data);
        setShowForm(false);
      })
      .catch((err) => {
        console.log("error", err);
      });

    console.log(data);
  };

  const removeUser = () => {
    window.localStorage.clear();
    window.location.href = "/login";
  };

  const [showMenu, setShowMenu] = useState(false);
  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  console.log(form);

  return (
    <>
      <nav className="bg-orange-600 h-12 sticky top-0">
        <div className="container h-full mx-auto px-4">
          <ul className="flex flex-row items-center space-x- text-center h-12 justify-between">
            <div className="flex flex-row space-x-12">
              <li className="text-white hover:bg-orange-200 hover:text-black font-semibold w-16 h-12 flex items-center px-[9px] transition duration-300">
                <Link to="/home">Home</Link>
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
            <div className="relative">
              <div
                onClick={handleMenuToggle}
                className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer select-none ${
                  showMenu
                    ? "bg-orange-400"
                    : "hover:bg-orange-200 hover:text-black"
                }`}
                style={{ transition: "background-color 300ms" }}
              >
                <div className="flex items-center space-x-2">
                  <BsPersonFill className="w-7 h-7 text-white" />
                  <span className="text-white font-semibold hover:text-black">
                    {user.username}
                  </span>
                </div>
                <div className="transform transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-white ${
                      showMenu ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {showMenu ? (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={removeUser}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </ul>
        </div>
      </nav>
      <div className="">
        {showForm && (
          <PetiCashForm
            submit={onSubmit}
            setForm={setForm}
            form={form}
            itemForm={itemForm}
            setItemForm={setItemForm}
          />
        )}
        {!showForm && (
          <Display
            form={form?.newPettyCashRequest}
            total={total}
            onReturn={handleReturn}
          />
        )}
      </div>
    </>
  );
}
