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

export class Company {
    constructor(public name: string,
                public street?: string,
                public houseNumber?: string,
                public zipCode?: string,
                public city?: string,
                public countryCode?: string,
                public postboxNumber?: number,
                public postboxZipCode?: string,
                public postboxCity?: string,
                public phone?: string,
                public email?: string,
                public website?: string) {
    }
}

export class Contact {
    constructor(public title: string,
                public firstName: string,
                public lastName: string,
                public phone: string,
                public email: string) {
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
                public permanent?: boolean,
                public fingerPrint?: string,
                public numberOfJobs?: number,
                public jobSharing?: boolean,
                public suitableForDisabled?: boolean,
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
                public company?: Company,
                public contact?: Contact,
                public professions?: BaseEntity[],
                public languages?: BaseEntity[]) {
        this.startsImmediately = false;
        this.permanent = false;
        this.jobSharing = false;
        this.suitableForDisabled = false;
        this.hasPersonalVehicle = false;
    }
}
