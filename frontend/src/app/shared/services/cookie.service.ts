import {CookieService as ngxCookieService} from 'ngx-cookie-service';
import {Injectable} from '@angular/core';
import {environment} from '@environments/environment';

@Injectable()
export class CookieService {

    private path = '/';

    constructor(
        private cookieService: ngxCookieService
    ) {
    }

    /**
     * set cookie
     * @param key
     * @param value
     * @param expires
     */
    public set(key: string, value: string, expires?: number | Date): void {
        this.cookieService.set(key, value, (expires) ? expires : null, this.path, environment.cookieDomain);
    }

    /**
     * get cookie
     * @param key
     * @returns {string}
     */
    public get(key: string): string {
        return this.cookieService.get(key);
    }

    /**
     * delete cookie
     * @param key
     */
    public delete(key: string): void {
        this.cookieService.delete(key, this.path, environment.cookieDomain);
    }

    /**
     * delete all cookie
     */
    public deleteAll(): void {
        this.cookieService.deleteAll(this.path, environment.cookieDomain);
    }


}
