package com.skt.covid.web.rest.vm;

import java.io.Serializable;

public class Result implements Serializable {

    private static final long serialVersionUID = 1L;

    /** Code */
    protected String code;

    /** Message */
    protected String message;

    /** Data */
    protected Object data;


    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

}
