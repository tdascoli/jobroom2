import {
    createCandidateSearchRequestFromFilter,
    createCandidateSearchRequestFromToolState
} from '../../../../../../../main/webapp/app/candidate-search/state-management/util/search-request-mapper';
import { CandidateSearchFilter } from '../../../../../../../main/webapp/app/candidate-search/state-management/state/candidate-search.state';
import {
    Availability,
    Canton,
    CEFR_Level,
    DrivingLicenceCategory,
    Experience,
    Graduation,
    LanguageSkill,
    WorkForm
} from '../../../../../../../main/webapp/app/shared/model/shared-types';
import { ITEMS_PER_PAGE } from '../../../../../../../main/webapp/app/shared';
import {
    CandidateSearchToolState,
    initialState
} from '../../../../../../../main/webapp/app/home/state-management/state/candidate-search-tool.state';
import {
    TypeaheadItemDisplayModel,
    TypeaheadMultiselectModel
} from '../../../../../../../main/webapp/app/shared/input-components';
import { CandidateSearchRequest } from '../../../../../../../main/webapp/app/candidate-search/services/candidate-search-request';
import { Degree } from '../../../../../../../main/webapp/app/shared/job-publication/job-publication.model';

describe('createCandidateSearchRequestFromFilter', () => {

    const defaultFilter: CandidateSearchFilter = {
        skills: [],
        languageSkills: [],
        workload: [0, 100]
    };

    it('should map CandidateSearchFilter with size', () => {
        // WHEN
        const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromFilter(defaultFilter);

        // THEN
        expect(candidateSearchRequest.size).toEqual(ITEMS_PER_PAGE)
    });

    it('should map CandidateSearchFilter with occupation code', () => {
        // GIVEN
        const occupations = [new TypeaheadMultiselectModel('occupation', 'bfs:564236', 'Java')];
        const filter: CandidateSearchFilter = Object.assign({}, defaultFilter, { occupations });

        // WHEN
        const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromFilter(filter);

        // THEN
        expect(candidateSearchRequest.occupations[0].value).toEqual(564236);
        expect(candidateSearchRequest.occupations[0].type).toEqual('bfs');
    });

    it('should map CandidateSearchFilter with skills', () => {
        // GIVEN
        const skills: Array<string> = ['Kotlin', 'Android'];
        const filter: CandidateSearchFilter = Object.assign({}, defaultFilter, { 'skills': skills });

        // WHEN
        const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromFilter(filter);

        // THEN
        expect(candidateSearchRequest.skills).toEqual(skills)
    });

    it('should map CandidateSearchFilter with experience', () => {
        // GIVEN
        const experience: Experience = Experience.MORE_THAN_3_YEARS;
        const filter: CandidateSearchFilter = Object.assign({}, defaultFilter, { 'experience': experience });

        // WHEN
        const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromFilter(filter);

        // THEN
        expect(candidateSearchRequest.experience).toEqual(Experience[experience]);
    });

    it('should map CandidateSearchFilter with residence', () => {
        // GIVEN
        const residence: Array<Canton> = [Canton['0'], Canton['1']];
        const filter: CandidateSearchFilter = Object.assign({}, defaultFilter, { 'residence': residence });

        // WHEN
        const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromFilter(filter);

        // THEN
        expect(candidateSearchRequest.residence).toEqual(['AG', 'AI']);
    });

    it('should map CandidateSearchFilter with availability', () => {
        // GIVEN
        const availability: Availability = Availability.IMMEDIATE;
        const filter: CandidateSearchFilter = Object.assign({}, defaultFilter, { 'availability': availability });

        // WHEN
        const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromFilter(filter);

        // THEN
        expect(candidateSearchRequest.availability).toEqual(Availability[availability]);
    });

    it('should map CandidateSearchFilter with workLoad', () => {
        // WHEN
        const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromFilter(defaultFilter);

        // THEN
        expect(candidateSearchRequest.workLoad).toEqual(Object.assign({}, {
            min: 0,
            max: 100
        }));
    });

    it('should map CandidateSearchFilter with workForm', () => {
        // GIVEN
        const workForm: WorkForm = WorkForm.HOME_WORK;
        const filter: CandidateSearchFilter = Object.assign({}, defaultFilter, { 'workForm': workForm });

        // WHEN
        const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromFilter(filter);

        // THEN
        expect(candidateSearchRequest.workForm).toEqual(WorkForm[workForm]);
    });

    it('should map CandidateSearchFilter with degree', () => {
        // GIVEN
        const degree: Degree = Degree.TER_BERUFSBILDUNG_FA;
        const filter: CandidateSearchFilter = Object.assign({}, defaultFilter, { 'degree': degree });

        // WHEN
        const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromFilter(filter);

        // THEN
        expect(candidateSearchRequest.degree).toEqual(Degree[degree]);
    });

    it('should map CandidateSearchFilter with graduation', () => {
        // GIVEN
        const graduation = Graduation.CH.toString();
        const filter: CandidateSearchFilter = Object.assign({}, defaultFilter, { 'graduation': graduation });

        // WHEN
        const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromFilter(filter);

        // THEN
        expect(candidateSearchRequest.graduation).toEqual(Graduation[graduation]);
    });

    it('should map CandidateSearchFilter with drivingLicenceCategory', () => {
        // GIVEN
        const drivingLicenceCategory: DrivingLicenceCategory = DrivingLicenceCategory.A;
        const filter: CandidateSearchFilter = Object.assign({}, defaultFilter, { 'drivingLicenceCategory': drivingLicenceCategory });

        // WHEN
        const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromFilter(filter);

        // THEN
        expect(candidateSearchRequest.drivingLicenceCategory).toEqual(DrivingLicenceCategory[drivingLicenceCategory]);
    });

    describe('mapLanguageSkills', () => {
        const spoken = CEFR_Level.PROFICIENT;
        const written = CEFR_Level.INTERMEDIATE;

        it('should map CandidateSearchFilter with languageSkills', () => {
            // GIVEN
            const languageSkills: Array<LanguageSkill> = [Object.assign({}, {
                code: 'en',
                nativeLanguage: true,
                spoken,
                written
            })];
            const filter: CandidateSearchFilter = Object.assign({}, defaultFilter,
                { 'languageSkills': languageSkills });

            // WHEN
            const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromFilter(filter);

            // THEN
            expect(candidateSearchRequest.languageSkills).toEqual([Object.assign({}, {
                code: 'en',
                spoken: CEFR_Level[spoken],
                written: CEFR_Level[written]
            })]);
        });

        it('should filter invalid languageSkills', () => {
            // GIVEN
            const languageSkills: Array<LanguageSkill> = [{
                code: 'en',
                nativeLanguage: true,
                spoken,
                written
            }, {
                code: null,
                spoken,
                written
            }];
            const filter: CandidateSearchFilter = Object.assign({}, defaultFilter,
                { 'languageSkills': languageSkills });

            // WHEN
            const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromFilter(filter);

            // THEN
            expect(candidateSearchRequest.languageSkills.length).toEqual(1);
        });
    });

    it('should map CandidateSearchRequest with canton and region code', () => {
        // GIVEN
        const workplace = new TypeaheadItemDisplayModel(new TypeaheadMultiselectModel('type', 'ZH:ZH08', 'label'), true, true);
        const filter: CandidateSearchFilter = Object.assign({}, defaultFilter, { 'workplace': workplace });

        // WHEN
        const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromFilter(filter);

        // THEN
        expect(candidateSearchRequest.cantonCode).toEqual('ZH');
        expect(candidateSearchRequest.regionCode).toEqual('ZH08')
    });
});

describe('createCandidateSearchRequestFromToolState', () => {

    const defaultSearchToolState: CandidateSearchToolState = initialState;

    it('should map CandidateSearchFilter with occupation code', () => {
        // GIVEN
        const occupations = [new TypeaheadMultiselectModel('occupation', 'bfs:564236', 'C++')];
        const filter: CandidateSearchToolState = Object.assign({}, defaultSearchToolState, { occupations });

        // WHEN
        const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromToolState(filter);

        // THEN
        expect(candidateSearchRequest.occupations[0].value).toEqual(564236);
        expect(candidateSearchRequest.occupations[0].type).toEqual('bfs');
    });

    it('should map CandidateSearchFilter with workplace', () => {
        const workplace = new TypeaheadItemDisplayModel(new TypeaheadMultiselectModel('type', 'cc:bb', 'label'));
        const filter: CandidateSearchToolState = Object.assign({}, defaultSearchToolState, { workplace });

        // WHEN
        const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromToolState(filter);

        // THEN
        expect(candidateSearchRequest.cantonCode).toEqual('cc');
        expect(candidateSearchRequest.regionCode).toEqual('bb');
    });

    it('should map CandidateSearchFilter with skills', () => {
        // GIVEN
        const skills = ['java'];
        const filter: CandidateSearchToolState = Object.assign({}, defaultSearchToolState, { skills });

        // WHEN
        const candidateSearchRequest: CandidateSearchRequest = createCandidateSearchRequestFromToolState(filter);

        // THEN
        expect(candidateSearchRequest.skills).toEqual(['java']);
    });
});
