import { BaseEntity } from './../../shared';

const enum Gender {
    MALE, FEMALE
}

const enum LanguageLevel {
    NONE, BASIC, GOOD, VERY_GOOD
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
    constructor(public salutation: string,
                public firstName: string,
                public lastName: string,
                public phone: string,
                public email: string) {
    }
}

export class Occupation {
    constructor(public code: number,
                public firstName: number,
                public experienceInYears: number,
                public educationLevel: string) {
    }
}

export class LanguageSkill {
    constructor(public code: string,
                public spokenLevel: LanguageLevel,
                public writtenLevel: LanguageLevel,
                public mothertongue: boolean,
                public languageStayRequired: boolean) {
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
                public description?: string,
                public workingTimePercentageMin?: number,
                public workingTimePercentageMax?: number,
                public startDate?: any,
                public endDate?: any,
                public startsImmediately?: boolean,
                public permanent?: boolean,
                public numberOfJobs?: number,
                public jobSharing?: boolean,
                public suitableForDisabled?: boolean,
                public locality?: Locality,
                public paymentMin?: number,
                public paymentMax?: number,
                public currencyCode?: string,
                public gender?: Gender,
                public hasPersonalVehicle?: boolean,
                public drivingLicenseLevel?: string,
                public jobCenterCode?: string,
                public company?: Company,
                public contact?: Contact,
                public occupation?: Occupation[],
                public languages?: LanguageSkill[]) {
        this.startsImmediately = false;
        this.permanent = false;
        this.jobSharing = false;
        this.suitableForDisabled = false;
        this.hasPersonalVehicle = false;
    }
}
