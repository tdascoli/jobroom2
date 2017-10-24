export interface CandidateSearchRequest {
    occupation?: string,
    skills?: Array<string>,
    experience?: string,
    workplace?: string,
    residence?: Array<string>,
    cantonCode?: string,
    regionCode?: string,
    availability?: string,
    workLoad?: WorkLoad,
    workForm?: string,
    educationLevel?: string,
    graduation?: string,
    drivingLicenceCategory?: string,
    languageSkills?: Array<CandidateLanguageSkill>,
    page: number,
    size: number,
}

export interface WorkLoad {
    min: number
    max: number
}

export interface CandidateLanguageSkill {
    code: string
    written?: string
    spoken?: string
}

export enum Experience {
    LESS_THAN_1_YEAR, MORE_THAN_1_YEAR, MORE_THAN_3_YEARS
}

export enum Availability {
    IMMEDIATE, BY_ARRANGEMENT
}

export enum WorkForm {
    SUNDAY_AND_HOLIDAYS, SHIFT_WORK, NIGHT_WORK, HOME_WORK
}

export enum ISCED_1997 {
    ISCED1, ISCED2, ISCED3, ISCED4, ISCED5, ISCED6
}

export enum Graduation {
    CH, ACCEPTED, NOT_ACCEPTED, NONE
}

export enum DrivingLicenceCategory {
    A, A1, B, B1, BE, C, C1, C1E, CE, D, D1, D1E, DE, F, G, M
}

export enum Canton {
    AG, AI, AR, BE, BL, BS, CH, FL, FR, GE, GL, GR, JU, LU, NE, NW, OW, SG, SH, SO, SZ, TG, TI, UR, VD, VS, ZG, ZH
}
