package ch.admin.seco.jobroom.service;

import java.io.Serializable;
import java.lang.reflect.Method;
import java.util.List;
import java.util.function.Function;

import com.codahale.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ch.admin.seco.jobroom.domain.Organization;
import ch.admin.seco.jobroom.domain.search.UserDocument;
import ch.admin.seco.jobroom.repository.OrganizationRepository;
import ch.admin.seco.jobroom.repository.UserRepository;
import ch.admin.seco.jobroom.repository.search.OrganizationSearchRepository;
import ch.admin.seco.jobroom.repository.search.UserSearchRepository;
import ch.admin.seco.jobroom.service.mapper.UserDocumentMapper;

@Service
public class ElasticsearchIndexService {

    private final Logger log = LoggerFactory.getLogger(ElasticsearchIndexService.class);

    private final UserRepository userRepository;

    private final UserSearchRepository userSearchRepository;

    private final OrganizationRepository organizationRepository;

    private final OrganizationSearchRepository organizationSearchRepository;

    private final ElasticsearchTemplate elasticsearchTemplate;

    private final UserDocumentMapper userDocumentMapper;

    public ElasticsearchIndexService(
        UserRepository userRepository,
        UserSearchRepository userSearchRepository,
        OrganizationRepository organizationRepository,
        OrganizationSearchRepository organizationSearchRepository,
        ElasticsearchTemplate elasticsearchTemplate,
        UserDocumentMapper userDocumentMapper) {
        this.userRepository = userRepository;
        this.userSearchRepository = userSearchRepository;
        this.organizationRepository = organizationRepository;
        this.organizationSearchRepository = organizationSearchRepository;
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.userDocumentMapper = userDocumentMapper;
    }

    @Async
    @Timed
    public void reindexAll() {
        reindexForClass(UserDocument.class,
            userRepository,
            userSearchRepository,
            userDocumentMapper::usersToUserDocuments, "findAllWithEagerRelationships");
        reindexForClass(Organization.class, organizationRepository, organizationSearchRepository, Function.identity(), "findAll");

        log.info("Elasticsearch: Successfully performed reindexing");
    }

    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    <D, T, ID extends Serializable> void reindexForClass(Class<D> documentClass,
        JpaRepository<T, ID> jpaRepository,
        ElasticsearchRepository<D, ID> elasticsearchRepository,
        Function<List<T>, List<D>> entitiesToDocumentsMapper, String readMethod) {
        elasticsearchTemplate.deleteIndex(documentClass);
        elasticsearchTemplate.createIndex(documentClass);
        elasticsearchTemplate.putMapping(documentClass);

        if (jpaRepository.count() > 0) {
            try {
                Method m = jpaRepository.getClass().getMethod(readMethod);
                elasticsearchRepository.saveAll(entitiesToDocumentsMapper.apply((List<T>) m.invoke(jpaRepository)));
            } catch (Exception e) {
                elasticsearchRepository.saveAll(entitiesToDocumentsMapper.apply(jpaRepository.findAll()));
            }
        }
        log.info("Elasticsearch: Indexed all rows for " + documentClass.getSimpleName());
    }
}
