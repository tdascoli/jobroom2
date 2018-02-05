package ch.admin.seco.jobroom.service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import com.google.common.base.Preconditions;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.search.suggest.SuggestBuilder;
import org.elasticsearch.search.suggest.SuggestBuilders;
import org.elasticsearch.search.suggest.completion.CompletionSuggestion;
import org.elasticsearch.search.suggest.completion.CompletionSuggestionBuilder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.stereotype.Service;

import ch.admin.seco.jobroom.domain.search.organization.OrganizationDocument;
import ch.admin.seco.jobroom.service.dto.OrganizationAutocompleteDTO;
import ch.admin.seco.jobroom.service.dto.OrganizationSuggestionDTO;

@Service
public class OrganizationSuggestionService {

    private final ElasticsearchTemplate elasticsearchTemplate;

    @Autowired
    public OrganizationSuggestionService(ElasticsearchTemplate elasticsearchTemplate) {
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    public OrganizationAutocompleteDTO suggest(String prefix, int resultSize) {
        Preconditions.checkNotNull(prefix);
        Preconditions.checkArgument(resultSize >= 0);

        SuggestBuilder suggestBuilder = buildSuggestBuilder(prefix, resultSize);
        SearchResponse searchResponse = elasticsearchTemplate.suggest(suggestBuilder, OrganizationDocument.class);
        return extractSuggestions(searchResponse);
    }

    private SuggestBuilder buildSuggestBuilder(String prefix, int resultSize) {
        CompletionSuggestionBuilder nameSuggestion = SuggestBuilders.completionSuggestion("suggestions")
            .prefix(prefix)
            .size(resultSize);
        return new SuggestBuilder()
            .addSuggestion("organizations", nameSuggestion);
    }

    private OrganizationAutocompleteDTO extractSuggestions(SearchResponse searchResponse) {
        if (Objects.isNull(searchResponse.getSuggest())) {
            return new OrganizationAutocompleteDTO(Collections.emptyList());
        }

        final List<OrganizationSuggestionDTO> suggestions = searchResponse.getSuggest()
            .<CompletionSuggestion>getSuggestion("organizations")
            .getEntries().stream()
            .flatMap(item -> item.getOptions().stream())
            .map(this::convertToOrganizationSuggestion)
            .collect(Collectors.toList());
        return new OrganizationAutocompleteDTO(suggestions);
    }

    private OrganizationSuggestionDTO convertToOrganizationSuggestion(CompletionSuggestion.Entry.Option option) {
        Map<String, Object> source = option.getHit().getSourceAsMap();
        OrganizationSuggestionDTO suggestion = new OrganizationSuggestionDTO();
        suggestion.setExternalId(String.class.cast(source.get("externalId")));
        suggestion.setName(String.class.cast(source.get("name")));
        suggestion.setCity(String.class.cast(source.get("city")));
        suggestion.setStreet(String.class.cast(source.get("street")));
        suggestion.setZipCode(String.class.cast(source.get("zipCode")));
        return suggestion;
    }
}
