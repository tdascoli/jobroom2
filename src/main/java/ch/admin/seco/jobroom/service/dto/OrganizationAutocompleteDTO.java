package ch.admin.seco.jobroom.service.dto;

import java.util.List;

public class OrganizationAutocompleteDTO {
    private final List<OrganizationSuggestionDTO> organizations;

    public OrganizationAutocompleteDTO(List<OrganizationSuggestionDTO> organizations) {
        this.organizations = organizations;
    }

    public List<OrganizationSuggestionDTO> getOrganizations() {
        return organizations;
    }
}
