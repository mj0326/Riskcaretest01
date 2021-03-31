import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {User} from '@shared/model/user.model';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    public user: User = null;
    public user$: ReplaySubject<User> = new ReplaySubject<User>();

    constructor() {

    }

    public getUser(): Observable<User> {
        return this.user$.asObservable();
    }

    public setUser(user: User): void {
        this.user = user;
        this.user$.next(user);
    }


}
