package app.metatron.extensions.covid.common.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN, reason = "Unauthorized")
public class UnAuthorizedException extends MetatronException{
	public UnAuthorizedException(ErrorCodes code, String message) {
		super(code, message);
	}
	
	public UnAuthorizedException(String message) {
		super(message);
	}
}