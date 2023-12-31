import logo from "../components/assets/Cyberbytelogo.jpeg";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext, AuthorizerContext } from "./useContext/context";
import { Link } from "react-router-dom";
import { BsPersonFill } from "react-icons/bs";
import NavBar from "../components/NavBar";
import { toast } from "react-toastify";
import httpClient from "../hooks/server";
import { ThumbNail } from "../components/Thumbnail";

export default function ViewSubmittedRequest() {
  const { id } = useParams();
  const [form, setForm] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectReasonInput, setShowRejectReasonInput] = useState(false);
  const [rejectModalFinal, setRejectModalFinal] = useState(false);
  const [rejectReasonFinal, setRejectReasonFinal] = useState("");
  const [showRejectReasonInputFinal, setShowRejectReasonInputFinal] =
    useState(false);
  const [superadminApproveModal, setSuperadminApproveModal] = useState(false);
  const { authorizers, setAuthorizers } = useContext(AuthorizerContext);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const getForm = async () => {
    try {
      const response = await httpClient.get(`/get-request/${id}`);

      setForm(response.data.data);
    } catch (error) {
      alert("Failed to fetch request");
    }
  };

  const getAuthorizers = async () => {
    try {
      const { data } = await httpClient.get("/get-authorizers");
      setAuthorizers(data?.authorizers);
    } catch (error) {
      console.error("Error fetching authorizers:", error);
    }
  };

  useEffect(() => {
    getAuthorizers();
  }, []);

  // console.log(authorizers?.find(({ _id }) => _id === form.authorizedBy).name);
  //console.log(authorizers.find((item) => item._id === form.authorizedBy)?.name);

  if (form.status === "rejected") {
  }
  const formatCurrency = (value) => {
    return Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(value);
  };

  if (!form) {
    return <div>Petty Cash Request not found.</div>;
  }

  const removeUser = () => {
    setShowModal(false);
    window.localStorage.clear();
    window.location.href = "/login";
  };

  const isAdmin = user.role === "admin";

  const isSuperAdmin = user.role === "superadmin";
  const isSuperAdminStatusPending =
    isSuperAdmin && form.superadminstatus === "pending";
  const handleApprove = async () => {
    const token = localStorage.getItem("user");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/request/${id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === "approved") {
        alert("Status has been updated to 'approved'");
      }
      toast.success("Request has been approved", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setForm((prevForm) => ({ ...prevForm, status: "approved" }));
      //maybe set message later
    } catch (error) {
      alert("Failed to approve the request.");
    }
  };

  const handleReject = async () => {
    const token = localStorage.getItem("user");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/request/${id}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rejectReason }),
        }
      );
      if (res.status === "rejected") {
        alert("Status has been updated to 'rejected'");
      }

      toast.error("Request has been rejected", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setForm((prevForm) => ({
        ...prevForm,
        status: "rejected",
        rejectReason,
      }));
      //maybe set message later

      setShowRejectReasonInput(false);
      setRejectReason("");
      setRejectModal(false);
    } catch (error) {
      alert("Failed to reject the request.");
    }
  };

  const handleApproveFinal = async () => {
    const token = localStorage.getItem("user");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/request/${id}/approve-final`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.superadminstatus === "approved") {
        alert("Status has been updated to 'approved'");
      }
      toast.success("Request has been approved", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setForm((prevForm) => ({ ...prevForm, superadminstatus: "approved" }));
      //maybe set message later
    } catch (error) {
      alert("Failed to approve the request.");
    }
  };

  const handleRejectFinal = async () => {
    const token = localStorage.getItem("user");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/request/${id}/reject-final`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rejectReasonFinal }),
        }
      );
      if (res.superadminstatus === "rejected") {
        alert("Status has been updated to 'rejected'");
      }

      toast.error("Request has been rejected", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setForm((prevForm) => ({
        ...prevForm,
        superadminstatus: "rejected",
        rejectReasonFinal,
      }));
      //maybe set message later

      setShowRejectReasonInput(false);
      setRejectReason("");
      setRejectModal(false);
    } catch (error) {
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

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
    }
  });
  return (
    <>
      <NavBar />
      <div className="border border-1 w-2/3 mx-auto my-5 rounded sm:border-none sm:w-full sm:m-0">
        <div className="container mx-auto px-4 max-w-2xl bg-white">
          <img src={logo} alt="logo" className="mx-auto w-24 h-24" />
          <p>{form.id}</p>
          <h2 className="text-xl font-bold text-center mb-3">
            {/* todo: personalize this */}
            Petty Cash Request
          </h2>
          <div className="mb-5">
            <h3 className="text-base font-bold mb-2">Personal Information</h3>
            <p>
              <strong>Name: </strong> {form.name}
            </p>
            <p>
              <strong>Date of Expense: </strong>
              {form.date}
            </p>
          </div>
          <div className="mb-8">
            <h3 className="text-base font-bold mb-2">
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
            {form.imageUrl && <ThumbNail imageUrl={form.imageUrl} />}
          </div>
          <div className="mb-3">
            <h3 className="text-base font-bold mb-1">Details/Items</h3>
            {form.items?.length && (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="border">
                      <th className="px-4 py-1 border">S/N</th>
                      <th className="px-4 py-1 border">Details/Item Name</th>
                      <th className="px-4 py-1 border">Price</th>
                      <th className="px-4 py-1 border">Quantity</th>
                      <th className="px-4 py-1 border">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((item, index) => (
                      <tr onDoubleClick={() => removeItem(index)} key={index}>
                        <td className="px-4 py-1 border"> {index + 1}</td>
                        <td className="px-4 py-1 border"> {item.name}</td>
                        <td className="px-4 py-1 border">
                          {" "}
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-4 py-1 border"> {item.quantity}</td>
                        <td className="px-4 py-1 border">
                          {" "}
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="px-4 py-1 border"></td>
                      <td className="px-4 py-1 border">Total</td>
                      <td className="px-4 py-1 border"></td>
                      <td className="px-4 py-1 border"></td>
                      <td className="px-4 py-1 border">
                        {formatCurrency(form.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex space-x-44">
                <p>
                  <strong>Authorized By: </strong>
                  {/* {form.authorizedBy} */}

                  {
                    authorizers.find((item) => item._id === form.authorizedBy)
                      ?.name
                  }
                </p>
                {/* <p>
                  <strong>Approved By: </strong>
                </p> */}
              </div>
              {form.status === "rejected" && form.rejectReason && (
                <div className="mb-3">
                  <h3 className="text-base font-bold mb-1">Rejection Reason</h3>
                  <p>{form.rejectReason}</p>
                </div>
              )}
              {form.superadminstatus === "rejected" &&
                form.rejectReasonFinal && (
                  <div className="mb-3">
                    <h3 className="text-base font-bold mb-1">
                      Rejection Reason (Final)
                    </h3>
                    <p>{form.rejectReasonFinal}</p>
                  </div>
                )}

              {/* Approve Modal */}
              {approveModal && (
                <div
                  className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 backdrop-filter backdrop-blur-sm"
                  onClick={() => setApproveModal(false)}
                >
                  <div className="modal bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">
                      Are you sure you want to approve the request?
                    </h2>
                    <div className="flex space-x-4">
                      <button
                        className="confirm-btn flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                        onClick={() => {
                          handleApprove();
                          setApproveModal(false);
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        className="confirm-btn flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                        onClick={() => setApproveModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reject Modal */}
            {/* <>
              {showRejectReasonInput && (
                
              )}
            </> */}

            {rejectModal && (
              <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 backdrop-filter backdrop-blur-sm">
                <div className="modal border-black border-2 h-96 w-96 bg-white p-6 rounded-lg shadow-lg">
                  <div className="mb-4 h-2/3">
                    <label className="block font-semibold">
                      Reason for Rejection:
                    </label>
                    <textarea
                      placeholder="Type in here..."
                      className="w-full border rounded p-2 h-full"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="flex space-x-4 mt-16">
                    <button
                      className="confirm-btn flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                      onClick={() => {
                        if (showRejectReasonInput) {
                          setRejectReason("");
                        }
                        setRejectModal(false);
                        handleReject();
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      className="confirm-btn flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                      onClick={() => {
                        if (showRejectReasonInput) {
                          setRejectReason("");
                        }
                        setRejectModal(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                    onClick={() => setApproveModal(true)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mt-4 sm:mt-0 print:hidden"
                  >
                    Approve
                  </button>
                )}
                {form.status === "pending" && user.role === "admin" && (
                  <button
                    onClick={() => setRejectModal(true)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mt-4 sm:mt-0 print:hidden"
                  >
                    Reject
                  </button>
                )}
              </div>
              <div className="flex space-x-4">
                {isSuperAdminStatusPending && (
                  <button
                    onClick={() => setSuperadminApproveModal(true)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mt-4 sm:mt-0 print:hidden"
                  >
                    Approve (Superadmin)
                  </button>
                )}
                {isSuperAdminStatusPending && (
                  <button
                    onClick={() => setRejectModalFinal(true)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mt-4 sm:mt-0 print:hidden"
                  >
                    Reject (Superadmin)
                  </button>
                )}
              </div>
              {superadminApproveModal && (
                <div
                  className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 backdrop-filter backdrop-blur-sm"
                  onClick={() => setSuperadminApproveModal(false)}
                >
                  <div className="modal bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">
                      Are you sure you want to approve the request (Superadmin)?
                    </h2>
                    <div className="flex space-x-4">
                      <button
                        className="confirm-btn flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                        onClick={() => {
                          handleApproveFinal();
                          setSuperadminApproveModal(false);
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        className="confirm-btn flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                        onClick={() => setSuperadminApproveModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {rejectModalFinal && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-opacity-50 backdrop-filter backdrop-blur-sm">
                  <div className="modal border-black border-2 h-96 w-96 bg-white p-6 rounded-lg shadow-lg">
                    <div className="mb-4 h-2/3">
                      <label className="block font-semibold">
                        Reason for Rejection (Final):
                      </label>
                      <textarea
                        placeholder="Type in here..."
                        className="w-full border rounded p-2 h-full"
                        value={rejectReasonFinal}
                        onChange={(e) => setRejectReasonFinal(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="flex space-x-4 mt-16">
                      <button
                        className="confirm-btn flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                        onClick={() => {
                          if (showRejectReasonInputFinal) {
                            setRejectReasonFinal("");
                          }
                          setRejectModalFinal(false);
                          handleRejectFinal();
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        className="confirm-btn flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                        onClick={() => {
                          if (showRejectReasonInputFinal) {
                            setRejectReasonFinal("");
                          }
                          setRejectModalFinal(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
