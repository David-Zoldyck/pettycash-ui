import logo from "../components/assets/Cyberbytelogo.jpeg";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./useContext/context";
import { Link } from "react-router-dom";
import { BsPersonFill } from "react-icons/bs";

export default function ViewSubmittedRequest() {
  const { id } = useParams();
  const [form, setForm] = useState({});
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const getForm = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/get-request/${id}`
      );

      setForm(response.data.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch request");
    }
  };

  const formatCurrency = (value) => {
    return Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(value);
  };

  if (!form) {
    return <div>Petty Cash Request not found.</div>;
  }

  const [showMenu, setShowMenu] = useState(false);
  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };
  const handleModal = () => {
    setShowModal(true);
  };
  const removeUser = () => {
    setShowModal(false);
    window.localStorage.clear();
    window.location.href = "/login";
  };

  const isAdmin = user.role === "admin";

  const handleApprove = async () => {
    const token = localStorage.getItem("user");
    try {
      const res = await fetch(`http://localhost:3000/request/${id}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === "approved") {
        alert("Status has been updated to 'approved'");
      }
      setForm((prevForm) => ({ ...prevForm, status: "approved" }));
      //maybe set message later
    } catch (error) {
      console.log(error);
      alert("Failed to approve the request.");
    }
  };
  const handleReject = async () => {
    const token = localStorage.getItem("user");
    try {
      const res = await fetch(`http://localhost:3000/request/${id}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === "rejected") {
        alert("Status has been updated to 'rejected'");
      }
      setForm((prevForm) => ({ ...prevForm, status: "rejected" }));
      //maybe set message later
    } catch (error) {
      console.log(error);
      alert("Failed to reject the request.");
    }
  };
  // const handleReject = async () => {
  //   try {
  //     await axios.put(`http://localhost:3000/request/${id}/reject`);

  //     setForm((prevForm) => ({ ...prevForm, status: "rejected" }));
  //     //maybe set message later
  //   } catch (error) {
  //     console.log(error);
  //     alert("Failed to reject the request.");
  //   }
  // };

  useEffect(() => {
    getForm();
  }, [id]);

  return (
    <>
      <nav className="bg-orange-600 h-12 sticky top-0 print:hidden">
        <div className="container h-full mx-auto px-4">
          <ul className="flex flex-row items-center space-x- text-center h-12 justify-between">
            <div className="flex flex-row space-x-12">
              <li className="text-white hover:bg-orange-200 hover:text-black font-semibold w-16 h-12 flex items-center px-[9px] transition duration-300">
                <Link to="/home">Home</Link>
              </li>
              {!isAdmin ? (
                <li className="text-white hover:bg-orange-200 hover:text-black font-semibold w-28 h-12 flex items-center px-[9px] transition duration-300">
                  <Link to="/create-request">Submit Form</Link>
                </li>
              ) : null}
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
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-200 hover:text-gray-900"
                      onClick={handleModal}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : null}
              {showModal && (
                <div
                  className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 backdrop-filter backdrop-blur-sm"
                  onClick={() => setShowModal(false)}
                >
                  <div className="modal bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">
                      Are you sure you want to logout?
                    </h2>
                    <div className="flex space-x-4">
                      <button
                        className="confirm-btn flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                        onClick={removeUser}
                      >
                        Confirm
                      </button>
                      <button
                        className="confirm-btn flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ul>
        </div>
      </nav>
      <div className="border border-1 w-2/3 mx-auto my-5 rounded">
        <header className="bg-orange-100">
          <img src={logo} alt="logo" className="mx-auto w-48" />
        </header>

        <div className="container mx-auto p-4 max-w-2xl bg-white">
          <p>{form.id}</p>
          <h2 className="text-2xl font-bold text-center mb-6">
            {/* todo: personalize this */}
            Petty Cash Request
          </h2>
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-2">Personal Information</h3>
            <p>
              <strong>Name: </strong> {form.name}
            </p>
            <p>
              <strong>Date of Expense: </strong>
              {form.date}
            </p>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-2">
              Beneficiary Account Details
            </h3>
            <p>
              <strong>Account Number: </strong>
              {form.accountDetails?.number}
            </p>
            <p>
              <strong>Account Name: </strong>
              {form.accountDetails?.accountName}
            </p>
            <p>
              <strong>Recipient Bank: </strong>
              {form.accountDetails?.bank}
            </p>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-2">Details/Items</h3>
            {form.items?.length && (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="border">
                      <th className="px-4 py-2 border">S/N</th>
                      <th className="px-4 py-2 border">Details/Item Name</th>
                      <th className="px-4 py-2 border">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border"> {index + 1}</td>
                        <td className="px-4 py-2 border"> {item.name}</td>
                        <td className="px-4 py-2 border">
                          {" "}
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="px-4 py-2 border"></td>
                      <td className="px-4 py-2 border">Total</td>
                      <td className="px-4 py-2 border">
                        {formatCurrency(form.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
          </div>
          <p>
            <strong>Authorized By: </strong>
            {form.authorizedBy}
          </p>
          <p>
            <strong>Approved By: </strong>
          </p>
          <div className="flex justify-between">
            <div>
              <button
                onClick={() => window.print()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto print:hidden"
              >
                Print
              </button>
            </div>
            <div className="flex space-x-4">
              {form.status === "pending" && user.role === "admin" && (
                <button
                  onClick={handleApprove}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mt-4 sm:mt-0 print:hidden"
                >
                  Approve
                </button>
              )}
              {form.status === "pending" && user.role === "admin" && (
                <button
                  onClick={handleReject}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mt-4 sm:mt-0 print:hidden"
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
