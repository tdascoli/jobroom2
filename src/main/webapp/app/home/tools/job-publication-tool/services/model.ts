/*
    https://www.job-room.ch/api/staging/docs/index.html#_request_fields
 */

export interface Contact {
    title: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
}

export interface Postbox {
    number: string;
    locality: string;
    postalCode: string;
}

export interface Company {
    name: string;
    countryCode: string;
    street: string;
    houseNumber: string;
    locality: string;
    postalCode: string;
    phoneNumber: string;
    email: string;
    website: string;
    postbox: Postbox;
}

export interface LanguageSkill {
    language: string;
    spokenLevel: string;
    writtenLevel: string;
}

export interface Location {
    countryCode: string;
    locality: string;
    postalCode: string;
    additionalDetails: string;
}

export interface Job {
    title: string;
    description: string;
    workingTimePercentageFrom: number;
    workingTimePercentageTo: number;
    startDate: string;
    endDate: string;
    startsImmediately: boolean;
    permanent: boolean;
    location: Location;
    languageSkills: LanguageSkill[];
}

export interface JobPublication {
    publicationStartDate?: string;
    publicationEndDate?: string;
    reference?: string;
    url?: string;
    applicationUrl?: string;
    job?: Job;
    company?: Company;
    contact?: Contact;
}
