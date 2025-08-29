import type { AxiosInstance } from "axios";
import axios from "axios";
const BASE_URL = "https://localhost:7242/api/";
const SERVER_URL =
  "https://inkwavelibrary-f3akhdacesa4hgg8.southeastasia-01.azurewebsites.net/api/";

class Http {
  public instance: AxiosInstance;
  private privateInstance: AxiosInstance;
  private multiPartInstance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: SERVER_URL,
      timeout: 1000 * 60 * 5,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.multiPartInstance = axios.create({
      baseURL: SERVER_URL,
      timeout: 1000 * 60 * 5,
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    this.privateInstance = axios.create({
      baseURL: SERVER_URL,
      timeout: 1000 * 60 * 5,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.privateInstance.interceptors.request.use((config) => {
      const token = this.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.multiPartInstance.interceptors.request.use((config) => {
      const token = this.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }
  private getAccessToken(): string {
    const stored = localStorage.getItem("auth");
    if (!stored) return "";

    try {
      const parsed = JSON.parse(stored);
      return parsed?.accessToken || "";
    } catch {
      return "";
    }
  }

  getPrivateInstance(): AxiosInstance {
    return this.privateInstance;
  }

  getMultipartInstance(): AxiosInstance {
    return this.multiPartInstance;
  }
}

const http = new Http();
export default {
  http: http.instance,
  privateHttp: http.getPrivateInstance(),
  multipartHttp: http.getMultipartInstance(),
};
