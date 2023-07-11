import { useState, useEffect } from "react";
import Display from "../components/displaypage/display";
import { Link, useNavigate } from "react-router-dom";

export const calculateTotal = (form) => {
  return form.items.reduce((total, item) => total + item.amount, 0);
};

export function ViewPettyCashForm() {
  const [displayForms, setDisplayForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const formsPerPage = 20;
  const [searchForms, setSearchForms] = useState("");

  const indexOfLastForm = currentPage * formsPerPage;
  const indexOFirstForm = indexOfLastForm - formsPerPage + 1;
  const currentForms = displayForms
    .filter((form) =>
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

  const pageNumbers = Math.ceil(displayForms.length / formsPerPage);

  useEffect(() => {
    getPettyCashRequests();
  }, []);

  const navigate = useNavigate();

  const viewFormReturn = () => {
    setSelectedForm(null);
  };

  const getPettyCashRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/get-requests?search=${searchForms}",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const info = await response.json();
      setDisplayForms(info.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold mb-4">View Petty Cash Form</h1>
            <div>
              <input
              className=" rounded-xl"
                type="text"
                placeholder=" Search forms..."
                value={searchForms}
                onChange={(e) => setSearchForms(e.target.value)}
              />
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
