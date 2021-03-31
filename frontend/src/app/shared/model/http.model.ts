export enum HttpStatus {
    SUCCESS = 200,
    INVALID_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    METHOD_NOT_ALLOWED = 405,
    REQUEST_TIMEOUT = 408,
    SERVER_ERROR = 500,
    GATEWAY_TIMEOUT = 504,
    FAIL = -1
}

export class HttpResult {
    public static SUCCESS = '0000';
    public static FAIL = '0001';
    public static PARTIAL_SUCCESS = '0002';        // 부분 성공
    public static SUCCESS_PASSWORD_EXPIRATION = '0003';        // 기간 만료
    public static LOGIN_LOCK_FAIL = '0004';        // 로그인 락
    public static EXPIRED_ACCESS_TOKEN = '0005';
    public static DUPLICATE_LOGIN = '0006';
}

export class HttpOptions {
    disableLoading?: boolean;
    disableAuthorization?: boolean;
}


/**
 * Result Value
 */
export class Result<T = object> {

    public code: string;

    public message: string;

    public data: T;

    constructor(result) {

        if (!result) {
            return;
        }

        this.code = result.code;
        this.message = result.message;
        this.data = result.data;
    }

    public hasCode(): boolean {
        return this.code !== undefined && this.code.length > 0;
    }

    public isFail(): boolean {
        if (!this.hasCode()) {
            throw new Error(`Code is missing. Please check it`);
        }
        return this.code === HttpResult.FAIL;
    }

    public isSuccess(): boolean {
        if (!this.hasCode()) {
            throw new Error(`Code is missing. Please check it`);
        }
        return this.code === HttpResult.SUCCESS;
    }

}
