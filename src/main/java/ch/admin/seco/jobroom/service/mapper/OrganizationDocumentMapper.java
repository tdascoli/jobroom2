package ch.admin.seco.jobroom.service.mapper;

import org.mapstruct.DecoratedWith;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import ch.admin.seco.jobroom.domain.Organization;
import ch.admin.seco.jobroom.domain.search.organization.OrganizationDocument;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
@DecoratedWith(AbstractOrganizationDocumentMapper.class)
public interface OrganizationDocumentMapper {

    OrganizationDocument organizationToOrganizationDocument(Organization organization);

    Organization organizationDocumentToOrganization(OrganizationDocument organizationDocument);
}
