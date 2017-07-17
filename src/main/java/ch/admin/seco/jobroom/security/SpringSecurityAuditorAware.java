package ch.admin.seco.jobroom.security;

import java.util.Optional;

import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import ch.admin.seco.jobroom.config.Constants;

/**
 * Implementation of AuditorAware based on Spring Security.
 */
@Component
public class SpringSecurityAuditorAware implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        String userName = SecurityUtils.getCurrentUserLogin();
        return Optional.of(userName != null ? userName : Constants.SYSTEM_ACCOUNT);
    }
}
