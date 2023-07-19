import { useState, useEffect, useContext } from "react";
import Display from "../components/displaypage/display";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { AuthContext } from "../pages/useContext/context.js";

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
  const getPettyCashRequests = async (search) => {
    try {
      const response = await axios.get("http://localhost:3000/get-requests", {
        search: search,
      });
      setShowForms(response?.data ?? []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
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

  // useEffect(() => {
  //   removeUser();
  // }, []);

  useEffect(() => {
    getPettyCashRequests();
  }, []);

  return (
    <>
      <nav className="bg-orange-600 h-12 sticky top-0">
        <div className="container h-full mx-auto px-4 flex flex-row justify-around">
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
          <input
            className="h-8 my-2 rounded-lg placeholder:pl-1 shadow-lg border-2 border-gray-300 focus:ring-2 focus:ring-orange-600 focus:outline-none placeholder:after:pl-3"
            type="text"
            placeholder="Search forms..."
            value={searchForms}
            onChange={(e) => setSearchForms(e.target.value)}
          />
          <div
            className="flex flex-row items-center cursor-pointer w-20 p-3 hover:bg-orange-200"
            onClick={removeUser}
          >
            {/* <span className="flex text-center font-bold text-white hover:text-black">
              Logout
            </span> */}
            <div className="h-1">
              {user?.name ? (
                <div>
                  <span >Welcome, {user?.name}!</span>
                </div>
              ) : (
                <div>
                  <span>Log in to view your profile</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
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
