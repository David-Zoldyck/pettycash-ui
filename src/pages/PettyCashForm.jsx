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
    attachment: "",
  };
  const [form, setForm] = useState(initialState);
  const [itemForm, setItemForm] = useState({
    name: "",
    price: "",
    quantity: "",
  });
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
    console.log("payload", data);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (["items", "accountDetails", "attachment"].includes(key)) return;
      let value = data[key];
      formData.append(key, value);
    });
    formData.append(
      "accountDetails[accountName]",
      data.accountDetails.accountName
    );
    formData.append("accountDetails[number]", data.accountDetails.number);
    formData.append("accountDetails[bank_name]", data.accountDetails.bank_name);

    const total = data.items.reduce((accumulator, item, index) => {
      formData.append(`items[${index}][amount]`, item.price * item.quantity);
      formData.append(`items[${index}][name]`, item.name);
      formData.append(`items[${index}][price]`, item.price);
      formData.append(`items[${index}][quantity]`, item.quantity);
      return accumulator + item.price * item.quantity;
    }, 0);
    formData.append("total", total);
    setTotal(total);
    const attachment = data.attachment[0];
    formData.append("attachment", attachment);
    console.log(data);
    httpClient
      .post("/create-request", formData)
      .then((res) => {
        setForm(res.data);
        console.log(res.data);
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

//TOAST USE INFORMATION
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

