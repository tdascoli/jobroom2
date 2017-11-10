import { CandidateSearchFilter } from '../state/candidate-search.state';
import { ITEMS_PER_PAGE } from '../../../shared/constants/pagination.constants';
import {
    Availability,
    Canton,
    CEFR_Level,
    DrivingLicenceCategory,
    Experience,
    Graduation,
    ISCED_1997,
    LanguageSkill,
    WorkForm
} from '../../../shared/model/shared-types';
import { CandidateSearchToolState } from '../../../home/state-management/state/candidate-search-tool.state';
import { TypeaheadItemDisplayModel } from '../../../shared/input-components/typeahead/typeahead-item-display-model';
import {
    CandidateLanguageSkill,
    CandidateSearchRequest,
    WorkLoad
} from '../../services/candidate-search-request';

export function createCandidateSearchRequestFromFilter(searchFilter: CandidateSearchFilter, page = 0): CandidateSearchRequest {
    const {
        occupation, experience, availability, workForm, educationLevel, graduation,
        drivingLicenceCategory
    } = searchFilter;
    const workplace = mapWorkplace(searchFilter.workplace);

    return {
        occupation: occupation ? occupation.code : null,
        skills: searchFilter.skills,
        experience: Experience[experience],
        residence: mapResidence(searchFilter.residence),
        cantonCode: workplace.pop(),
        regionCode: workplace.pop(),
        availability: Availability[availability],
        workLoad: mapWorkLoad(searchFilter.workload),
        workForm: WorkForm[workForm],
        educationLevel: ISCED_1997[educationLevel],
        graduation: Graduation[graduation],
        drivingLicenceCategory: DrivingLicenceCategory[drivingLicenceCategory],
        languageSkills: mapLanguageSkills(searchFilter.languageSkills),
        page,
        size: ITEMS_PER_PAGE
    } as CandidateSearchRequest;
}

export function createCandidateSearchRequestFromToolState(toolState: CandidateSearchToolState): CandidateSearchRequest {
    const { occupation, graduation } = toolState;

    return {
        occupation: occupation ? occupation.code : null,
        residence: mapResidence(toolState.residence),
        graduation: Graduation[graduation]
    } as CandidateSearchRequest;
}

function mapResidence(residences: Array<Canton | string>): Array<string> {
    return residences
        ? residences.map((residence) => residence.toString())
        : null
}

function mapWorkplace(workplace?: TypeaheadItemDisplayModel): Array<string> {
    if (workplace) {
        return workplace.model.code.split(':').reverse();
    }
    return [];
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
