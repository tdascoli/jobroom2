package ch.admin.seco.jobroom.service.mapper;

import static java.util.Collections.singletonList;
import static org.apache.commons.lang3.StringUtils.isNoneEmpty;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import ch.admin.seco.jobroom.domain.Organization;
import ch.admin.seco.jobroom.domain.search.organization.OrganizationDocument;

public abstract class AbstractOrganizationDocumentMapper implements OrganizationDocumentMapper {

    @Autowired
    @Qualifier("delegate")
    private OrganizationDocumentMapper delegate;

    @Override
    public OrganizationDocument organizationToOrganizationDocument(Organization organization) {
        final OrganizationDocument organizationDocument = delegate.organizationToOrganizationDocument(organization);
        if (organizationDocument != null) {
            organizationDocument.setSuggestions(getSuggestions(organization));
        }
        return organizationDocument;
    }

    private Set<String> getSuggestions(Organization organization) {
        if (isNoneEmpty(organization.getCity())) {
            final String nameAndCity = organization.getName().concat(" ").concat(organization.getCity());
            return new HashSet<>(Arrays.asList(organization.getName(), nameAndCity, organization.getCity()));
        } else {
            return new HashSet<>(singletonList(organization.getName()));
        }
    }
}
