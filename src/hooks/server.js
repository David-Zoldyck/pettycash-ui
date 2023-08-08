import axios from "axios";
export const httpClient = createClient();

function createClient() {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });
  client.interceptors.request.use(handleBearerTokenInterceptor);
  return client;
}

function handleBearerTokenInterceptor(config) {
  const token = localStorage.getItem("user");
  if (token?.length) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
}
export default httpClient;
