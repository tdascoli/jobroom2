package ch.admin.seco.jobroom.service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.google.common.base.Preconditions;
import org.elasticsearch.index.query.MultiMatchQueryBuilder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.SearchQuery;
import org.springframework.stereotype.Service;

import ch.admin.seco.jobroom.domain.Organization;
import ch.admin.seco.jobroom.service.dto.OrganizationAutocompleteDTO;
import ch.admin.seco.jobroom.service.dto.OrganizationSuggestionDTO;
import ch.admin.seco.jobroom.service.mapper.OrganizationMapper;

@Service
public class OrganizationSuggestionService {

    private final ElasticsearchTemplate elasticsearchTemplate;
    private final OrganizationMapper organizationMapper;
    private static final String[] suggestFields = {"name", "city", "zipCode"};

    @Autowired
    public OrganizationSuggestionService(ElasticsearchTemplate elasticsearchTemplate,
        OrganizationMapper organizationMapper) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.organizationMapper = organizationMapper;
    }

    public OrganizationAutocompleteDTO suggest(String query, int resultSize) {
        Preconditions.checkNotNull(query);
        Preconditions.checkArgument(resultSize >= 0);

        final SearchQuery searchQuery = buildSearchQuery(query, resultSize);
        final List<Organization> organizations = elasticsearchTemplate
            .queryForList(searchQuery, Organization.class);
        return extractSuggestions(organizations);
    }

    private SearchQuery buildSearchQuery(String query, int resultSize) {
        final MultiMatchQueryBuilder multiMatchQueryBuilder = new MultiMatchQueryBuilder(query, suggestFields)
            .analyzer("ascii_folding")
            .type(MultiMatchQueryBuilder.Type.CROSS_FIELDS);

        return new NativeSearchQueryBuilder()
            .withQuery(multiMatchQueryBuilder)
            .withPageable(PageRequest.of(0, resultSize))
            .build();
    }

    private OrganizationAutocompleteDTO extractSuggestions(List<Organization> organizationDocuments) {
        if (Objects.isNull(organizationDocuments)) {
            return new OrganizationAutocompleteDTO(Collections.emptyList());
        }

        final List<OrganizationSuggestionDTO> suggestions = organizationDocuments.stream()
            .map(organizationMapper::toSuggestionDto)
            .collect(Collectors.toList());
        return new OrganizationAutocompleteDTO(suggestions);
    }
}
