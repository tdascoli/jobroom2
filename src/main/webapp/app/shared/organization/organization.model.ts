import { BaseEntity } from '../';

export const enum CompanyType {
    'AVG',
    'RAV'
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
}

export class OrganizationSuggestion {
    externalId: string;
    name: string;
    street: string;
    city: string;
}

export interface OrganizationAutocomplete {
    organizations: Array<OrganizationSuggestion>;
}
