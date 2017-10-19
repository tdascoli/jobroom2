import {
    Availability,
    CandidateLanguageSkill,
    CandidateSearchRequest,
    Canton,
    DrivingLicenceCategory,
    Experience,
    Graduation,
    ISCED_1997,
    WorkForm,
    WorkLoad
} from '../../services/candidate-search-request';
import { CandidateSearchFilter } from '../state/candidate-search.state';
import { ITEMS_PER_PAGE } from '../../../shared/constants/pagination.constants';
import { CEFR_Level, LanguageSkill } from '../../../shared/model/shared-types';

export function createCandidateSearchRequest(searchFilter: CandidateSearchFilter, page = 0): CandidateSearchRequest {
    const {
        occupation, experience, availability, workForm, educationLevel, graduation,
        drivingLicenceCategory
    } = searchFilter;
    const residence = mapResidence(searchFilter.residence);
    const workLoad = mapWorkLoad(searchFilter.workload);
    const languageSkills = mapLanguageSkills(searchFilter.languageSkills);

    return {
        occupation: occupation ? occupation.code : null,
        skills: searchFilter.skills,
        experience: Experience[experience],
        'residence': residence,
        availability: Availability[availability],
        'workLoad': workLoad,
        workForm: WorkForm[workForm],
        educationLevel: ISCED_1997[educationLevel],
        graduation: Graduation[graduation],
        drivingLicenceCategory: DrivingLicenceCategory[drivingLicenceCategory],
        'languageSkills': languageSkills,
        page,
        size: ITEMS_PER_PAGE
    } as CandidateSearchRequest;
}

function mapResidence(residences: Array<Canton>): Array<string> {
    return residences
        ? residences.map((residence) => residence.toString())
        : null
}

function mapWorkLoad(workLoad: [number, number]): WorkLoad {
    return workLoad
        ? Object.assign({}, { min: workLoad[0], max: workLoad[1] })
        : null;
}

function mapLanguageSkills(languageSkills: Array<LanguageSkill>): Array<CandidateLanguageSkill> {
    return languageSkills
        ? languageSkills.map((languageSkill) => Object.assign({}, {
            code: languageSkill.code,
            written: CEFR_Level[languageSkill.written],
            spoken: CEFR_Level[languageSkill.spoken]
        }) as CandidateLanguageSkill)
        : null;
}
