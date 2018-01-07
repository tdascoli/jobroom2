package ch.admin.seco.jobroom.service.dto;


import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Email;

import ch.admin.seco.jobroom.domain.enumeration.CompanyType;

/**
 * A DTO for the Organization entity.
 */
public class OrganizationDTO implements Serializable {

    private UUID id;

    @NotNull
    @Size(max = 12)
    private String externalId;

    @NotNull
    @Size(max = 150)
    private String name;

    @Size(max = 50)
    private String street;

    @Size(max = 4)
    private String zipCode;

    @Size(max = 50)
    private String city;

    @Size(max = 50)
    @Email
    private String email;

    @Size(max = 20)
    private String phone;

    private CompanyType type;

    @NotNull
    private Boolean active;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public CompanyType getType() {
        return type;
    }

    public void setType(CompanyType type) {
        this.type = type;
    }

    public Boolean isActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        OrganizationDTO organizationDTO = (OrganizationDTO) o;
        if (organizationDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), organizationDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "OrganizationDTO{" +
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
