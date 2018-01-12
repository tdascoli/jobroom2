package ch.admin.seco.jobroom.service;

import java.io.Serializable;
import java.lang.reflect.Method;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import java.util.stream.Stream;

import javax.persistence.EntityManager;

import com.codahale.metrics.annotation.Timed;
import org.hibernate.CacheMode;
import org.hibernate.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Flux;

import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StopWatch;

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

    private final EntityManager entityManager;

    private final UserRepository userRepository;

    private final UserSearchRepository userSearchRepository;

    private final OrganizationRepository organizationRepository;

    private final OrganizationSearchRepository organizationSearchRepository;

    private final ElasticsearchTemplate elasticsearchTemplate;

    private final UserDocumentMapper userDocumentMapper;

    public ElasticsearchIndexService(
            EntityManager entityManager, UserRepository userRepository,
            UserSearchRepository userSearchRepository,
            OrganizationRepository organizationRepository,
            OrganizationSearchRepository organizationSearchRepository,
            ElasticsearchTemplate elasticsearchTemplate,
            UserDocumentMapper userDocumentMapper) {
        this.entityManager = entityManager;
        this.userRepository = userRepository;
        this.userSearchRepository = userSearchRepository;
        this.organizationRepository = organizationRepository;
        this.organizationSearchRepository = organizationSearchRepository;
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.userDocumentMapper = userDocumentMapper;
    }

    @Async
    @Timed
    @Transactional(readOnly = true)
    public void reindexAll() {
        reindexForClass(UserDocument.class, userRepository, userSearchRepository, userDocumentMapper::userToUserDocument);
        reindexForClass(Organization.class, organizationRepository, organizationSearchRepository, Function.identity());

        log.info("Elasticsearch: Successfully performed reindexing");
    }

    @SuppressWarnings("unchecked")
    <JPA, ELASTIC, ID extends Serializable> void reindexForClass(
            Class<ELASTIC> documentClass,
            JpaRepository<JPA, ID> jpaRepository,
            ElasticsearchRepository<ELASTIC, ID> elasticsearchRepository,
            Function<JPA, ELASTIC> entityToDocumentMapper) {
        elasticsearchTemplate.deleteIndex(documentClass);
        elasticsearchTemplate.createIndex(documentClass);
        elasticsearchTemplate.putMapping(documentClass);

        if (jpaRepository.count() > 0) {
            reindexWithStream(jpaRepository, elasticsearchRepository,
                    entityToDocumentMapper, documentClass);
        }
        log.info("Elasticsearch: Indexed all rows for " + documentClass.getSimpleName());
    }

    private <JPA, ELASTIC, ID extends Serializable> void reindexWithStream(
            JpaRepository<JPA, ID> jpaRepository,
            ElasticsearchRepository<ELASTIC, ID> elasticsearchRepository,
            Function<JPA, ELASTIC> entityToDocumentMapper, Class entityClass) {

        try {
            disableHibernateSecondaryCache();
            Method m = jpaRepository.getClass().getMethod("streamAll");
            long total = jpaRepository.count();
            AtomicInteger index = new AtomicInteger(0);
            AtomicInteger counter = new AtomicInteger(0);
            StopWatch stopWatch = new StopWatch();
            stopWatch.start();
            Stream<JPA> stream = Stream.class.cast(m.invoke(jpaRepository));
            Flux.fromStream(stream)
                    .map(entityToDocumentMapper)
                    .buffer(100)
                    .doOnNext(elasticsearchRepository::saveAll)
                    .doOnNext(jobs ->
                            log.info("Index {} chunk #{}, {} / {}", entityClass.getSimpleName(), index.incrementAndGet(), counter.addAndGet(jobs.size()), total))
                    .doOnComplete(() -> {
                                stopWatch.stop();
                                log.info("Indexed {} of {} entities from {} in {} s", elasticsearchRepository.count(), jpaRepository.count(), entityClass.getSimpleName(), stopWatch.getTotalTimeSeconds());
                            }
                    )
                    .subscribe(jobs -> removeAllElementFromHibernatePrimaryCache());
        } catch (Exception e) {
            log.error("ReindexWithStream failed", e);
        }
    }

    private void disableHibernateSecondaryCache() {
        ((Session) entityManager.getDelegate()).setCacheMode(CacheMode.IGNORE);
    }

    private void removeAllElementFromHibernatePrimaryCache() {
        entityManager.clear();
    }
}
