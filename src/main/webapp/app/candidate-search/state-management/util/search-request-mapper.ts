import { CandidateSearchFilter } from '../state/candidate-search.state';
import {
    Availability,
    Canton,
    CEFR_Level,
    DrivingLicenceCategory,
    Experience,
    Graduation,
    ITEMS_PER_PAGE,
    LanguageSkill,
    WorkForm
} from '../../../shared';
import { CandidateSearchToolState } from '../../../home/state-management';
import { TypeaheadItemDisplayModel } from '../../../shared/input-components';
import {
    CandidateLanguageSkill,
    CandidateSearchRequest,
    WorkLoad
} from '../../services/candidate-search-request';
import { OccupationCode } from '../../../shared/reference-service';
import { TypeaheadMultiselectModel } from '../../../shared/input-components/typeahead/typeahead-multiselect-model';
import { OccupationInputType } from '../../../shared/reference-service/occupation-presentation.service';
import { Degree } from '../../../shared/job-publication/job-publication.model';

// todo: The same code is duplicated in the job-search search-request-mapper.ts

const toCode = (value: TypeaheadMultiselectModel) => value.code;
const byValue = (type: string) => (value: TypeaheadMultiselectModel) => value.type === type;

export function createCandidateSearchRequestFromFilter(searchFilter: CandidateSearchFilter, page = 0): CandidateSearchRequest {
    const {
        occupations, experience, availability, workForm, degree, graduation,
        drivingLicenceCategory
    } = searchFilter;
    const workplace = mapWorkplace(searchFilter.workplace);

    return {
        occupationCodes: mapOccupationCode(occupations),
        skills: searchFilter.skills,
        experience: Experience[experience],
        residence: mapResidence(searchFilter.residence),
        cantonCode: workplace.pop(),
        regionCode: workplace.pop(),
        availability: Availability[availability],
        workLoad: mapWorkLoad(searchFilter.workload),
        workForm: WorkForm[workForm],
        degree: Degree[degree],
        graduation: Graduation[graduation],
        drivingLicenceCategory: DrivingLicenceCategory[drivingLicenceCategory],
        languageSkills: mapLanguageSkills(searchFilter.languageSkills),
        page,
        size: ITEMS_PER_PAGE
    } as CandidateSearchRequest;
}

export function createCandidateSearchRequestFromToolState(toolState: CandidateSearchToolState): CandidateSearchRequest {
    const { occupations, skills } = toolState;
    const workplace = mapWorkplace(toolState.workplace);

    return {
        occupationCodes: mapOccupationCode(occupations),
        cantonCode: workplace.pop(),
        regionCode: workplace.pop(),
        skills,
        page: 0,
        size: ITEMS_PER_PAGE
    } as CandidateSearchRequest;
}

function mapOccupationCode(occupationsOptions: Array<TypeaheadMultiselectModel> = []): Array<OccupationCode> {
    const occupations = occupationsOptions.filter(byValue(OccupationInputType.OCCUPATION))
        .map(toCode)
        .map(OccupationCode.fromString);
    const classifications = occupationsOptions.filter(byValue(OccupationInputType.CLASSIFICATION))
        .map(toCode)
        .map(OccupationCode.fromString);

    return [...occupations, ...classifications];
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
        ? languageSkills
            .filter((languageSkill) => languageSkill.code)
            .map((languageSkill) => Object.assign({}, {
                code: languageSkill.code,
                written: CEFR_Level[languageSkill.written],
                spoken: CEFR_Level[languageSkill.spoken]
            }) as CandidateLanguageSkill)
        : null;
}
