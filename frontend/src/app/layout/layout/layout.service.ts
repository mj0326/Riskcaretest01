import {Injectable, Injector} from '@angular/core';
import {AbstractService} from '@shared/services/abstract.service';
import {Subject} from 'rxjs';

@Injectable()
export class  LayoutService extends AbstractService {

  constructor(protected injector: Injector) {
    super(injector);
  }

  public readonly isSubMode$ = new Subject<{ isSubMode: boolean, isSectionRight?: boolean, subTitle?: string, ldongCd?: string}>();
  public readonly isLnbOpened$ = new Subject<boolean>();
}
