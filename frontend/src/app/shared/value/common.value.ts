import {Pageable, PageConstant} from '@shared/component/pagination/pagination.value';
import * as _ from 'lodash';
import {HttpResult} from '@shared/model/http.model';

/**
 * 공통 Value
 */
export class AbstractValue {

  // 작성자
  public createdBy: string;

  // 작성시간
  public createdDate: string;

  // 수정자
  public updatedBy: string;

  // 수정시간
  public updatedDate: string;

}

export class LnbMenuType {
  public lnbType: string;
  public selectedMenu: string;
}

export class PageParameter {
  public page: number = 0;
  public size: number = PageConstant.SIZE;
  public sort: string;
}

/**
 * Result
 */
export class Result<T = object> {

  // Code
  public code: string;

  // 메시지
  public message: string;

  // 데이터
  public data: T;

  constructor(result) {

    if (!result) {
      return;
    }

    this.code = result.code;
    this.message = result.message;
    this.data = result.data;
  }

  public hasCode() {
    return _.negate(_.isNil)(this.code);
  }

  public isFail() {

    if (!this.hasCode()) {
      throw new Error(`Code is missing. Please check it`);
    }

    return this.code === HttpResult.FAIL;
  }

  public isSuccess() {

    if (!this.hasCode()) {
      throw new Error(`Code is missing. Please check it`);
    }

    return this.code === HttpResult.SUCCESS;
  }

}

interface PageInterface<T> {
  pageable: Pageable;
  content: T;
}

export class PageableResult<T = object> extends Result {
  public data: PageInterface<T>;
}

/**
 * Sort
 */
export class Sort {

  public direction: string;

  // Order by
  public property: string;

  public ignoreCase: boolean;

  public nullHandling: string;

  public ascending: boolean;
}

export enum Direction {
  DESC = 'DESC',
  ASC = 'ASC'
}

export enum Y_N {
  Y = 'Y',
  N = 'N'
}
