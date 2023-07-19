import { useContext } from "react";
import { AuthContext } from "../pages/useContext/context.js";
import { useLocalStorage } from "./useLocalStorage";

export const useUser = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setItem } = useLocalStorage();

  const addUser = (user) => {
    setUser(user);
    setItem("user", JSON.stringify(user));
    console.log(user);
  };

  const removeUser = () => {
    window.localStorage.clear();
    window.location.href = "/login";
  };

  return { user, addUser, removeUser };
};
