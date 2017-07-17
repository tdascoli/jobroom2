package ch.admin.seco.jobroom.web.rest.vm;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

import javax.validation.constraints.Size;

import ch.admin.seco.jobroom.service.dto.UserDTO;

/**
 * View Model extending the UserDTO, which is meant to be used in the user management UI.
 */
public class ManagedUserVM extends UserDTO {

    public static final int PASSWORD_MIN_LENGTH = 4;

    public static final int PASSWORD_MAX_LENGTH = 100;

    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH)
    private String password;

    public ManagedUserVM() {
        // Empty constructor needed for Jackson.
    }

    public ManagedUserVM(UUID id, String login, String password, String firstName, String lastName,
        String email, boolean activated, String imageUrl, String langKey,
        String createdBy, Instant createdDate, String lastModifiedBy, Instant lastModifiedDate,
        Set<String> authorities) {

        super(id, login, firstName, lastName, email, activated, imageUrl, langKey,
            createdBy, createdDate, lastModifiedBy, lastModifiedDate, authorities);

        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String toString() {
        return "ManagedUserVM{" +
            "} " + super.toString();
    }
}
