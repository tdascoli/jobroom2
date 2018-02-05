package ch.admin.seco.jobroom.service.mapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import ch.admin.seco.jobroom.domain.Authority;
import ch.admin.seco.jobroom.domain.Organization;
import ch.admin.seco.jobroom.domain.User;
import ch.admin.seco.jobroom.domain.search.user.OrganizationDocument;
import ch.admin.seco.jobroom.domain.search.user.UserDocument;
import ch.admin.seco.jobroom.service.dto.UserDTO;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
    imports = { Authority.class, Collectors.class, Optional.class })
public interface UserDocumentMapper {

    @Mapping(target = "organizationName",
        expression = "java(Optional.ofNullable(userDocument.getOrganization()).map(OrganizationDocument::getName).orElse(null))")
    UserDTO userDocumentToUserDto(UserDocument userDocument);

    @Mapping(target = "authorities",
        expression = "java( user.getAuthorities().stream().map(a -> a.getName()).collect(Collectors.toSet()) )")
    UserDocument userToUserDocument(User user);

    OrganizationDocument organizationToOrganizationDocument(Organization organization);

    List<UserDocument> usersToUserDocuments(List<User> user);
}
