// import logo from "./logo.svg";
import { useState } from "react";
import PetiCashForm from "../components/form.jsx";
import Display from "../components/displaypage/display.jsx";
import { Link, Route, Routes } from "react-router-dom";

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

  const handleReturn = () => {
    setForm(initialState);
    setTotal(null);
    setShowForm(true);
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log(data);
      setForm(data);
      setShowForm(false);
    } catch (e) {
      console.error(e);
    }

    // Calculate the total amount
    const total = data.items.reduce(
      (accumulator, item) => accumulator + parseInt(item.amount),
      0
    );
    console.log("Total:", total);

    setTotal(total);
  };

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
          <Display form={form} total={total} onReturn={handleReturn} />
        )}
      </div>
    </>
  );
}
