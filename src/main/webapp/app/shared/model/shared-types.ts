export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}

export interface Contact {
    salutation?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
}

export enum CEFR_Level {
    NONE, BASIC, INTERMEDIATE, PROFICIENT
}

export interface LanguageSkill {
    code: string;
    nativeLanguage?: boolean;
    spoken: CEFR_Level;
    written: CEFR_Level;
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
    AG, AI, AR, BE, BL, BS, FR, GE, GL, GR, JU, LU, NE, NW, OW, SG, SH, SO, SZ, TG, TI, UR, VD, VS, ZG, ZH
}
