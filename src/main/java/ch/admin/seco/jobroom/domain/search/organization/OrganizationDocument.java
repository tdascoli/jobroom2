package ch.admin.seco.jobroom.domain.search.organization;

import java.util.Set;
import java.util.UUID;

import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Mapping;
import org.springframework.data.elasticsearch.annotations.Setting;

import ch.admin.seco.jobroom.domain.enumeration.CompanyType;

@Document(indexName = "organization", type = "organization")
@Mapping(mappingPath = "config/elasticsearch/mappings/organization.json")
@Setting(settingPath = "config/elasticsearch/settings/folding-analyzer.json")
public class OrganizationDocument {

    private UUID id;

    private String name;

    private String externalId;

    private String street;

    private String zipCode;

    private String city;

    private String email;

    private String phone;

    private Boolean active;

    private CompanyType type;

    private Set<String> suggestions;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public CompanyType getType() {
        return type;
    }

    public void setType(CompanyType type) {
        this.type = type;
    }

    public Set<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(Set<String> suggestions) {
        this.suggestions = suggestions;
    }
}
