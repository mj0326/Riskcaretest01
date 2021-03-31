import {Sort} from '@shared/value/common.value';

export class PageConstant {
  public static SIZE: number = 20;
}


export class Pageable {
  constructor(page: Pageable = null) {
    if (page) {
      this.totalElements = page.totalElements;
      this.totalPages = page.totalPages;
      this.last = page.last;
      this.numberOfElements = page.numberOfElements;
      this.first = page.first;
      this.last = page.last;
      this.size = page.size;
      this.number = page.number;
      this.sort = page.sort;
    }
  }

  public totalElements: number;

  public totalPages: number;

  // is last page
  public last: boolean;

  // is first page
  public first: boolean;

  public sort: Sort;

  // elements of current page
  public numberOfElements: number;

  // max element size in page
  public size: number = PageConstant.SIZE;

  // current page number
  public number: number;

  // page content
  public content: Object;
}
