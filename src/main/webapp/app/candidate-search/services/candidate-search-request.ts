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
    degree?: string,
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
