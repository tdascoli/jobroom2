import {
    Availability, Contact, Experience, Gender, Graduation, ISCED_1997,
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
    email: string;
    address: Address;
    nationalityCode: string;
    candidateProfile: CandidateProfile;
}

export enum Degree {
    // TODO: review if it's possible to use english names
    PRIMARSCHULE = 120,
    SEKUNDARSCHULE_UNTERSTUFE = 121,
    SEKUNDARSCHULE_OBERSTUFE = 130,
    EIDG_BERUFSATTEST = 131,
    EIDG_FAEHIGKEITSZEUGNIS = 132,
    FACHMITTELSCHULE = 133,
    BERUFSMATURA = 134,
    FACHMATURA = 135,
    GYMNASIUM_MATURA = 136,
    EIDG_FACHAUSWEIS = 150,
    EIDG_DIPLOM = 160,
    BACHELOR_FACHHOCHSCHULE = 170,
    BACHELOR_UNIVERSITY = 171,
    MASTER_FACHHOCHSCHULE = 172,
    MASTER_UNIVERSITY = 173,
    DOKTORAT = 180,
    UNBEKANNT = 198,
    NA = 199
}

export interface JobExperience {
    occupationCode: number;
    occupation: string;
    experience: Experience;
    graduation: Graduation;
    degree: Degree;
    education: ISCED_1997;
    remark: string;
    lastJob: boolean;
    wanted: boolean;
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
}
