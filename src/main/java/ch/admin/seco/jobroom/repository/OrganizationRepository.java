package ch.admin.seco.jobroom.repository;

import static org.hibernate.jpa.QueryHints.HINT_CACHE_MODE;
import static org.hibernate.jpa.QueryHints.HINT_FETCH_SIZE;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

import javax.persistence.QueryHint;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;

import ch.admin.seco.jobroom.domain.Organization;


/**
 * Spring Data JPA repository for the Organization entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrganizationRepository extends JpaRepository<Organization, UUID> {

    Optional<Organization> findByExternalId(String externalId);

    Optional<Organization> findFirstByOrderByLastModifiedDateDesc();

    @QueryHints({
        @QueryHint(name = HINT_FETCH_SIZE, value = "1000"),
        @QueryHint(name = HINT_CACHE_MODE, value = "IGNORE")})
    Stream<Organization> findByLastModifiedDateIsBefore(Instant instant);
}
