import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PettyCashForm } from "./pages/PettyCashForm.jsx";
import { ViewPettyCashForm } from "./pages/ViewPettyCashForm.jsx";
import ViewRequest from "./pages/ViewForm.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/create-request",
    element: <PettyCashForm />,
  },
  {
    path: "/view-request",
    element: <ViewRequest />,
  },
  {
    path: "/show-requests",
    element: <ViewPettyCashForm />,
  },
  {
    path: "/show-requests/:id",
    element: <ViewRequest />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
