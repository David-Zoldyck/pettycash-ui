import httpClient from "../hooks/server";

export const getCurrentUser = async () => {
  const res = await httpClient.get("/user");
  return res;
};
