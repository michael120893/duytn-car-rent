export class Paging {
  items: any[];
  pagingation: Pagingnation;

  constructor(items: any[], pagingation: Pagingnation) {
    this.items = items;
    this.pagingation = pagingation;
  }
}

export interface Pagingnation {
  total: number;
  offset: number;
  limit: number;
}
