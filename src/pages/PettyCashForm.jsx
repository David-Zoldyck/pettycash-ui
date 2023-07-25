// import logo from "./logo.svg";
import { useState, useContext } from "react";
import PetiCashForm from "../components/form.jsx";
import Display from "../components/displaypage/display.jsx";
import { Link, Route, Routes } from "react-router-dom";
import { AuthContext } from "./useContext/context.js";
import axios from "axios";
import httpClient from "../hooks/server.js";
import { BsPersonFill } from "react-icons/bs";
import NavBar from "../components/NavBar.jsx";

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
  const [showModal, setShowModal] = useState(false);
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
        setForm(res.data);
        setShowForm(false);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const handleModal = () => {
    setShowModal(true);
  };

  const removeUser = () => {
    setShowModal(false);
    window.localStorage.clear();
    window.location.href = "/login";
  };

  const [showMenu, setShowMenu] = useState(false);
  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <NavBar />
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


// httpClient
//   .post("/create-request", {
//     ...data,
//     total,
//   })
//   .then(({ data }) => {
//     toast.success(data.message, {
//       position: "top-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "light",
//     });
//     setForm(res.data);
//     setShowForm(false);
//   })
//   .catch((err) => {
//     console.log("error", err);
//     let message;
//     message = err.message;
//     toast.error(message, {
//       position: "top-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "light",
//     });

//     if (err.isAxiosError) {
//       message = err.response.data.error;
//       toast.error(message, {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       });
//     }
//   });
