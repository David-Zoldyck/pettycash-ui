import { useState, useEffect } from "react";
import { Route, Routes, useNavigate, Link } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import logo from "../src/components/assets/Cyberbytelogo.jpeg";
import httpClient from "./hooks/server.js";
import { useContext } from "react";
import { AuthContext } from "./pages/useContext/context.js";
import { SpinnerDotted } from "spinners-react";

// import Modal from "react-modal";
import NavBar from "./components/NavBar.jsx";

function App() {
  // const { user } = useUser();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [isLoading, setLoading] = useState(false);

  const [showForms, setShowForms] = useState({
    forms: [],
  });
  const [pendingRequests, setPendingRequests] = useState([]);

  const navigate = useNavigate();

  const getPendingRequests = async () => {
    setLoading(true);
    try {
      const url =
        user.role === "admin"
          ? "/get-pending-requests"
          : user.role === "superadmin"
          ? "/get-pending-requests-superadmin"
          : "/get-pending-requests-user";
      const response = await httpClient.get(url);
      setPendingRequests(response.data.forms);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
    setLoading(false);
    // .finally(() => {
    //   setLoading(false);
    // });}
  };

  // const handlePrintReceipt = () => {
  //   httpClient.get(`${import.meta.env.VITE_API_BASE_URL}/print-receipt`, {});
  // };
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

  const isAdmin = user?.role === "admin";

  const isPending = stats.pendingForms > 0;

  const truncateFormId = (id) => {
    if (id.length > 7) {
      return id.slice(0, 7) + "...";
    }
    return id;
  };

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
    }
  });

  useEffect(() => {
    getPendingRequests();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
      return;
    }
  }, [user]);

  useEffect(() => {
    const url = user?.role === "admin" ? `/stats` : `/user-stats`;
    httpClient
      .get(url)
      .then(({ data }) => {
        setStats(data);
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error);
      });
  }, [user]);

  return (
    <div className="h-screen">
      <NavBar />

      <div className="flex flex-col justify-center space-y-[1px] px-10">
        <div className=" items-center">
          <h1 className="text-gray-700 text-2xl font-medium pl-24 pt-3">Dashboard</h1>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 sm:place-self-center gap-7 py-4">
          {/* <div className="grid grid-cols gap-3 py-4 divide-y divide-orange-200"> */}
          <div className="shadow cursor-pointer shadow-orange-200 hover:shadow-md hover:shadow-orange-300 rounded bg-white p-7 w-64">
            <div className="text-center text-sm font-bold text-gray-600">
              Total Reqeusts
            </div>
            <div className="flex justify-center">
              <span className="text-4xl font-bold text-orange-600">
                {stats.totalForms}
              </span>
            </div>
          </div>
          <div className="shadow cursor-pointer shadow-orange-200 hover:shadow-md hover:shadow-orange-300 rounded bg-white p-7 w-64">
            <div className="text-center text-sm font-bold text-gray-600">
              Approved Requests
            </div>
            <div className="flex justify-center">
              <span className="text-4xl font-bold text-orange-600">
                {stats.approvedForms}
              </span>
            </div>
          </div>
          <div className="shadow cursor-pointer shadow-orange-200 hover:shadow-md hover:shadow-orange-300 rounded bg-white p-7 w-64">
            <div className="text-center text-sm font-bold text-gray-600">
              Rejected Requests
            </div>
            <div className="flex justify-center">
              <span className="text-4xl font-bold text-orange-600">
                {stats.rejectedForms}
              </span>
            </div>
          </div>
          {isPending && (
            <div className="shadow cursor-pointer shadow-orange-200 hover:shadow-md hover:shadow-orange-300 rounded bg-white  p-7 w-64">
              <div className="text-center text-sm font-bold text-gray-600">
                Pending Requests
              </div>
              <div className="flex justify-center">
                <span className="text-4xl font-bold text-orange-600">
                  {stats.pendingForms}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white flex items-center justify-center">
        <div className="text-center">
          <div>
            {/* <img src={logo} alt="logo" className="mx-auto w-48" />

            <h1 className="text-5xl font-extrabold mb-4 text-orange-600">
              PettyCash App
            </h1> */}
          </div>

          <div>
            <h2 className="text-gray-700 text-2xl font-medium pb-3">
              Pending Requests
            </h2>{" "}
            {isLoading ? (
              <div className="">
                <SpinnerDotted size={100} color=" #BF4D00" />
              </div>
            ) : (
              <ul className="grid lg:grid-cols-4 gap-5  md:grid-cols-2 sm:grid-cols-1 sm:mx-2">
                {pendingRequests.slice(0, 16).map((form) => (
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
                            className={`font-semibold  w-1/4 text-xs ${
                              form.status === "approved"
                                ? "text-green-500 font-semibold"
                                : form.status === "rejected"
                                ? "text-red-500 font-semibold "
                                : "text-gray-500 font-semibold"
                            }`}
                          >
                            {form.status.toUpperCase()}
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
                        className=" text-blue-500 hover:underline hover:cursor-pointer pr-48"
                      >
                        View Details
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-end">
            <p>
              <Link
                to="/home/show-requests"
                className="text-blue-600 hover:text-orange-600 transition duration-300"
              >
                View More...
              </Link>
            </p>
          </div>

          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
