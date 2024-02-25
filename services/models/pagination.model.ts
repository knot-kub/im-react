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
    return { offset: this.page - 1, limit: this.pageSize }
  }

  public get canFetchNext(): boolean {
    if (this.totalPages === 0 && this.page === 1) {
      return true
    }
    return this.page - 1 < this.totalPages
  }
}