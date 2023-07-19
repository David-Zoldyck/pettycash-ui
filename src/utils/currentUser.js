// const currentUser = async (token) => {
//   const response = await fetch("http://localhost:3000/user", {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return response.json();
// };

// export default currentUser;

import httpClient from "../hooks/server";

export const getCurrentUser = async () => {
  const res = await httpClient.get("/user");
  return res;
};
