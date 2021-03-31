package com.skt.covid.web.rest.errors;

public class CovidException extends Exception{

    private static final long serialVersionUID = 1L;

    public CovidException() {
    }

    public CovidException(String message) {
        super(message);
    }
}
