package ch.admin.seco.jobroom.service.dto;

import java.io.Serializable;
import java.util.UUID;

import io.github.jhipster.service.filter.BooleanFilter;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.StringFilter;

import ch.admin.seco.jobroom.domain.enumeration.CompanyType;


/**
 * Criteria class for the Organization entity. This class is used in OrganizationResource to
 * receive all the possible filtering options from the Http GET request parameters.
 * For example the following could be a valid requests:
 * <code> /organizations?id.greaterThan=5&amp;attr1.contains=something&amp;attr2.specified=false</code>
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class OrganizationCriteria implements Serializable {
    private Filter<UUID> id;

    private static final long serialVersionUID = 1L;
    private BooleanFilter active;

    private StringFilter externalId;

    private StringFilter name;

    private StringFilter street;

    private StringFilter zipCode;

    private StringFilter city;

    private StringFilter email;

    private StringFilter phone;

    private CompanyTypeFilter type;

    public Filter<UUID> getId() {
        return id;
    }

    public OrganizationCriteria() {
    }

    public void setId(Filter<UUID> id) {
        this.id = id;
    }

    public BooleanFilter getActive() {
        return active;
    }

    public StringFilter getExternalId() {
        return externalId;
    }

    public void setExternalId(StringFilter externalId) {
        this.externalId = externalId;
    }

    public StringFilter getName() {
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }

    public StringFilter getStreet() {
        return street;
    }

    public void setStreet(StringFilter street) {
        this.street = street;
    }

    public StringFilter getZipCode() {
        return zipCode;
    }

    public void setZipCode(StringFilter zipCode) {
        this.zipCode = zipCode;
    }

    public StringFilter getCity() {
        return city;
    }

    public void setCity(StringFilter city) {
        this.city = city;
    }

    public StringFilter getEmail() {
        return email;
    }

    public void setEmail(StringFilter email) {
        this.email = email;
    }

    public StringFilter getPhone() {
        return phone;
    }

    public void setPhone(StringFilter phone) {
        this.phone = phone;
    }

    public CompanyTypeFilter getType() {
        return type;
    }

    public void setType(CompanyTypeFilter type) {
        this.type = type;
    }

    public void setActive(BooleanFilter active) {
        this.active = active;
    }

    @Override
    public String toString() {
        return "OrganizationCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (externalId != null ? "externalId=" + externalId + ", " : "") +
            (name != null ? "name=" + name + ", " : "") +
            (street != null ? "street=" + street + ", " : "") +
            (zipCode != null ? "zipCode=" + zipCode + ", " : "") +
            (city != null ? "city=" + city + ", " : "") +
            (email != null ? "email=" + email + ", " : "") +
            (phone != null ? "phone=" + phone + ", " : "") +
            (type != null ? "type=" + type + ", " : "") +
            (active != null ? "active=" + active + ", " : "") +
            "}";
    }

    /*
     * Class for filtering CompanyType
     */
    public static class CompanyTypeFilter extends Filter<CompanyType> {
    }

}
