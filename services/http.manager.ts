import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export default class HttpManager {
  static createBasicAxios(url: string, tokenHandler: () => Promise<string>): AxiosInstance {
    const _axiosInstance = axios.create({
      baseURL: url,
      timeout: 20 * 1000,
    });
    _axiosInstance.interceptors.request.use(this.basicRequestInterceptor);
    _axiosInstance.interceptors.request.use((axiosRequestConfig: InternalAxiosRequestConfig) =>
      this.insertTokenRequestInterceptor(axiosRequestConfig, tokenHandler)
    );
    return _axiosInstance;
  }

  static basicRequestInterceptor(axiosRequestConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    axiosRequestConfig.headers["Accept"] = "application/json";
    return axiosRequestConfig;
  }

  static async insertTokenRequestInterceptor(axiosRequestConfig: InternalAxiosRequestConfig, tokenHandler: () => Promise<string>): Promise<InternalAxiosRequestConfig> {
    const token = await tokenHandler();
    axiosRequestConfig.headers["Authorization"] = `Bearer ${token}`;
    return axiosRequestConfig;
  }
}