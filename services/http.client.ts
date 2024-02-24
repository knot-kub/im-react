import { AxiosInstance } from "axios";
import HttpManager from "./http.manager";
import { TodoService } from "./todo.service";
import { BaseService } from "./base.service";

type Services = {
  todo: TodoService
}

export default class HttpClient {

  private static _instance: HttpClient

  private axiosInstance: AxiosInstance
  public api: Services

  constructor () {
    this.axiosInstance = HttpManager.createBasicAxios('https://todo-list-api-mfchjooefq-as.a.run.app/', async () => 'token')
    this.api = this.services()
  }

  private services(): Services {
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