import logo from "../components/assets/Cyberbytelogo.jpeg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewPettyCashRequest() {
  const { id } = useParams();
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const fetchForm = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/get-request/${id}`
      );

      setForm(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch request");
    }
  };
  useEffect(() => {
    fetchForm();
  }, [id]);

  const formatCurrency = (value) => {
    return Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(value);
  };

  if (!form) {
    return <div>Petty Cash Request not found.</div>;
  }

  return (
    <div className="border border-1 w-2/3 mx-auto my-5 rounded">
      <header className="bg-orange-100">
        <img src={logo} alt="logo" className="mx-auto w-48" />
      </header>
      <div className="container mx-auto p-4 max-w-2xl bg-white">
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
            <strong>Date: </strong>
            {form.date}
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold mb-2">Account Details</h3>
          <p>
            <strong>Account Number: </strong>
            {form.accountDetails.number}
          </p>
          <p>
            <strong>Account Name: </strong>
            {form.accountDetails.accountName}
          </p>
          <p>
            <strong>Recipient Bank: </strong>
            {form.accountDetails.bank}
          </p>
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-2">Details/Items</h3>
          {form.items.length && (
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
                  {form.items.map((item, index) => (
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
          <strong>Signature: </strong>
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
          <div>
            <button
              onClick={() => navigate("/show-requests")}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mt-4 sm:mt-0 print:hidden"
            >
              Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
