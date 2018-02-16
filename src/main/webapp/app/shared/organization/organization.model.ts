import { BaseEntity } from '../';

export const enum CompanyType {
    'AVG',
    'RAV'
}

export function formatOrganizationName(organization: Organization | OrganizationSuggestion): string {
    let formattedName = organization.name;
    if (organization.city || organization.zipCode) {
        formattedName = organization.city ?
            `${formattedName}, ${organization.zipCode} ${organization.city}`
            : `${formattedName}, ${organization.zipCode}`;

    }
    if (organization.street) {
        formattedName = `${formattedName}, ${organization.street}`
    }
    return formattedName;
}

export class Organization implements BaseEntity {
    constructor(public id?: number,
                public externalId?: string,
                public name?: string,
                public street?: string,
                public houseNumber?: string,
                public zipCode?: string,
                public city?: string,
                public email?: string,
                public phone?: string,
                public type?: CompanyType,
                public active?: boolean) {
        this.active = false;
    }

    toString(): string {
        return formatOrganizationName(this);
    }
}

export class OrganizationSuggestion {
    externalId: string;
    name: string;
    street: string;
    city: string;
    zipCode: string;
}

export interface OrganizationAutocomplete {
    organizations: Array<OrganizationSuggestion>;
}
