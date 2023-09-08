import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
});

export const AuthorizerContext = createContext();

export const SearchContext = createContext();
