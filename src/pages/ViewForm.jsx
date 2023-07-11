import { useParams } from "react-router-dom";
import Display from "../components/displaypage/display";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { calculateTotal } from "./ViewPettyCashForm";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ViewForm(props) {
  const { id } = useParams();
  const [form, setForm] = useState();
  const navigate = useNavigate();
  const fetchForm = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/get-request/${id}`
      );
      console.log(data);

      if (
        data.data &&
        data.data.accName &&
        data.data.accNumber &&
        data.data.bank
      ) {
        setForm({
          ...data.data,
          accountDetails: {
            accountName: data.data.accName,
            number: data.data.accNumber,
            bank_name: data.data.bank,
          },
        });
      } else {
        setForm({
          ...data.data,
          accountDetails: {
            accountName: data.data.accountDetails.accName,
            number: data.data.accountDetails.accNumber,
            bank_name: data.data.accountDetails.bank,
          },
        });
      }
    } catch (error) {
      console.log(error);
      alert("Failed to fetch request");
    }
  };
  useEffect(() => {
    fetchForm();
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
