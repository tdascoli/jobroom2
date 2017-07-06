import { BaseEntity } from './../../shared';

const enum Gender {
    'MALE',
    'FEMALE'
}

export class Locality {
    constructor(public text?: string,
                public zipCode?: string,
                public communalCode?: string,
                public cantonCode?: string,
                public regionCode?: string,
                public countryCode?: string) {
    }
}

export class Job implements BaseEntity {
    constructor(public id?: number,
                public externalId?: string,
                public publicationStartDate?: any,
                public publicationEndDate?: any,
                public externalUrl?: string,
                public applicationUrl?: string,
                public registrationDate?: any,
                public cancellationDate?: any,
                public cancellationReason?: string,
                public title?: string,
                public description?: any,
                public workingTimePercentageMin?: number,
                public workingTimePercentageMax?: number,
                public startDate?: any,
                public endDate?: any,
                public startsImmediately?: boolean,
                public isPermanent?: boolean,
                public fingerPrint?: string,
                public numberOfJobs?: number,
                public isJobSharing?: boolean,
                public isSuitableForDisabled?: boolean,
                public locality?: Locality,
                public paymentMin?: number,
                public paymentMax?: number,
                public currencyCode?: string,
                public ageMin?: number,
                public ageMax?: number,
                public ageRestrictionReason?: string,
                public gender?: Gender,
                public hasPersonalVehicle?: boolean,
                public drivingLicenseLevel?: string,
                public companyName?: string,
                public companyAddressLine1?: string,
                public companyAddressLine2?: string,
                public companyZipCode?: string,
                public companyCity?: string,
                public companyCountryCode?: string,
                public companyPostboxNumber?: number,
                public companyPostboxZipCode?: string,
                public companyPostboxCity?: string,
                public companyPhone?: string,
                public companyEmail?: string,
                public companyWebsite?: string,
                public contactTitle?: string,
                public contactFirstName?: string,
                public contactLastName?: string,
                public contactPhone?: string,
                public contactEmail?: string,
                public professions?: BaseEntity[],
                public languages?: BaseEntity[]) {
        this.startsImmediately = false;
        this.isPermanent = false;
        this.isJobSharing = false;
        this.isSuitableForDisabled = false;
        this.hasPersonalVehicle = false;
    }
}
