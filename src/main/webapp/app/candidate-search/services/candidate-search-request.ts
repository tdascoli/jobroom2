export interface CandidateSearchRequest {
    occupation: string,
    skills: Array<string>,
    experience: string,
    workplace: string,
    residence: string,
    availability: Availability,
    workload: number,
    workSystem: WorkForm,
    educationLevel: ISCED_1997,
    graduation: Graduation,
    drivingLicenseCategory: DrivingLicenceCategory
    languageSkills: Array<LanguageSkill>
}

export interface LanguageSkill {
    code: string,
    spoken: CEFR_Level,
    written: CEFR_Level
}

export enum Availability {
    IMMEDIATELY, BY_ARRANGEMENT
}

export enum WorkForm {
    SUNDAY_AND_HOLIDAYS, SHIFT_WORK, NIGHT_WORK, HOME_WORK
}

export enum ISCED_1997 {
    ISCED1, ISCED2, ISCED3, ISCED4, ISCED5, ISCED6
}

export enum Graduation {

}

export enum DrivingLicenceCategory {
    A, A1, B, B1, BE, C, C1, C1E, CE, D, D1, D1E, DE, F, G, M
}

export enum CEFR_Level {
    NONE, BASIC, INTERMEDIATE, PROFICIENT
}
