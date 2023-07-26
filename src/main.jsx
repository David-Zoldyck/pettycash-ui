import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PettyCashForm } from "./pages/PettyCashForm.jsx";
import { DisplayForms } from "./pages/DisplayForms.jsx";
import ViewSubmittedRequest from "./pages/ViewSubmittedRequest.jsx";
import CreateUser from "./pages/CreateUser.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import { AuthContext, SearchContext } from "./pages/useContext/context.js";
import { useState } from "react";
import { useAuth } from "./hooks/useAuth.js";
import { useUser } from "./hooks/useUser.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Main = () => {
  // const { user, login: setUser } = useAuth();
  const { user } = useUser();
  const [search, setSearch] = useState("");

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/home",
      children: [
        {
          path: "/home",
          element: <App />,
        },
        {
          path: "/home/create-request",
          element: <PettyCashForm />,
        },
        {
          path: "/home/show-requests",
          children: [
            {
              path: "/home/show-requests",
              element: <DisplayForms />,
            },
            {
              path: "/home/show-requests/:id",
              element: <ViewSubmittedRequest />,
            },
          ],
        },
        {
          path: "/home/login",
          element: <Login />,
        },
        {
          path: "/home/create-account",
          element: <CreateUser />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);

  return (
    <div>
      <>
        <AuthContext.Provider value={{ user }}>
          <SearchContext.Provider value={{ search, setSearch }}>
            <RouterProvider router={router} />
          </SearchContext.Provider>
        </AuthContext.Provider>
      </>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
    <ToastContainer />
  </React.StrictMode>
);
