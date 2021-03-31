import {Injectable, Injector} from '@angular/core';
import {AbstractService} from '@shared/services/abstract.service';
import {Result} from "@shared/value/common.value";
import {Notice} from "@components/notice/notice.value";
import {of} from "rxjs";

@Injectable()
export class NoticeService extends AbstractService {
  // private readonly NOTICE_API_URL = `${this.API_URL}/notice`;
  constructor(protected injector: Injector) {
    super(injector);
  }

  /**
   * 공지사항 리스트 조회
   */
  public getNoticeList() {
    return of(new Result<Notice[]>({
      code: '0000',
      message: '',
      data: [
        {
          id: '0',
          title: '제목',
          content: '내용',
          isOpened: false,
          createdDt: '2021.04.30'
        },
        {
          id: '1',
          title: '제목1',
          content: '내용1',
          isOpened: false,
          createdDt: '2021.04.30'
        },
        {
          id: '2',
          title: '제목2',
          content: '내용2',
          isOpened: false,
          createdDt: '2021.04.30'
        }
      ]
    }));
    // return this.get<Result<any>>(this.NOTICE_API_URL);
  }
}
