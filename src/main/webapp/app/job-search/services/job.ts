import {
    CEFR_Level, Contact, Gender,
    LanguageSkill
} from '../../shared/model/shared-types';

export interface Locality {
    text?: string;
    zipCode?: string;
    communalCode?: string;
    cantonCode?: string;
    regionCode?: string;
    countryCode?: string;
}

export interface Company {
    name: string;
    street?: string;
    houseNumber?: string;
    zipCode?: string;
    city?: string;
    countryCode?: string;
    postboxNumber?: number;
    postboxZipCode?: string;
    postboxCity?: string;
    phone?: string;
    email?: string;
    website?: string;
}

export interface Occupation {
    code: number;
    classificationCode: number;
    qualificationLevel: string;
    relation: string;
    experience: string;
    educationLevel: string;
}

export interface Application {
    emailEnabled: boolean;
    hints: string;
    mailEnabled: boolean;
    phoneEnabled: boolean;
    url: string;
}

export interface Job {
    id: string;
    externalId: string;
    source: string;
    publicationStartDate?: Date;
    publicationEndDate: Date;
    externalUrl?: string;
    applicationUrl?: string;
    registrationDate?: Date;
    cancellationDate?: Date;
    cancellationReason?: string;
    title: string;
    description?: string;
    workingTimePercentageMin?: number;
    workingTimePercentageMax?: number;
    startDate?: Date;
    endDate?: Date;
    startsImmediately?: boolean;
    permanent?: boolean;
    numberOfJobs?: number;
    jobSharing?: boolean;
    suitableForDisabled?: boolean;
    locality?: Locality;
    paymentMin?: number;
    paymentMax?: number;
    currencyCode?: string;
    gender?: Gender;
    hasPersonalVehicle?: boolean;
    drivingLicenseLevel?: string;
    jobCenterCode?: string;
    company?: Company;
    contact?: Contact;
    occupation?: Occupation[];
    languages?: LanguageSkill[];
    application?: Application;
}
