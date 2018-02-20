import {
    Availability,
    Contact,
    Experience,
    Gender,
    Graduation,
    ISCED_1997,
    LanguageSkill
} from '../../shared/model/shared-types';

export interface Address {
    street: string;
    zipCode: string;
    city: string;
}

export interface Candidate {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    mobile: string;
    email: string;
    address: Address;
    nationalityCode: string;
    candidateProfile: CandidateProfile;
}

export enum Degree {
    PRIMAR_OBLIGATORISCHE_SCHULE,
    SEK_I_OBLIGATORISCHE_SCHULE,
    SEK_II_WEITERFUEHRENDE_SCHULE,
    SEK_II_GRUNDBILDUNG_EBA,
    SEK_II_GRUNDBILDUNG_EFZ,
    SEK_II_FACHMITTELSCHULE,
    SEK_II_BERUFSMATURITAET,
    SEK_II_FACHMATURITAET,
    SEK_II_GYMNASIALE_MATURITAET,
    TER_BERUFSBILDUNG_FA,
    TER_BERUFSBILDUNG_DIPL,
    TER_BACHELOR_FACHHOCHSCHULE,
    TER_BACHELOR_UNIVERSITAET,
    TER_MASTER_FACHHOCHSCHULE,
    TER_MASTER_UNIVERSITAET,
    TER_DOKTORAT_UNIVERSITAET,
    NOT_KNOWN
}

export interface JobExperience {
    occupation: Occupation,
    occupationLabel: string;
    experience: Experience;
    graduation: Graduation;
    degree: Degree;
    education: ISCED_1997;
    remark: string;
    lastJob: boolean;
    wanted: boolean;
}

export interface Occupation {
    avamCode: number;
    bfsCode: number;
    sbn3Code: number;
    sbn5Code: number;
}

export interface CandidateProfile {
    id: string;
    gender: Gender;
    availability: Availability;
    externalId: string;
    residenceCantonCode: string;
    workLoad: number;
    isPublic: boolean;
    isProtected: boolean;
    showProtectedData: boolean;
    workForm: string[];
    preferredWorkRegions: string[];
    preferredWorkCantons: string[];
    jobExperiences: JobExperience[];
    languages: LanguageSkill[];
    drivingCategories: string[];
    highestEducationLevel: string;
    highestDegree: string
    jobCenterCode: string;
    jobAdvisor: Contact;
    visited?: boolean;
}
