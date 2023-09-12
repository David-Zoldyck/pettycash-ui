import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext, SearchContext } from "../pages/useContext/context";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BsPersonFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import httpClient from "../hooks/server.js";
import { FiLogOut, FiSearch } from "react-icons/fi"; //changes
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../components/assets/Cyberbytelogo2.png";

const dropdown = [
  {
    id: 1,
    name: "All",
    link: "",
  },
  {
    id: 2,
    name: "Pending",
    link: "",
  },
  {
    id: 3,
    name: "Approved",
    link: "",
  },
  {
    id: 4,
    name: "Rejected",
    link: "",
  },
];
//["All", "Pending", "Approved", "Rejected"]

const NavBar = ({ setQuery, showForms, query }) => {
  const { user } = useContext(AuthContext);
  const clickOutside = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { search, setSearch } = useContext(SearchContext);
  const [showSideBar, setShowSideBar] = useState(false);
  const [searchIcon, setSearchIcon] = useState(false);
  const [report, setReport] = useState();
  const [reportModal, setReportModal] = useState(false);
  // const [reportStatus, setReportStatus] = useState("All");
  const [showReportStatus, setShowReportStatus] = useState(false);
  const [showReportStatusDropdown, setShowReportStatusDropdown] =
    useState(false);
  const [selectedReportStatus, setSelectedReportStatus] = useState("All");
  const [searchInput, setSearchInput] = useState(false);
  // setQuery(search)
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const formsPerPage = 20;
  const location = useLocation();

  const showSearchBox = location.pathname === "/home/show-requests";

  // const indexOfLastForm = currentPage * formsPerPage;
  // const indexOFirstForm = indexOfLastForm - formsPerPage + 1;

  // const currentForms = showForms
  //   ?.filter((form) => form.name.toLowerCase().includes(search.toLowerCase()))
  //   .slice()
  //   .reverse()
  //   .slice(indexOFirstForm - 1, indexOfLastForm);

  // useEffect(() => {
  //   const quitOutside = () => {
  //     setSearchIcon(false);
  //   };
  //   clickOutside?.addEventListener("click", quitOutside);
  //   return () => {
  //     clickOutside?.removeEventListener("click", quitOutside);
  //   };
  // }, [clickOutside]);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleModal = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const toggleSearchInput = () => {
    // setSearch("")
    // setSearchInput(!searchInput);
    setSearchIcon(!searchIcon);
  };
  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const removeUser = () => {
    setShowModal(false);
    window.localStorage.clear();
    window.location.replace("/");
  };

  const handleReportStatusToggle = () => {
    setShowReportStatus(!showReportStatus);
  };

  const handleReportStatusChange = (status) => {
    setReportStatus(status);
    setShowReportStatus(false);
  };

  const receipt = (status) => {
    console.log(status);
    let url;
    if (status === "All") {
      url =
        user?.role === "admin" || "superadmin"
          ? `/report-all`
          : `/user-report-all`;
    } else {
      url =
        user?.role === "admin" || "superadmin"
          ? `report/${status?.toLowerCase()}`
          : `user-report/${status?.toLowerCase()}`;
    }

    httpClient
      .get(url)
      .then(({ data }) => {
        setReport(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleReportModal = (status) => {
    setReportModal(true);
    receipt(status);
  };

  const handleReportSelectionModal = (e) => {
    e.preventDefault();
    setShowReportStatusDropdown(!showReportStatusDropdown);
  };

  // let getPettyCashRequests;

  // if (user.role === "admin") {
  //   getPettyCashRequests = async (search) => {
  //     await httpClient
  //       .get("/get-requests", {
  //         params: {
  //           q: search,
  //         },
  //       })
  //       .then((res) => {
  //         setShowForms(res.data);
  //       })
  //       .catch((err) => {
  //         console.log("error: ", err);
  //       });
  //   };
  // } else {
  //   getPettyCashRequests = async (search) => {
  //     await httpClient
  //       .get("/get-user-requests", {
  //         params: {
  //           search,
  //         },
  //       })
  //       .then((res) => {
  //         setShowForms(res.data);
  //       })
  //       .catch((err) => {
  //         console.log("error: ", err);
  //       });
  //   };
  // }
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  // useEffect(() => {
  //   getPettyCashRequests(search);
  // }, [search]);

  return (
    <>
      <nav className="lg:w-full h-12 sticky top-0 bg-orange-600 min-w-fit sm:flex sm:flex-row sm:space-x-[250px] sm:items-center">
        {!showSideBar && (
          <div
            className="md:hidden lg:hidden sm:block py-1"
            onClick={() => {
              setShowSideBar(true);
            }}
          >
            <GiHamburgerMenu className="w-9 h-9 ml-3 fill-white pt-1 cursor-pointer" />
          </div>
        )}

        <AnimatePresence>
          {showSideBar && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: -5 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-screen w-72 bg-gray-500 shadow-lg rounded-lg"
            >
              <div className="flex flex-col h-full justify-between pb-3">
                <div className="space-y-16">
                  <div className="flex items-center justify-between p-4">
                    <div className="text-white text-xl font-semibold">Menu</div>
                    <AiOutlineClose
                      className="w-7 h-7 cursor-pointer fill-white"
                      onClick={() => setShowSideBar(false)}
                    />
                  </div>
                  <div className="flex flex-col p-4 space-y-4">
                    <div className="space-y-8">
                      <div
                        className="text-gray-300 hover:text-white cursor-pointer text-2xl border-b-2"
                        onClick={() => navigate("/home")}
                      >
                        Home
                      </div>
                      {!isAdmin && (
                        <div
                          className="text-gray-300 hover:text-white cursor-pointer text-2xl border-b-2"
                          onClick={() => navigate("/home/create-request")}
                        >
                          Submit Form
                        </div>
                      )}
                      <div
                        className="text-gray-300 hover:text-white cursor-pointer text-2xl border-b-2"
                        onClick={() => navigate("/home/show-requests")}
                      >
                        View Forms
                      </div>
                      <div
                        className="text-gray-300 hover:text-white cursor-pointer text-2xl border-b-2"
                        onClick={handleReportModal}
                      >
                        Export Report
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-white justify-start ml-3 hover:text-white cursor-pointer">
                  <FiLogOut className="w-7 h-7" />
                  <span className="font-semibold" onClick={handleModal}>
                    Logout
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="md:hidden lg:hidden sm:block ">
          <span className="flex items-center font-bold text-white font-custom">
            CyberByte
          </span>
        </div>

        <div className="h-full mx-auto px-4 w-full sm:hidden lg:block md:block relative">
          <div className="flex flex-row items-center h-full justify-between w-full">
            <div>
              <div className="flex flex-row space-x-[100px]">
                <span className="flex items-center font-bold text-white font-custom">
                  <img src={logo} alt="logo" className="mx-auto w-6 h-6" />
                  Cyberbyte
                </span>
                <div className="flex flex-row space-x-12">
                  <li className="text-white font-custom hover:bg-orange-200 hover:text-black font-semibold w-16 h-12 flex items-center px-[9px] transition duration-300 hover:cursor-pointer">
                    <div
                      onClick={() => {
                        navigate("/home");
                      }}
                    >
                      Home
                    </div>
                  </li>
                  {!isAdmin ? (
                    <li className="text-white hover:bg-orange-200 hover:text-black font-semibold font-custom w-28 h-12 flex items-center px-[9px] transition duration-300 hover:cursor-pointer">
                      <div
                        onClick={() => {
                          navigate("/home/create-request");
                        }}
                      >
                        Submit Form
                      </div>
                    </li>
                  ) : null}

                  <li className="text-white hover:bg-orange-200 hover:text-gray-900 font-semibold w-28 h-12 flex items-center px-[9px] transition duration-300 hover:cursor-pointer">
                    <div
                      onClick={() => {
                        navigate("/home/show-requests");
                      }}
                    >
                      View Forms
                    </div>
                  </li>
                </div>
              </div>
            </div>
            <div className="flex flex-row" ref={clickOutside}>
              {/* Search Box */}
              <div
                className={`flex flex-row w-full ${
                  showSearchBox ? "block " : "hidden"
                }`}
              >
                <div
                  className="flex items-center cursor-pointer"
                  onClick={toggleSearchInput}
                >
                  <FiSearch
                    className={` ${
                      searchIcon
                        ? "hidden"
                        : "w-7 h-7 text-white hover:text-gray-900"
                    }`}
                  />
                </div>
                <div
                  className={`flex flex-row space-x-12 ${
                    searchIcon
                      ? "block transition-all ease-in delay-1000 duration-1000"
                      : "hidden"
                  }`}
                >
                  <input
                    className="h-8 my-2 rounded-lg placeholder:pl-1 shadow-lg border-2 border-gray-300 focus:ring-2 focus:ring-orange-600 focus:outline-none placeholder:after:pl-3"
                    type="text"
                    placeholder="Search forms..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
              {/* User Profile */}
              <div className="flex flex-row w-full">
                <div>
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
                      <span className="text-white font-semibold hover:text-black font-custom">
                        {user?.username}
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
                        <button
                          className="flex items-center justify-betweenblock w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-200 hover:text-gray-900"
                          onClick={handleReportSelectionModal}
                          style={{ transition: "background-color 300ms" }}
                        >
                          <span>Export Report</span>
                          <div className="transform transition-transform">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-5 w-5 text-white ${
                                showReportStatusDropdown ? "rotate-180" : ""
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
                        </button>
                        {showReportStatusDropdown && (
                          <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                            <div className="py-1">
                              {dropdown.map(({ id, name, link }) => {
                                return (
                                  <div
                                    key={id}
                                    onClick={() => handleReportModal(name)}
                                  >
                                    {name}
                                  </div>
                                );
                                // <button
                                //   key={status}
                                //   className={`block w-full text-left px-4 py-2 text-sm ${
                                //     selectedReportStatus === status
                                //       ? "text-gray-900 bg-orange-200"
                                //       : "text-gray-700 hover:bg-orange-200 hover:text-gray-900"
                                //   }`}
                                //   onClick={() => handleReportStatusChange(status)}
                                // >
                                //   {status}
                                // </button>
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {showModal &&
                    createPortal(
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
                      </div>,
                      document.body
                    )}
                  {reportModal && (
                    <div
                      className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 backdrop-filter backdrop-blur-sm"
                      onClick={() => setReportModal(false)}
                    >
                      <div className="modal bg-white p-6 rounded-lg shadow-lg w-[550px] h-[600px]">
                        <iframe
                          srcDoc={report}
                          className="w-full h-full"
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
