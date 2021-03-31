package com.skt.covid.web.rest.errors;

public class ResourceNotFoundException extends BadRequestAlertException {

    private static final long serialVersionUID = 1L;

    public ResourceNotFoundException(String id) {
        super(ErrorConstants.RESOURCE_NOT_FOUND, "msg.comm.resource.notfound", id, "GB0001");
    }
}
