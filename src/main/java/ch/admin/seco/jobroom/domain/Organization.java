package ch.admin.seco.jobroom.domain;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Mapping;
import org.springframework.data.elasticsearch.annotations.Setting;

import ch.admin.seco.jobroom.domain.enumeration.CompanyType;

/**
 * A Organization.
 */
@Entity
@Table(name = "organization")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "organization", type = "organization")
@Mapping(mappingPath = "config/elasticsearch/mappings/organization.json")
@Setting(settingPath = "config/elasticsearch/settings/folding-analyzer.json")
public class Organization extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private UUID id;

    @NotNull
    @Size(max = 12)
    @Column(name = "external_id", length = 12, nullable = false)
    private String externalId;

    @NotNull
    @Size(max = 150)
    @Column(name = "name", length = 150, nullable = false)
    private String name;

    @Size(max = 50)
    @Column(name = "street", length = 50)
    private String street;

    @Size(max = 4)
    @Column(name = "zip_code", length = 4)
    private String zipCode;

    @Size(max = 50)
    @Column(name = "city", length = 50)
    private String city;

    @Size(max = 50)
    @Email
    @Column(name = "email", length = 50)
    private String email;

    @Size(max = 20)
    @Column(name = "phone", length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_type")
    private CompanyType type;

    @NotNull
    @Column(name = "active", nullable = false)
    private Boolean active;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public Organization externalId(String externalId) {
        this.externalId = externalId;
        return this;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Organization name(String name) {
        this.name = name;
        return this;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public Organization street(String street) {
        this.street = street;
        return this;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public Organization zipCode(String zipCode) {
        this.zipCode = zipCode;
        return this;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Organization city(String city) {
        this.city = city;
        return this;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Organization email(String email) {
        this.email = email;
        return this;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Organization phone(String phone) {
        this.phone = phone;
        return this;
    }

    public CompanyType getType() {
        return type;
    }

    public void setType(CompanyType type) {
        this.type = type;
    }

    public Organization type(CompanyType type) {
        this.type = type;
        return this;
    }

    public Boolean isActive() {
        return active;
    }

    public Organization active(Boolean active) {
        this.active = active;
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Organization organization = (Organization) o;
        if (organization.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), organization.getId());
    }

    @Override
    public String toString() {
        return "Organization{" +
            "id=" + getId() +
            ", externalId='" + getExternalId() + "'" +
            ", name='" + getName() + "'" +
            ", street='" + getStreet() + "'" +
            ", zipCode='" + getZipCode() + "'" +
            ", city='" + getCity() + "'" +
            ", email='" + getEmail() + "'" +
            ", phone='" + getPhone() + "'" +
            ", type='" + getType() + "'" +
            ", active='" + isActive() + "'" +
            "}";
    }
}
