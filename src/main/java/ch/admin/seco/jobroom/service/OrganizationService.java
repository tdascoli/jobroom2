package ch.admin.seco.jobroom.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import ch.admin.seco.jobroom.service.dto.OrganizationDTO;

/**
 * Service Interface for managing Organization.
 */
public interface OrganizationService {

    /**
     * Save a organization.
     *
     * @param organizationDTO the entity to save
     * @return the persisted entity
     */
    OrganizationDTO save(OrganizationDTO organizationDTO);

    /**
     *  Get all the organizations.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<OrganizationDTO> findAll(Pageable pageable);

    /**
     *  Get the "id" organization.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    Optional<OrganizationDTO> findOne(UUID id);

    /**
     *  Delete the "id" organization.
     *
     *  @param id the id of the entity
     */
    void delete(UUID id);

    /**
     * Search for the organization corresponding to the query.
     *
     *  @param query the query of the search
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<OrganizationDTO> search(String query, Pageable pageable);

    void housekeeping();
}
