package ch.admin.seco.jobroom.service.search;

import static org.elasticsearch.index.query.QueryBuilders.boolQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.elasticsearch.index.query.QueryBuilders.termQuery;

import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryStringQueryBuilder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.stereotype.Service;

import ch.admin.seco.jobroom.config.Constants;
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
        QueryStringQueryBuilder queryBuilder = queryStringQuery(query)
            .field("login")
            .field("firstName")
            .field("lastName")
            .field("email");

        QueryBuilder filterQuery = boolQuery()
            .mustNot(termQuery("login", Constants.ANONYMOUS_USER));

        SearchQuery searchQuery = new NativeSearchQueryBuilder()
            .withQuery(queryBuilder)
            .withFilter(filterQuery)
            .withPageable(pageable)
            .build();
        return userSearchRepository.search(searchQuery)
            .map(userDocumentMapper::userDocumentToUserDto);
    }
}
