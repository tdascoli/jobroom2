package ch.admin.seco.jobroom.repository;

import static org.hibernate.jpa.QueryHints.HINT_FETCH_SIZE;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

import javax.persistence.QueryHint;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.stereotype.Repository;

import ch.admin.seco.jobroom.domain.User;

/**
 * Spring Data JPA repository for the User entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findOneByActivationKey(String activationKey);

    List<User> findAllByActivatedIsFalseAndCreatedDateBefore(Instant dateTime);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByEmailIgnoreCase(String email);

    Optional<User> findOneByLogin(String login);

    @EntityGraph(attributePaths = "authorities")
    User findOneWithAuthoritiesById(UUID id);

    @EntityGraph(attributePaths = "authorities")
    @Cacheable(cacheNames = "users")
    Optional<User> findOneWithAuthoritiesByLogin(String login);

    Page<User> findAllByLoginNot(Pageable pageable, String login);

    @EntityGraph(attributePaths = "authorities")
    @QueryHints(@QueryHint(name = HINT_FETCH_SIZE, value = "" + Integer.MAX_VALUE))
    @Query("select u from User u")
    Stream<User> streamAll();
}
