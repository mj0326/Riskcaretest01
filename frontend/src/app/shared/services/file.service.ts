import {Injectable, Injector} from '@angular/core';
import {AbstractService} from '@shared/services/abstract.service';

@Injectable()
export class FileService extends AbstractService {

  // private readonly FILE_API_URL = `${this.API_URL}/file`;

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
   | Constructor
   |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  public constructor(injector: Injector) {
    super(injector);
  }

  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
   | Public Functions
   |-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/

  /**
   * 파일 다운로드
   * @param fileInfo - 파일 정보
   */
  // public downloadFile(fileInfo: BoardFile): void {
  //   const anchor = document.createElement('a');
  //   document.body.appendChild(anchor);
  //
  //   const headers = new Headers();
  //   const token = this.cookieService.get(Cookie.TOKEN);
  //   headers.append('Authorization', `Bearer ${token}`);
  //
  //   fetch(`${this.FILE_API_URL}/download/${fileInfo.fileId}`, {headers})
  //     .then(response => response.blob())
  //     .then(blobby => {
  //       const objectUrl = window.URL.createObjectURL(blobby);
  //
  //       anchor.href = objectUrl;
  //       anchor.download = fileInfo.fileOriginName;
  //       anchor.click();
  //
  //       window.URL.revokeObjectURL(objectUrl);
  //
  //       anchor.remove();
  //     });
  // } // func - downloadFile

  /**
   * 이미지 경로
   * @param fileInfo - 파일 정보
   */
  // public getImageUrl(fileInfo: BoardFile): string {
  //   return `${this.FILE_API_URL}/image/${fileInfo.fileId}`;
  // } // func - getImageUrl

  /**
   * 파일 업로드
   * @param file
   * @param groupId
   */
  // public uploadFile(file, groupId?: string): Observable<Result<BoardFile>>  {
  //   const formData = new FormData();
  //   formData.append('file', file instanceof FileLikeObject ? file.rawFile : file, file.name);
  //   return this.postWithFormData(`${this.FILE_API_URL}/upload` + (groupId ? `?groupId=${groupId}` : ''), formData);
  // } // func - uploadFile

}
