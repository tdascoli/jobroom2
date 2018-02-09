import { candidateSearchReducer } from '../../../../../../../main/webapp/app/candidate-search/state-management/reducers/candidate-search.reducers';
import {
    CandidateSearchState,
    initialState
} from '../../../../../../../main/webapp/app/candidate-search/state-management/state/candidate-search.state';
import * as actions from '../../../../../../../main/webapp/app/candidate-search/state-management/actions/candidate-search.actions';
import { CandidateProfile } from '../../../../../../../main/webapp/app/candidate-search/services/candidate';
import { createCandidateProfile } from '../utils';
import { TypeaheadMultiselectModel } from '../../../../../../../main/webapp/app/shared/input-components/index';
import { TypeaheadItemDisplayModel } from '../../../../../../../main/webapp/app/shared/input-components/typeahead/typeahead-item-display-model';

describe('candidateSearchReducer', () => {
    it('should not update CandidateSearchState for INIT_CANDIDATE_SEARCH action', () => {
        // GIVEN
        const state = Object.assign({}, initialState);
        const action = new actions.InitCandidateSearchAction();

        // WHEN
        const newState = candidateSearchReducer(initialState, action);

        // THEN
        verifyUnchanged(newState, state, []);
    });

    it('should update CandidateSearchState for CANDIDATE_LIST_LOADED action', () => {
        // GIVEN
        const candidateProfileList: Array<CandidateProfile> = [createCandidateProfile('c1'), createCandidateProfile('c2'), createCandidateProfile('c3')];
        const state = Object.assign({}, initialState, { candidateProfileList: [createCandidateProfile('c0')] });
        const action = new actions.CandidateProfileListLoadedAction({
            candidateProfileList,
            totalCandidateCount: 100,
            page: 0
        });

        // WHEN
        const newState = candidateSearchReducer(state, action);

        // THEN
        expect(newState.candidateProfileList).toEqual([
            createCandidateProfile('c1'),
            createCandidateProfile('c2'),
            createCandidateProfile('c3'),
        ]);
        expect(newState.totalCandidateCount).toEqual(100);
        expect(newState.page).toEqual(0);
        expect(newState.loading).toBeFalsy();
        expect(newState.searchError).toBeFalsy();
        expect(newState.candidateListScrollY).toBe(0);
        verifyUnchanged(newState, state, [
            'candidateProfileList',
            'totalCandidateCount',
            'page',
            'loading',
            'searchError',
            'candidateListScrollY'
        ]);
    });

    it('should update CandidateSearchState for SHOW_CANDIDATE_LIST_ERROR action', () => {
        // GIVEN
        const state = Object.assign({}, initialState);
        const action = new actions.ShowCandidateListErrorAction('some error');

        // WHEN
        const newState = candidateSearchReducer(state, action);

        // THEN
        expect(newState.searchError).toBeTruthy();
        verifyUnchanged(newState, state, ['searchError']);
    });

    it('should update CandidateSearchState for HIDE_CANDIDATE_LIST_ERROR action', () => {
        // GIVEN
        const state = Object.assign({}, initialState, { searchError: true });
        const action = new actions.HideCandidateListErrorAction();

        // WHEN
        const newState = candidateSearchReducer(state, action);

        // THEN
        expect(newState.searchError).toBeFalsy();
        verifyUnchanged(newState, state, ['searchError']);
    });

    it('should update CandidateSearchState for SEARCH_CANDIDATES action', () => {
        // GIVEN
        const state = Object.assign({}, initialState, { searchError: true });
        const action = new actions.SearchCandidatesAction({
            workplace: new TypeaheadItemDisplayModel(new TypeaheadMultiselectModel('type', 'code', 'label'), true, true)
        });

        // WHEN
        const newState = candidateSearchReducer(state, action);

        // THEN
        expect(newState.searchFilter.workplace).toEqual(new TypeaheadItemDisplayModel(new TypeaheadMultiselectModel('type', 'code', 'label'), true, true));
        expect(newState.loading).toBeTruthy();
        expect(newState.initialState).toBeFalsy();
        verifyUnchanged(newState, state, ['loading', 'searchFilter', 'initialState']);
    });

    it('should update CandidateSearchState for CANDIDATE_SEARCH_TOOL_CHANGED action', () => {
        // GIVEN
        const state: CandidateSearchState = {
            searchFilter: {
                skills: ['test'],
                languageSkills: [],
                workload: [0, 20]
            },
            loading: false,
            totalCandidateCount: 0,
            page: 0,
            candidateProfileList: [],
            initialState: true,
            searchError: false,
            candidateListScrollY: 0,
            resetTime: 0
        };

        const action = new actions.CandidateSearchToolChangedAction({
            workplace: new TypeaheadItemDisplayModel(new TypeaheadMultiselectModel('type', 'code', 'label'), true, true)
        });

        // WHEN
        const newState = candidateSearchReducer(state, action);

        // THEN
        expect(newState.searchFilter.workplace).toEqual(new TypeaheadItemDisplayModel(new TypeaheadMultiselectModel('type', 'code', 'label'), true, true));
        expect(newState.searchFilter.skills).toEqual(initialState.searchFilter.skills);
        expect(newState.searchFilter.workload).toEqual(initialState.searchFilter.workload);
        expect(newState.loading).toBeTruthy();
        expect(newState.initialState).toBeFalsy();
        verifyUnchanged(newState, initialState, ['loading', 'initialState', 'searchFilter']);
        verifyUnchanged(newState.searchFilter, initialState.searchFilter, ['workplace', 'skills', 'workload']);
    });

    it('should update CandidateSearchState for NEXT_PAGE_LOADED action', () => {
        // GIVEN
        const state = Object.assign({}, initialState, {
            candidateProfileList: [
                createCandidateProfile('c0'),
                createCandidateProfile('c1'),
                createCandidateProfile('c2')
            ],
            page: 1
        });
        const action = new actions.NextPageLoadedAction([
            createCandidateProfile('c3'),
            createCandidateProfile('c4'),
            createCandidateProfile('c5'),
        ]);

        // WHEN
        const newState = candidateSearchReducer(state, action);

        // THEN
        expect(newState.page).toEqual(2);
        expect(newState.loading).toBeFalsy();
        expect(newState.candidateProfileList).toEqual([
            createCandidateProfile('c0'),
            createCandidateProfile('c1'),
            createCandidateProfile('c2'),
            createCandidateProfile('c3'),
            createCandidateProfile('c4'),
            createCandidateProfile('c5'),
        ]);
        verifyUnchanged(newState, state, ['page', 'loading', 'candidateProfileList']);
    });

    it('should update CandidateSearchState for SAVE_SCROLL_Y action', () => {
        // GIVEN
        const state = initialState;
        const action = new actions.SaveScrollYAction(600);

        // WHEN
        const newState = candidateSearchReducer(state, action);

        // THEN
        expect(newState.candidateListScrollY).toEqual(600);
        verifyUnchanged(newState, state, ['candidateListScrollY']);
    });

    it('should update CandidateSearchState for UPDATE_OCCUPATION_TRANSLATION action', () => {
        // GIVEN
        const state = Object.assign({}, initialState, {
            searchFilter: {
                occupation: { key: 'avam:7632', label: 'java' },
            }
        });
        const action = new actions.UpdateOccupationTranslationAction({
            key: 'avam:7632',
            label: 'java_de'
        });

        // WHEN
        const newState = candidateSearchReducer(state, action);

        // THEN
        expect(newState.searchFilter.occupation).toEqual({
            key: 'avam:7632',
            label: 'java_de'
        });
        verifyUnchanged(newState, initialState, ['searchFilter']);
        verifyUnchanged(newState.searchFilter, initialState.searchFilter, ['occupation']);
    });

    it('should update CandidateSearchState for RESET_FILTER action', () => {
        // GIVEN
        const state = Object.assign({}, initialState, { searchError: true });
        const action = new actions.ResetFilterAction(50);

        // WHEN
        const newState = candidateSearchReducer(state, action);

        // THEN
        expect(newState.resetTime).toEqual(50);
    })

});

function verifyUnchanged<T>(newState: T, oldState: T, ignoreFields: Array<string>) {
    Object.keys(newState)
        .filter((key: string) => ignoreFields.indexOf(key) < 0)
        .forEach((key: string) => {
            expect(newState[key]).toEqual(oldState[key]);
        });
}
