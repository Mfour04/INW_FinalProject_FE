import type { Axios, AxiosInstance } from "axios";
import axios from "axios";
const BASE_URL = 'https://localhost:7242/api/'

class Http {
    public instance: AxiosInstance;
    private privateInstance: AxiosInstance;
    private multiPartInstance: AxiosInstance;
    
    constructor() {
        this.instance = axios.create({
            baseURL: BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            }
        })

        this.multiPartInstance = axios.create({
            baseURL: BASE_URL,
            timeout: 10000,
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
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

        this.multiPartInstance.interceptors.request.use((config) => {
            const token = this.getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }
    private getAccessToken(): string {
        const stored = localStorage.getItem('auth');
        if (!stored) return '';

        try {
            const parsed = JSON.parse(stored);
            return parsed?.accessToken || '';
        } catch {
            return '';
        }
    }


    getPrivateInstance(): AxiosInstance {
        return this.privateInstance
    }

    getMultipartInstance(): AxiosInstance {
        return this.multiPartInstance
    }
}



const http = new Http();
export default {
  http: http.instance,
  privateHttp: http.getPrivateInstance(),
  multipartHttp: http.getMultipartInstance(),
};
