import type { AxiosInstance } from "axios";
import axios from "axios";
const BASE_URL = 'https://localhost:7242/api/'

class Http {
    public instance: AxiosInstance;
    private privateInstance: AxiosInstance;
    
    constructor() {
        this.instance = axios.create({
            baseURL: BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        this.privateInstance = axios.create({
            baseURL: BASE_URL,
            timeout: 10000,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },

        })

        this.privateInstance.interceptors.request.use((config) => {
            const token = this.getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }
    private getAccessToken(): string {
        return localStorage.getItem('accessToken') || '';
    }

    getPrivateInstance(): AxiosInstance {
        return this.privateInstance
    }
}



const http = new Http();
export default {
  http: http.instance,
  privateHttp: http.getPrivateInstance()
};
