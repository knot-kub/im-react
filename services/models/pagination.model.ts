import { BasicParams } from '../base.service'

export class Pagination {
  public totalPages: number
  public page: number
  public pageSize: number

  constructor() {
    this.page = 1
    this.pageSize = 10
    this.totalPages = 0
  }

  public toParams(): BasicParams {
    return { offset: (this.page - 1) * this.pageSize, limit: this.pageSize }
  }
}