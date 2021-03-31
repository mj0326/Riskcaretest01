import {Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FileItem, FileUploader} from 'ng2-file-upload';
import {AbstractComponent} from '../../component/abstract.component';
import * as _ from 'lodash';
import {Alert} from '@shared/utils/alert-util';

@Component({
  selector: 'div[file-upload]',
  templateUrl: './file-upload.component.html'
})
export class FileUploadComponent extends AbstractComponent implements OnInit, OnDestroy {

  private uploader: FileUploader;

  @Output('change')
  private changeEvent: EventEmitter<FileItem[]> = new EventEmitter();

  @Output('originRemove')
  private originRemoveEvent: EventEmitter<FileItem> = new EventEmitter();

  @Output('find')
  public findEvent: EventEmitter<any> = new EventEmitter();

  @Input('fileMaxLength')
  public fileMaxLength: number = 1;

  @Input('accept')
  public acceptFileExt: string[] = ['.gif', '.jpg', '.jpeg', '.png', '.xlsx', '.xls', '.doc', '.docx', '.ppt', '.pptx', '.zip', '.7z', '.hwp', '.pdf'];

  /**
   * File max size ( Byte )
   *
   * @type {number}
   */
  @Input()
  public fileMaxSize: number = -1;

  constructor(protected elementRef: ElementRef,
              protected injector: Injector) {

    super(elementRef, injector);
  }

  public ngOnInit(): void {
    this.uploader = new FileUploader({});
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public setFiles(files): void {
    this.uploader.queue = files;
    this.changeEvent.emit(_.cloneDeep(this.uploader.queue));
  }

  /**
   * 파일 첨부
   *
   * @param event
   */
  public changeFile(event): void {

    event.stopPropagation();

    const files: File[] = event.target.files;
    const uploaderQueue: FileItem[] = this.uploader.queue;
    const fileList: File[] = [];

    if (files.length === 0) {
      return;
    }

    if (uploaderQueue.length + files.length > this.fileMaxLength) {

      if (this.fileMaxLength === 1) {
        Alert.error(`첨부문서는 1개만 업로드 할 수 있습니다.`);
      } else {
        // noinspection TypeScriptUnresolvedFunction
        Alert.error(`첨부문서는 최대 ?개까지 업로드 할 수 있습니다.`.replace('?', this.fileMaxLength.toString()));
      }

      return;
    }

    if (uploaderQueue.length === 0) {

      for (let index = 0; index < files.length; index++) {
        if (index < 5) {
          fileList.push(files[ index ]);
        }
      }

      if (fileList.length > 0) {

        let isMatchCount: number = 0;
        fileList
          .forEach(file => {
            this.acceptFileExt
              .forEach(accept => {
                const reg = new RegExp(`${accept}$`, 'gi');
                if (reg.test(file.name)) {
                  isMatchCount++;
                }
              });
          });

        if (isMatchCount === fileList.length) {
          if (this.fileMaxSize > -1) {
            let isAllowSize: number = 0;
            fileList
              .forEach(file => {
                if (file.size <= this.fileMaxSize) {
                  isAllowSize++;
                }
              });
            if (isAllowSize === fileList.length) {
              this.uploader.addToQueue(fileList, null, null);
            } else {
              Alert.error(`첨부문서의 용량이 초과되었습니다`);
            }
          } else {
            this.uploader.addToQueue(fileList, null, null);
          }
        } else {
          Alert.error(`첨부문서의 확장자를 다시 확인해 주세요`);
        }
      }
    } else if (uploaderQueue.length + files.length > this.fileMaxLength) {

      for (let index = 0; index < files.length; index++) {
        const queueLength: number = this.fileMaxLength - uploaderQueue.length;
        if (queueLength > 0 && queueLength >= index && index > 0) {
          fileList.push(files[ index ]);
        }
      }

      let isMatchCount: number = 0;
      fileList
        .forEach(file => {
          this.acceptFileExt
            .forEach(accept => {
              const reg = new RegExp(`${accept}$`, 'gi');
              if (reg.test(file.name)) {
                isMatchCount++;
              }
            });
        });

      if (isMatchCount === fileList.length) {
        if (this.fileMaxSize > -1) {
          let isAllowSize: number = 0;
          fileList
            .forEach(file => {
              if (file.size <= this.fileMaxSize) {
                isAllowSize++;
              }
            });
          if (isAllowSize === fileList.length) {
            if (fileList.length > 0) {
              this.uploader.addToQueue(fileList, null, null);
            }
          } else {
            Alert.error(`첨부문서의 용량이 초과되었습니다`);
          }
        } else {
          if (fileList.length > 0) {
            this.uploader.addToQueue(fileList, null, null);
          }
        }
      } else {
        Alert.error(`첨부문서의 확장자를 다시 확인해 주세요`);
      }
    } else {

      for (let index = 0; index < files.length; index++) {
        if (index < this.fileMaxLength) {
          fileList.push(files[ index ]);
        }
      }

      let isMatchCount: number = 0;
      fileList
        .forEach(file => {
          this.acceptFileExt
            .forEach(accept => {
              const reg = new RegExp(`${accept}$`, 'gi');
              if (reg.test(file.name)) {
                isMatchCount++;
              }
            });
        });

      if (isMatchCount === fileList.length) {
        if (this.fileMaxSize > -1) {
          let isAllowSize: number = 0;
          fileList
            .forEach(file => {
              if (file.size <= this.fileMaxSize) {
                isAllowSize++;
              }
            });
          if (isAllowSize === fileList.length) {
            if (fileList.length > 0) {
              this.uploader.addToQueue(fileList, null, null);
            }
          } else {
            Alert.error(`첨부문서의 용량이 초과되었습니다`);
          }
        } else {
          if (fileList.length > 0) {
            this.uploader.addToQueue(fileList, null, null);
          }
        }
      } else {
        Alert.error(`첨부문서의 확장자를 다시 확인해 주세요`);
      }
    }

    this.changeEvent.emit(_.cloneDeep(this.uploader.queue));
  }

  /**
   * 파일 삭제
   *
   * @param {number} index
   */
  public remove(index: number): void {

    if (this.uploader.queue.length === 0) {
      return;
    }

    const fileItem: FileItem = this.uploader.queue[ index ];
    if (typeof fileItem === 'undefined') {
      return;
    }

    // 서버에 저장되 있는 파일인 경우 파일 타입을 'O' Origin
    // 으로 저장해놔서 파일 업로드 패키지에서 지원하는 remove() 함수를
    // 사용할 수 없음, 그렇게 때문에 파일 업로드 큐에서 해당 인덱스의 파일을
    // 슬라이스 처리
    if (fileItem.file.type === 'O') {
      const remove = (eIndex) => eIndex !== index;
      this.uploader.queue = this.uploader.queue.filter(remove);
      this.originRemoveEvent.emit(fileItem);
    } else {
      fileItem.remove();
    }

    this.changeEvent.emit(_.cloneDeep(this.uploader.queue));
  }

  /**
   * 모든 파일 삭제
   */
  public removeAll(): void {
    this.uploader.clearQueue();
  }

  /**
   * 파일 찾기 클릭
   */
  public findClick() {
    this.findEvent.emit();
  }
}
