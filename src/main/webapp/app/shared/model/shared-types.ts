export const enum Gender {
    MALE, FEMALE
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
