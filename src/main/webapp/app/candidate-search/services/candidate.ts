import { Contact, Gender, LanguageSkill } from '../../shared/model/shared-types';
import {
    Availability,
    Experience,
    Graduation,
    ISCED_1997,
} from './candidate-search-request';

export interface Address {
    street: string;
    zipCode: string;
    city: string;
}

export interface Candidate {
    id: string;
    externalId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: Address;
    nationalityCode: string;
    candidateProfile: CandidateProfile;
}

enum Degree {
    PRIMARSCHULE,
    SEKUNDARSCHULE_UNTERSTUFE,
    SEKUNDARSCHULE_OBERSTUFE,
    EIDG_BERUFSATTEST,
    EIDG_FAEHIGKEITSZEUGNIS,
    FACHMITTELSCHULE,
    BERUFSMATURA,
    FACHMATURA,
    GYMNASIUM_MATURA,
    EIDG_FACHAUSWEIS,
    EIDG_DIPLOM,
    BACHELOR_FACHHOCHSCHULE,
    BACHELOR_UNIVERSITY,
    MASTER_FACHHOCHSCHULE,
    MASTER_UNIVERSITY,
    DOKTORAT
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
    jobCenterCode: string;
    jobAdvisor: Contact;
}
