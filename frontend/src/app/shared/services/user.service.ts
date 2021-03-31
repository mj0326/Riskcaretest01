import {Injectable, Injector, OnInit} from '@angular/core';
import {AbstractService} from '@shared/services/abstract.service';
import {Observable} from 'rxjs';

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class UserService extends AbstractService implements OnInit {

    private readonly USER_API_URL = `${this.API_URL}/user`;

    constructor(protected injector: Injector) {
        super(injector);
    }

    // tslint:disable-next-line:contextual-lifecycle
    public ngOnInit(): void {
    }


    public getUser(): Observable<any> {
        return this.get(`${this.USER_API_URL}/info`);
    }

}
