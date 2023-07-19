import axios from "axios";
export const BASE_URL = "http://localhost:3000";
export const httpClient = createClient();

function createClient() {
  const client = axios.create({
    baseURL: BASE_URL,
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
