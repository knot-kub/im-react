export class Pagination {
  public totalPages: number
  public page: number
  public pageSize: number

  constructor() {
    this.page = 1
    this.pageSize = 20
    this.totalPages = 0
  }
}