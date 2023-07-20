import { useState, useEffect, useContext } from "react";
import Display from "../components/displaypage/display";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { AuthContext } from "../pages/useContext/context.js";
import httpClient from "../hooks/server";
import { BsPersonFill } from "react-icons/bs";

export const calculateTotal = (form) => {
  return (form.items ?? []).reduce((total, item) => total + item.amount, 0);
};

export function DisplayForms() {
  const [showForms, setShowForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const formsPerPage = 20;
  const [searchForms, setSearchForms] = useState("");
  const { user } = useContext(AuthContext);
  console.log(user);

  const indexOfLastForm = currentPage * formsPerPage;
  const indexOFirstForm = indexOfLastForm - formsPerPage + 1;

  let getPettyCashRequests;

  if (user.role === "admin") {
    getPettyCashRequests = async (search) => {
      await httpClient
        .get("/get-requests", {
          search,
        })
        .then((res) => {
          console.log(res.data);
          setShowForms(res.data);
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    };
  } else {
    getPettyCashRequests = async (search) => {
      await httpClient
        .get("/get-user-requests", {
          search,
        })
        .then((res) => {
          console.log(res.data);
          setShowForms(res.data);
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    };
  }

  const currentForms = showForms
    ?.filter((form) =>
      form.name.toLowerCase().includes(searchForms.toLowerCase())
    )
    .slice()
    .reverse()
    .slice(indexOFirstForm - 1, indexOfLastForm);

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const pageNumbers = Math.ceil(showForms.length / formsPerPage);

  const navigate = useNavigate();

  const viewFormReturn = () => {
    setSelectedForm(null);
  };

  const handleFormClick = (form) => {
    setSelectedForm(form);
  };

  const truncateFormId = (id) => {
    if (id.length > 7) {
      return id.slice(0, 7) + "...";
    }
    return id;
  };

  const removeUser = () => {
    window.localStorage.clear();
    window.location.href = "/login";
  };

  const Profile = () => {};

  const [showMenu, setShowMenu] = useState(false);
  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  // useEffect(() => {
  //   removeUser();
  // }, []);

  useEffect(() => {
    getPettyCashRequests();
  }, []);

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
            <input
              className="h-8 my-2 rounded-lg placeholder:pl-1 shadow-lg border-2 border-gray-300 focus:ring-2 focus:ring-orange-600 focus:outline-none placeholder:after:pl-3"
              type="text"
              placeholder="Search forms..."
              value={searchForms}
              onChange={(e) => setSearchForms(e.target.value)}
            />
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

      {/* <input
        className="h-8 my-2 rounded-lg placeholder:pl-1 shadow-lg border-2 border-gray-300 focus:ring-2 focus:ring-orange-600 focus:outline-none placeholder:after:pl-3"
        type="text"
        placeholder="Search forms..."
        value={searchForms}
        onChange={(e) => setSearchForms(e.target.value)}
      /> */}

      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold mb-4">View Petty Cash Form</h1>
            <div>
              <button
                className="text-blue-500 hover:underline"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Previous Page
              </button>
              <button
                className="text-blue-500 hover:underline ml-2"
                onClick={goToNextPage}
                disabled={currentPage === pageNumbers}
              >
                Next Page
              </button>
            </div>
          </div>
          <ul>
            {currentForms.map((form, index) => (
              <li
                key={form._id}
                className={`p-4 mb-4 ${
                  index % 2 === 0 ? "bg-white" : "bg-orange-100"
                }`}
                // onClick={() => handleFormClick(form)}
              >
                <span>
                  <strong>{`${form.name}`}</strong>
                </span>
                <span> - APPLICATION FORM</span> <br />
                <div className="flex items-center">
                  <span className="text-gray-600">{`${form.date}`}</span>
                  <span className="ml-2 text-gray-500 text-sm truncate">{`(ID: ${truncateFormId(
                    form._id
                  )})`}</span>
                </div>
                <Link
                  to={`/show-requests/${form._id}`}
                  className="ml-2 text-blue-500 hover:underline"
                >
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {selectedForm && (
          <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <Display
              form={selectedForm}
              total={calculateTotal(selectedForm)}
              onReturn={viewFormReturn}
            />
          </div>
        )}
      </div>
    </>
  );
}

//MODIFICATIONS
//MODIFICATIONS
//MODIFICATIONS
