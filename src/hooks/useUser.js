import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../utils/currentUser";

export const useUser = () => {
  const [user, setUser] = useState("");

  const fetchData = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchData();
  }, []);
  return { user };
};
