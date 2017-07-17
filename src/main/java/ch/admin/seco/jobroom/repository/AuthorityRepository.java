package ch.admin.seco.jobroom.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ch.admin.seco.jobroom.domain.Authority;

/**
 * Spring Data JPA repository for the Authority entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {
}
