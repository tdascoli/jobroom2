package ch.admin.seco.jobroom.service.impl;

import static java.util.Objects.isNull;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Stream;

import javax.persistence.EntityManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Flux;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import ch.admin.seco.jobroom.domain.Organization;
import ch.admin.seco.jobroom.repository.OrganizationRepository;
import ch.admin.seco.jobroom.repository.search.OrganizationSearchRepository;
import ch.admin.seco.jobroom.service.OrganizationService;
import ch.admin.seco.jobroom.service.OrganizationSuggestionService;
import ch.admin.seco.jobroom.service.dto.OrganizationAutocompleteDTO;
import ch.admin.seco.jobroom.service.dto.OrganizationDTO;
import ch.admin.seco.jobroom.service.mapper.OrganizationMapper;

/**
 * Service Implementation for managing Organization.
 */
@Service
@Transactional
public class OrganizationServiceImpl implements OrganizationService {

    private final Logger log = LoggerFactory.getLogger(OrganizationServiceImpl.class);

    private final OrganizationRepository organizationRepository;

    private final OrganizationMapper organizationMapper;

    private final OrganizationSearchRepository organizationSearchRepository;

    private final TransactionTemplate transactionTemplate;

    private final EntityManager entityManager;

    private final OrganizationSuggestionService organizationSuggestionService;

    public OrganizationServiceImpl(OrganizationRepository organizationRepository,
            OrganizationMapper organizationMapper,
            OrganizationSearchRepository organizationSearchRepository,
            TransactionTemplate transactionTemplate,
            EntityManager entityManager,
            OrganizationSuggestionService organizationSuggestionService) {
        this.organizationRepository = organizationRepository;
        this.organizationMapper = organizationMapper;
        this.organizationSearchRepository = organizationSearchRepository;
        this.transactionTemplate = transactionTemplate;
        this.entityManager = entityManager;
        this.organizationSuggestionService = organizationSuggestionService;
    }

    /**
     * Save a organization.
     *
     * @param organizationDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public OrganizationDTO save(OrganizationDTO organizationDTO) {
        log.debug("Request to save Organization : {}", organizationDTO);

        Organization organization = organizationMapper.toEntity(organizationDTO);
        if (isNull(organization.getId())) {
            organizationRepository.findByExternalId(organization.getExternalId())
                    .ifPresent(item ->
                            organization.setId(item.getId())
                    );
        }

        Organization organizationSaved = organizationRepository.save(organization);
        OrganizationDTO result = organizationMapper.toDto(organizationSaved);
        organizationSearchRepository.save(organizationSaved);
        return result;
    }

    /**
     *  Get all the organizations.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<OrganizationDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Organizations");
        return organizationRepository.findAll(pageable)
                .map(organizationMapper::toDto);
    }

    /**
     *  Get one organization by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<OrganizationDTO> findOne(UUID id) {
        log.debug("Request to get Organization : {}", id);
        return organizationRepository.findById(id)
                .map(organizationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrganizationDTO> findOneByExternalId(String externalId) {
        log.debug("Request to get Organization by externalId : {}", externalId);
        return organizationRepository.findByExternalId(externalId)
                .map(organizationMapper::toDto);
    }

    /**
     *  Delete the  organization by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(UUID id) {
        log.debug("Request to delete Organization : {}", id);
        organizationRepository.deleteById(id);
        organizationSearchRepository.deleteById(id);
    }

    /**
     * Search for the organization corresponding to the query.
     *
     *  @param query the query of the search
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<OrganizationDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Organizations for query {}", query);
        Page<Organization> result = organizationSearchRepository.search(queryStringQuery(query), pageable);
        return result.map(organizationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public OrganizationAutocompleteDTO suggest(String prefix, int resultSize) {
        return organizationSuggestionService.suggest(prefix, resultSize);
    }

    @Async
    @Transactional
    public void housekeeping(LocalDateTime beforeDateTime) {
        log.info("Start housekeeping");

        deactivate(
                organizationRepository
                        .findByLastModifiedDateIsBefore(toInstant(beforeDateTime))
        );

        log.info("Housekeeping finished. Organization counts: {} / {}", organizationRepository.count(), organizationSearchRepository.count());
    }

    private Instant toInstant(LocalDateTime localDateTime) {
        return localDateTime.atZone(ZoneId.systemDefault()).toInstant();
    }

    private void deactivate(Stream<Organization> jobs) {
        AtomicInteger counter = new AtomicInteger(0);
        Flux.fromStream(jobs)
                .buffer(100)
                .doOnSubscribe(subscription -> log.info("Start deactive organizations"))
                .doFinally(signalType -> log.info("End deactive organizations. {} organizations deactived", counter.get()))
                .doOnError(exception -> log.error("Failed to delete organizations", exception))
                .doOnNext(organizationRepository::saveAll)
                .doOnNext(organizationSearchRepository::saveAll)
                .doOnNext(organizationsPartition -> entityManager.clear())
                .doOnNext(organizationsPartition -> counter.addAndGet(organizationsPartition.size()))
                .subscribe(organizationsPartition -> log.debug("{} organizations deactivated from database and elasticsearch", counter.get()));
    }
}
