import { AxiosInstance } from "axios";
import HttpManager from "./http.manager";
import { TodoService } from "./todo.service";

export default class HttpClient {

  private static _instance: HttpClient

  private axiosInstance: AxiosInstance
  public api: ReturnType<typeof this.services>

  constructor () {
    this.axiosInstance = HttpManager.createBasicAxios('a', async () => '')
    this.api = this.services()
  }

  private services(): Record<string, any> {
    return {
      todo: new TodoService(this.axiosInstance)
    }
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new HttpClient();
    }
    return this._instance.api;
  }

}