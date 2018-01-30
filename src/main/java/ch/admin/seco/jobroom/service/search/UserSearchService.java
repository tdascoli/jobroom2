package ch.admin.seco.jobroom.service.search;

import static org.elasticsearch.index.query.QueryBuilders.boolQuery;
import static org.elasticsearch.index.query.QueryBuilders.nestedQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

import org.apache.lucene.search.join.ScoreMode;
import org.elasticsearch.index.query.Operator;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryStringQueryBuilder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.stereotype.Service;

import ch.admin.seco.jobroom.repository.search.UserSearchRepository;
import ch.admin.seco.jobroom.service.dto.UserDTO;
import ch.admin.seco.jobroom.service.mapper.UserDocumentMapper;

@Service
public class UserSearchService {

    private final UserSearchRepository userSearchRepository;

    private final UserDocumentMapper userDocumentMapper;

    @Autowired
    public UserSearchService(UserSearchRepository userSearchRepository, UserDocumentMapper userDocumentMapper) {
        this.userSearchRepository = userSearchRepository;
        this.userDocumentMapper = userDocumentMapper;
    }

    public Page<UserDTO> searchByQuery(String query, Pageable pageable) {
        QueryBuilder queryBuilder = buildQueryBuilder(query);
        SearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(queryBuilder)
            .withPageable(pageable)
            .build();

        return userSearchRepository.search(searchQuery)
            .map(userDocumentMapper::userDocumentToUserDto);
    }

    private QueryBuilder buildQueryBuilder(String query) {
        return boolQuery()
            .should(buildUserQueryBuilder(query))
            .should(buildOrganizationQueryBuilder(query));
    }

    private QueryBuilder buildUserQueryBuilder(String query) {
        return queryStringQuery(query)
            .defaultOperator(Operator.AND)
            .field("login")
            .field("firstName")
            .field("lastName")
            .field("email");
    }

    private QueryBuilder buildOrganizationQueryBuilder(String query) {
        final QueryStringQueryBuilder queryStringBuilder = queryStringQuery(query)
            .defaultOperator(Operator.AND)
            .field("organization.name")
            .field("organization.externalId");
        return nestedQuery("organization", queryStringBuilder, ScoreMode.Avg);
    }
}
