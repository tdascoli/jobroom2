package ch.admin.seco.jobroom.repository.search;

import java.util.UUID;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import ch.admin.seco.jobroom.domain.search.UserDocument;

/**
 * Spring Data Elasticsearch repository for the User entity.
 */
public interface UserSearchRepository extends ElasticsearchRepository<UserDocument, UUID> {
}
