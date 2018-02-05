package ch.admin.seco.jobroom.repository.search;

import java.util.UUID;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import ch.admin.seco.jobroom.domain.search.organization.OrganizationDocument;

/**
 * Spring Data Elasticsearch repository for the Organization entity.
 */
public interface OrganizationSearchRepository extends ElasticsearchRepository<OrganizationDocument, UUID> {
}
