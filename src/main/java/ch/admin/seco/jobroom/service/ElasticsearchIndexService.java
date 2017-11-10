package ch.admin.seco.jobroom.service;

import java.io.Serializable;
import java.lang.reflect.Method;
import java.util.List;

import com.codahale.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ch.admin.seco.jobroom.domain.User;
import ch.admin.seco.jobroom.repository.UserRepository;
import ch.admin.seco.jobroom.repository.search.UserSearchRepository;

@Service
public class ElasticsearchIndexService {

    private final Logger log = LoggerFactory.getLogger(ElasticsearchIndexService.class);

    private final UserRepository userRepository;

    private final UserSearchRepository userSearchRepository;

    private final ElasticsearchTemplate elasticsearchTemplate;

    public ElasticsearchIndexService(
        UserRepository userRepository,
        UserSearchRepository userSearchRepository,
        ElasticsearchTemplate elasticsearchTemplate) {
        this.userRepository = userRepository;
        this.userSearchRepository = userSearchRepository;
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Async
    @Timed
    public void reindexAll() {
        reindexForClass(User.class, userRepository, userSearchRepository);

        log.info("Elasticsearch: Successfully performed reindexing");
    }

    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    <T, ID extends Serializable> void reindexForClass(Class<T> entityClass, JpaRepository<T, ID> jpaRepository,
        ElasticsearchRepository<T, ID> elasticsearchRepository) {
        elasticsearchTemplate.deleteIndex(entityClass);
        elasticsearchTemplate.createIndex(entityClass);
        elasticsearchTemplate.putMapping(entityClass);
        if (jpaRepository.count() > 0) {
            try {
                Method m = jpaRepository.getClass().getMethod("findAllWithEagerRelationships");
                elasticsearchRepository.saveAll((List<T>) m.invoke(jpaRepository));
            } catch (Exception e) {
                elasticsearchRepository.saveAll(jpaRepository.findAll());
            }
        }
        log.info("Elasticsearch: Indexed all rows for " + entityClass.getSimpleName());
    }
}
