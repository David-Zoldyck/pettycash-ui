// import logo from "./logo.svg";
import { useState, useContext } from "react";
import PetiCashForm from "../components/form.jsx";
import Display from "../components/displaypage/display.jsx";
import { Link, Route, Routes } from "react-router-dom";
import { AuthContext } from "./useContext/context.js";

export function PettyCashForm() {
  const { name } = useContext(AuthContext);
  console.log(name);
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
      // Calculate the total amount
      const total = data.items.reduce(
        (accumulator, item) => accumulator + parseInt(item.amount),
        0
      );
      // console.log("Total:", total);
      setTotal(total);

      const response = await fetch("http://localhost:3000/create-request", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...data, total }),
      });

      console.log(data);
      setForm(data);
      setShowForm(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <nav className="bg-orange-600 h-12 sticky top-0">
        <div className="container h-full mx-auto px-4">
          <ul className="flex flex-row items-center space-x- text-center h-12">
            <li className="text-white hover:bg-orange-200 hover:text-black font-semibold w-16 h-12 flex items-center px-[9px] transition duration-300">
              <Link to="/">Home</Link>
            </li>
            <li className="text-white hover:bg-orange-200 hover:text-black font-semibold w-28 h-12 flex items-center px-[9px] transition duration-300">
              <Link to="/create-request">Submit Form</Link>
            </li>
            <li className="text-white hover:bg-orange-200 hover:text-gray-900 font-semibold w-28 h-12 flex items-center px-[9px] transition duration-300">
              <Link to="/show-requests">View Forms</Link>
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
