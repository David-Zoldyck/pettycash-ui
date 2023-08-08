import { useParams } from "react-router-dom";
import Display from "../components/displaypage/display";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { calculateTotal } from "./DisplayForms";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function FetchForm(props) {
  const { id } = useParams();
  const [form, setForm] = useState();
  const navigate = useNavigate();
  const getForm = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/get-request/${id}`
      );

      setForm({
        ...data,
        accountDetails: {
          accountName: data.accountName,
          number: data.number,
          bank_name: data.bank,
        },
      });
    } catch (error) {
      console.log(error);
      alert("Failed to fetch request");
    }
  };
  useEffect(() => {
    getForm();
    return () => {};
  }, [id]);

  if (!form)
    return (
      <p>
        Unable to fetch the Petty cash request click <Link to={"/"}>here</Link>{" "}
        to return
      </p>
    );
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto">
        <Display
          form={form}
          total={calculateTotal(form)}
          onReturn={() => navigate("/show-requests")}
        />
      </div>
    </div>
  );
}
