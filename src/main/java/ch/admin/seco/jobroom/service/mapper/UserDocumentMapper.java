package ch.admin.seco.jobroom.service.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import ch.admin.seco.jobroom.domain.Authority;
import ch.admin.seco.jobroom.domain.User;
import ch.admin.seco.jobroom.domain.search.UserDocument;
import ch.admin.seco.jobroom.service.dto.UserDTO;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
    imports = { Authority.class, Collectors.class })
public interface UserDocumentMapper {

    UserDTO userDocumentToUserDto(UserDocument userDocument);

    @Mapping(target = "authorities",
        expression = "java( user.getAuthorities().stream().map(a -> a.getName()).collect(Collectors.toSet()) )")
    UserDocument userToUserDocument(User user);

    List<UserDocument> usersToUserDocuments(List<User> user);
}
