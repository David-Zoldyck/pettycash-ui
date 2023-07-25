import { useState, useEffect, useContext } from "react";
import Display from "../components/displaypage/display";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { AuthContext, SearchContext } from "../pages/useContext/context.js";
import httpClient from "../hooks/server";
// import { BsPersonFill } from "react-icons/bs";
import NavBar from "../components/NavBar";

export const calculateTotal = (form) => {
  return (form.items ?? []).reduce((total, item) => total + item.amount, 0);
};

export function DisplayForms() {
  const [showForms, setShowForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const formsPerPage = 20;
  const { search } = useContext(SearchContext);
  // const [searchForms, setSearchForms] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);

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
          setShowForms(res.data);
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    };
  }

  const currentForms = showForms
    ?.filter((form) => form.name.toLowerCase().includes(search.toLowerCase()))
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

  const handleModal = () => {
    setShowModal(true);
  };

  const removeUser = () => {
    setShowModal(false);
    window.localStorage.clear();
    window.location.href = "/login";
  };

  const Profile = () => {};

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
  }, []);

  return (
    <>
      <NavBar />

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
            <div className="sticky-container">
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
          <ul className="grid lg:grid-cols-3 gap-8  md:grid-cols-2 sm:grid-cols-1 sm:mx-12">
            {currentForms.map((form, index) => (
              <li
                key={form._id}
                className={`p-4 mb-4 ${
                  index % 2 === 0 ? "bg-white" : "bg-orange-100"
                } shadow-2xl rounded-lg`}
                // onClick={() => handleFormClick(form)}
              >
                <div>
                  <div>
                    <div className="flex space-x-6">
                      <div>
                        <span>
                          <strong className="capitalizes">{`${form.name}`}</strong>
                        </span>
                        <span> - APPLICATION FORM</span> <br />
                      </div>
                      <span
                        className={`font-bold ${
                          form.status === "approved"
                            ? "text-green-500 font-semibold capitalize"
                            : form.status === "rejected"
                            ? "text-red-500 font-semibold capitalize"
                            : "text-gray-500 font-semibold capitalize"
                        }`}
                      >
                        {form.status}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-gray-600">{`${form.date}`}</span>
                      <span className="ml-2 text-gray-500 text-sm truncate">{`(ID: ${truncateFormId(
                        form._id
                      )})`}</span>
                    </div>
                  </div>
                  <div></div>
                  <Link
                    to={`/show-requests/${form._id}`}
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
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
