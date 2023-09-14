import { useState, useEffect, useContext } from "react";
import Display from "../components/displaypage/display";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { AuthContext, SearchContext } from "../pages/useContext/context.js";
import httpClient from "../hooks/server";
// import { BsPersonFill } from "react-icons/bs";
import { SpinnerDotted } from "spinners-react";
import NavBar from "../components/NavBar";

export const calculateTotal = (form) => {
  return (form.items ?? []).reduce((total, item) => total + item.amount, 0);
};

export function DisplayForms() {
  const [showForms, setShowForms] = useState({
    forms: [],
    currentPage: 1,
    totalPages: 1,
  });
  const [isLoading, setLoading] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  // const [currentPage, setCurrentPage] = useState(1);
  // const formsPerPage = 20;
  const { search } = useContext(SearchContext);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  // const indexOfLastForm = currentPage * formsPerPage;
  // const indexOFirstForm = indexOfLastForm - formsPerPage + 1;

  const getPettyCashRequests = async (search) => {
    setLoading(true);
    const url =
      user.role === "admin"
        ? `/get-requests?page=${currentPage}&q=${query}`
        : user.role === "superadmin"
        ? `/get-superadmin-requests?page=${currentPage}&q=${query}`
        : `/get-user-requests?page=${currentPage}&q=${query}`;

    await httpClient
      .get(url)
      .then(({ data }) => {
        setShowForms(data);
      })
      .catch((err) => {
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // const currentForms = () =>
  //   showForms.forms
  //     .filter((form) => form.name.toLowerCase().includes(search.toLowerCase()))
  //     .slice();
  // // .reverse()
  // // .slice(indexOFirstForm - 1, indexOfLastForm);

  const goToNextPage = () => {
    const prev = showForms.currentPage + 1;
    setCurrentPage(prev <= showForms.totalPages ? prev : showForms.currentPage);
  };

  const goToPreviousPage = () => {
    const prev = showForms.currentPage - 1;
    setCurrentPage(prev ? prev : showForms.currentPage);
  };

  // const pageNumbers = Math.ceil(showForms.length / formsPerPage);

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

  const handleModal = () => {
    setShowModal(true);
  };

  const removeUser = () => {
    setShowModal(false);
    window.localStorage.clear();
    window.location.href = "/login";
  };

  const Profile = () => {};

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObject.getDate().toString().padStart(2, "0");
    const hours = dateObject.getHours().toString().padStart(2, "0");
    const minutes = dateObject.getMinutes().toString().padStart(2, "0");
    const amOrPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes}${amOrPm}  ${month}-${day}-${year}`;
  };

  const [showMenu, setShowMenu] = useState(false);
  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const isAdmin = user.role === "admin";


  // useEffect(() => {
  //   removeUser();
  // }, []);

  useEffect(() => {
    getPettyCashRequests();
  }, [currentPage, user, query]);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
    }
  });

  return (
    <>
      <NavBar setQuery={setQuery} query={query} showForms={showForms} />

      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto block px-5">
          <div className="flex justify-between items-center mb-4 border p-3 rounded-l bg-white shadow-lg w-full">
            <div>
              <h1 className=" text-2xl font-medium pl-1 text-gray-800">
                View PettyCash Forms{" "}
              </h1>
            </div>

            <div className="sticky-container pr-16">
              <button
                className="text-blue-500 hover:underline disabled:pointer-events-none disabled:text-blue-300"
                disabled={isLoading}
                onClick={goToPreviousPage}
                // disabled={currentPage === 1}
              >
                Previous Page
              </button>
              <button
                className="text-blue-500 hover:underline ml-2 disabled:pointer-events-none disabled:text-blue-300"
                disabled={isLoading}
                onClick={goToNextPage}
                // disabled={currentPage === pageNumbers}
              >
                Next Page
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center w-full">
            {" "}
            {isLoading ? (
              <div className="">
                <SpinnerDotted size={100} color=" #BF4D00" />
              </div>
            ) : (
              <ul className="grid lg:grid-cols-4 gap-5  md:grid-cols-2 sm:grid-cols-1 sm:mx-2 w-full">
                {showForms.forms.map((form, index) => (
                  <li
                    key={form._id}
                    className={`p-4 bg-white hover:shadow-2xl shadow border pointer:cursor rounded-lg`}
                    // onClick={() => handleFormClick(form)}
                  >
                    <div>
                      <div>
                        <div className="flex justify-between space-x-6">
                          <div
                            className="overflow-hidden text-ellipsis"
                            title={form.name}
                          >
                            <span className="capitalize w-full whitespace-nowrap text-gray-700  font-semibold">
                              {`${form.name}`}
                            </span>
                          </div>
                          <span
                            className={`font-semibold w-1/4 text-xs ${
                              user.role === "superadmin"
                                ? form.superadminstatus === "approved"
                                  ? "text-green-500 font-semibold"
                                  : form.superadminstatus === "rejected"
                                  ? "text-red-500 font-semibold"
                                  : "text-gray-500 font-semibold"
                                : form.status === "approved"
                                ? "text-green-500 font-semibold"
                                : form.status === "rejected"
                                ? "text-red-500 font-semibold"
                                : "text-gray-500 font-semibold"
                            }`}
                          >
                            {user.role === "user" &&
                            form.superadminstatus === "approved" &&
                            form.status === "approved"
                              ? "DISBURSED"
                              : // : user.role === "user" &&
                              //   form.status === "approved" &&
                              //   form.superadminstatus === "rejected"
                              // ? "REJECTED"
                              user.role === "superadmin"
                              ? form.superadminstatus.toUpperCase()
                              : form.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            {formatDate(form.createdAt)}
                          </span>
                          <span className="ml-2 text-gray-500 text-sm truncate">{`(ID: ${truncateFormId(
                            form._id
                          )})`}</span>
                        </div>
                      </div>
                      <div></div>
                      <div
                        onClick={() => {
                          navigate(`/home/show-requests/${form._id}`);
                        }}
                        className=" text-blue-500 hover:underline hover:cursor-pointer"
                      >
                        View Details
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
