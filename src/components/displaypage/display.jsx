import { useState, useContext, useEffect } from "react";
import logo from "../assets/Cyberbytelogo.jpeg";
import {
  AuthContext,
  AuthorizerContext,
} from "../../pages/useContext/context.js";
import httpClient from "../../hooks/server";

export default function Display({ form, total, onReturn }) {
  const { authorizers } = useContext(AuthorizerContext);
  const formatCurrency = (value) => {
    return Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(value);
  };

  const { user } = useContext(AuthContext);

  if (!form) {
    return <div>No form data to display</div>;
  }

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

  return (
    <div className="border border-1 w-2/3 mx-auto my-5 rounded sm:border-none sm:w-full sm:m-0">
      <div className="container mx-auto px-4 max-w-2xl bg-white">
        <img src={logo} alt="logo" className="mx-auto w-24 h-24" />
        <h2 className="text-xl font-bold text-center mb-3">
          Your petty cash request has been submitted!
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
                      {formatCurrency(total)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
        <p>
          <strong>Authorized By: </strong>
          {/* {form.authorizedBy} */}

          {authorizers.find((item) => item._id === form.authorizedBy)?.name}
        </p>
        {/* <p>
          <strong>Approved By: </strong>
        </p> */}
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
              onClick={onReturn}
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
