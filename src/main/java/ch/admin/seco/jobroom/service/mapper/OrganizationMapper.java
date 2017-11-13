package ch.admin.seco.jobroom.service.mapper;

import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import ch.admin.seco.jobroom.domain.Organization;
import ch.admin.seco.jobroom.service.dto.OrganizationDTO;

/**
 * Mapper for the entity Organization and its DTO OrganizationDTO.
 */
@Mapper(componentModel = "spring", uses = {}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrganizationMapper extends EntityMapper<OrganizationDTO, Organization> {

    default Organization fromId(UUID id) {
        if (id == null) {
            return null;
        }
        Organization organization = new Organization();
        organization.setId(id);
        return organization;
    }
}
