package ch.admin.seco.jobroom.service;

import static java.util.Objects.nonNull;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ch.admin.seco.jobroom.config.Constants;
import ch.admin.seco.jobroom.domain.Authority;
import ch.admin.seco.jobroom.domain.User;
import ch.admin.seco.jobroom.domain.enumeration.Gender;
import ch.admin.seco.jobroom.repository.AuthorityRepository;
import ch.admin.seco.jobroom.repository.OrganizationRepository;
import ch.admin.seco.jobroom.repository.UserRepository;
import ch.admin.seco.jobroom.repository.search.UserSearchRepository;
import ch.admin.seco.jobroom.security.AuthoritiesConstants;
import ch.admin.seco.jobroom.security.SecurityUtils;
import ch.admin.seco.jobroom.service.dto.UserDTO;
import ch.admin.seco.jobroom.service.mapper.UserDocumentMapper;
import ch.admin.seco.jobroom.service.search.UserSearchService;
import ch.admin.seco.jobroom.service.util.RandomUtil;
import ch.admin.seco.jobroom.web.rest.errors.InvalidPasswordException;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService {

    private static final String USERS_CACHE = UserRepository.USERS_BY_LOGIN_CACHE;
    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final UserSearchRepository userSearchRepository;

    private final OrganizationRepository organizationRepository;

    private final AuthorityRepository authorityRepository;

    private final CacheManager cacheManager;

    private final UserDocumentMapper userDocumentMapper;

    private final UserSearchService userSearchService;

    public UserService(UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        UserSearchRepository userSearchRepository,
        OrganizationRepository organizationRepository,
        AuthorityRepository authorityRepository,
        CacheManager cacheManager,
        UserDocumentMapper userDocumentMapper,
        UserSearchService userSearchService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userSearchRepository = userSearchRepository;
        this.organizationRepository = organizationRepository;
        this.authorityRepository = authorityRepository;
        this.cacheManager = cacheManager;
        this.userDocumentMapper = userDocumentMapper;
        this.userSearchService = userSearchService;
    }

    public Optional<User> activateRegistration(String key) {
        log.debug("Activating user for activation key {}", key);
        return userRepository.findOneByActivationKey(key)
            .map(user -> {
                // activate given user for the registration key.
                user.setActivated(true);
                user.setActivationKey(null);
                userSearchRepository.save(userDocumentMapper.userToUserDocument(user));
                cacheManager.getCache(USERS_CACHE).evict(user.getLogin());
                log.debug("Activated user: {}", user);
                return user;
            });
    }

    public Optional<User> completePasswordReset(String newPassword, String key) {
        log.debug("Reset user password for reset key {}", key);

        return userRepository.findOneByResetKey(key)
            .filter(user -> user.getResetDate().isAfter(Instant.now().minusSeconds(86400)))
            .map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetKey(null);
                user.setResetDate(null);
                cacheManager.getCache(USERS_CACHE).evict(user.getLogin());
                return user;
            });
    }

    public Optional<User> requestPasswordReset(String login) {
        return userRepository.findOneByLogin(login)
            .filter(User::getActivated)
            .map(user -> {
                user.setResetKey(RandomUtil.generateResetKey());
                user.setResetDate(Instant.now());
                cacheManager.getCache(USERS_CACHE).evict(user.getLogin());
                return user;
            });
    }

    public User registerUser(UserDTO userDTO, String password) {

        User newUser = new User();
        Authority authority = authorityRepository.findById(AuthoritiesConstants.USER).get();
        Set<Authority> authorities = new HashSet<>();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setLogin(userDTO.getLogin());
        // new user gets initially a generated password
        newUser.setPassword(encryptedPassword);
        newUser.setFirstName(userDTO.getFirstName());
        newUser.setLastName(userDTO.getLastName());
        newUser.setEmail(userDTO.getEmail());
        newUser.setPhone(userDTO.getPhone());
        newUser.setGender(userDTO.getGender());
        newUser.setImageUrl(userDTO.getImageUrl());
        newUser.setLangKey(userDTO.getLangKey());
        // new user is not active
        newUser.setActivated(false);
        // new user gets registration key
        newUser.setActivationKey(RandomUtil.generateActivationKey());
        authorities.add(authority);
        newUser.setAuthorities(authorities);
        if (nonNull(userDTO.getOrganizationId())) {
            organizationRepository.findByExternalId(userDTO.getOrganizationId())
                .ifPresent(newUser::setOrganization);
        }
        userRepository.save(newUser);
        userSearchRepository.save(userDocumentMapper.userToUserDocument(newUser));
        log.debug("Created Information for User: {}", newUser);
        return newUser;
    }

    public User createUser(UserDTO userDTO) {
        User user = new User();
        user.setLogin(userDTO.getLogin());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        user.setGender(userDTO.getGender());
        user.setImageUrl(userDTO.getImageUrl());
        if (userDTO.getLangKey() == null) {
            user.setLangKey(Constants.DEFAULT_LANGUAGE); // default language
        } else {
            user.setLangKey(userDTO.getLangKey());
        }
        if (userDTO.getAuthorities() != null) {
            Set<Authority> authorities = userDTO.getAuthorities().stream()
                .map(authorityRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());
            user.setAuthorities(authorities);
        }
        String encryptedPassword = passwordEncoder.encode(RandomUtil.generatePassword());
        user.setPassword(encryptedPassword);
        user.setResetKey(RandomUtil.generateResetKey());
        user.setResetDate(Instant.now());
        user.setActivated(true);
        if (nonNull(userDTO.getOrganizationId())) {
            organizationRepository.findByExternalId(userDTO.getOrganizationId())
                .ifPresent(user::setOrganization);
        }
        userRepository.save(user);
        userSearchRepository.save(userDocumentMapper.userToUserDocument(user));
        log.debug("Created Information for User: {}", user);
        return user;
    }

    /**
     * Update basic information (first name, last name, email, language) for the current user.
     *
     * @param firstName first name of user
     * @param lastName last name of user
     * @param email email id of user
     * @param phone phone of user
     * @param gender gender of user
     * @param langKey language key
     * @param imageUrl image URL of user
     */
    public void updateUser(String firstName, String lastName, String email, String phone, Gender gender, String langKey, String imageUrl) {
        SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .ifPresent(user -> {
                user.setFirstName(firstName);
                user.setLastName(lastName);
                user.setEmail(email);
                user.setPhone(phone);
                user.setGender(gender);
                user.setLangKey(langKey);
                user.setImageUrl(imageUrl);
                userSearchRepository.save(userDocumentMapper.userToUserDocument(user));
                cacheManager.getCache(USERS_CACHE).evict(user.getLogin());
                log.debug("Changed Information for User: {}", user);
            });
    }

    /**
     * Update all information for a specific user, and return the modified user.
     *
     * @param userDTO user to update
     * @return updated user
     */
    public Optional<UserDTO> updateUser(UserDTO userDTO) {
        return Optional.of(userRepository
            .findById(userDTO.getId()))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .map(user -> {
                user.setLogin(userDTO.getLogin());
                user.setFirstName(userDTO.getFirstName());
                user.setLastName(userDTO.getLastName());
                user.setEmail(userDTO.getEmail());
                user.setPhone(userDTO.getPhone());
                user.setGender(userDTO.getGender());
                user.setImageUrl(userDTO.getImageUrl());
                user.setActivated(userDTO.isActivated());
                user.setLangKey(userDTO.getLangKey());
                Set<Authority> managedAuthorities = user.getAuthorities();
                managedAuthorities.clear();
                managedAuthorities.addAll(
                    userDTO.getAuthorities().stream()
                        .map(authorityRepository::getOne)
                        .collect(Collectors.toSet()));
                if (nonNull(userDTO.getOrganizationId())) {
                    organizationRepository.findByExternalId(userDTO.getOrganizationId())
                        .ifPresent(user::setOrganization);
                }
                userSearchRepository.save(userDocumentMapper.userToUserDocument(user));
                cacheManager.getCache(USERS_CACHE).evict(user.getLogin());
                log.debug("Changed Information for User: {}", user);
                return user;
            })
            .map(UserDTO::new);
    }

    public void deleteUser(String login) {
        userRepository.findOneByLogin(login).ifPresent(user -> {
            userRepository.delete(user);
            userSearchRepository.delete(userDocumentMapper.userToUserDocument(user));
            cacheManager.getCache(USERS_CACHE).evict(login);
            log.debug("Deleted User: {}", user);
        });
    }

    public void changePassword(String currentClearTextPassword, String newPassword) {
        SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .ifPresent(user -> {
                String currentEncryptedPassword = user.getPassword();
                assertClearTextPasswordMatchesEncryptedPassword(currentClearTextPassword, currentEncryptedPassword);
                String encryptedPassword = passwordEncoder.encode(newPassword);
                user.setPassword(encryptedPassword);
                cacheManager.getCache(USERS_CACHE).evict(user.getLogin());
                log.debug("Changed password for User: {}", user);
            });
    }

    public void updatePassword(String login, String encryptedPassword) {
        userRepository.findOneByLogin(login).ifPresent(user -> {
            user.setPassword(encryptedPassword);
            cacheManager.getCache(USERS_CACHE).evict(user.getLogin());
            log.debug("Changed password for User: {}", user);
        });
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllManagedUsers(Pageable pageable) {
        return userRepository.findAllByLoginNot(pageable, Constants.ANONYMOUS_USER).map(UserDTO::new);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByLogin(String login) {
        return userRepository.findOneWithAuthoritiesByLogin(login);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities(UUID id) {
        return userRepository.findOneWithAuthoritiesById(id);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities() {
        return SecurityUtils.getCurrentUserLogin().flatMap(userRepository::findOneWithAuthoritiesByLogin);
    }

    /**
     * Not activated users should be automatically deleted after 3 days.
     * <p>
     * This is scheduled to get fired everyday, at 01:00 (am).
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void removeNotActivatedUsers() {
        List<User> users = userRepository.findAllByActivatedIsFalseAndCreatedDateBefore(Instant.now().minus(3, ChronoUnit.DAYS));
        for (User user : users) {
            log.debug("Deleting not activated user {}", user.getLogin());
            userRepository.delete(user);
            userSearchRepository.delete(userDocumentMapper.userToUserDocument(user));
            cacheManager.getCache(USERS_CACHE).evict(user.getLogin());
        }
    }

    /**
     * Get all authorities.
     *
     * @return a list of all the authorities
     */
    public List<String> getAuthorities() {
        return authorityRepository.findAll().stream().map(Authority::getName).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> searchByQuery(String query, Pageable pageable) {
        return userSearchService.searchByQuery(query, pageable);
    }

    private void assertClearTextPasswordMatchesEncryptedPassword(String clearTextPassword, String encryptedPassword) {
        if (!passwordEncoder.matches(clearTextPassword, encryptedPassword)) {
            throw new InvalidPasswordException();
        }
    }

}
