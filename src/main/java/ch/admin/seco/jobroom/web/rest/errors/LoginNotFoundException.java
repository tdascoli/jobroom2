package ch.admin.seco.jobroom.web.rest.errors;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class LoginNotFoundException extends AbstractThrowableProblem {

    public LoginNotFoundException() {
        super(ErrorConstants.LOGIN_NOT_FOUND_TYPE, "Login not registered", Status.BAD_REQUEST);
    }
}
