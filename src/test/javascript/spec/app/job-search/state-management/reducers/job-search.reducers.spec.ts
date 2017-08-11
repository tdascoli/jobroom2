import { jobSearchReducer } from '../../../../../../../main/webapp/app/job-search/state-management/reducers/job-search.reducers';
import {
    initialState,
    JobSearchState
} from '../../../../../../../main/webapp/app/job-search/state-management/state/job-search.state';
import * as actions from '../../../../../../../main/webapp/app/job-search/state-management/actions/job-search.actions';
import { TypeaheadMultiselectModel } from '../../../../../../../main/webapp/app/shared/job-search/typeahead-multiselect/typeahead-multiselect-model';

describe('jobSearchReducer', () => {

    it('should not change state for undefined action', () => {
        // GIVEN
        const state = initialState;
        const action = {} as actions.Actions;

        // WHEN
        const newState = jobSearchReducer(state, action);

        // THEN
        expect(newState).toEqual(state);
    });

    it('should update query model for BASE_QUERY_UPDATED action', () => {
        // GIVEN
        const state = initialState;
        const baseQueryModel = [new TypeaheadMultiselectModel('classification', 'c1', 'C1'),
            new TypeaheadMultiselectModel('occupation', 'o1', 'O1'),
            new TypeaheadMultiselectModel('free-text', 'q1', 'q1')];
        const action = new actions.BaseQueryUpdatedAction(baseQueryModel);

        // WHEN
        const newState = jobSearchReducer(state, action);

        // THEN
        expect(newState.searchQuery.baseQuery).toEqual(baseQueryModel);
        verifyUnchanged(newState, state, ['searchQuery']);
    });

    it('should update query model for JOB_LIST_LOADED action', () => {
        // GIVEN
        const state = initialState;
        const jobList = [
            { id: 0, title: 'title-0' },
            { id: 1, title: 'title-1' },
            { id: 2, title: 'title-2' }
        ];
        const action = new actions.JobListLoadedAction(jobList, 100);

        // WHEN
        const newState = jobSearchReducer(state, action);

        // THEN
        expect(newState.jobList).toEqual(jobList);
        expect(newState.totalJobCount).toEqual(100);
        verifyUnchanged(newState, state, ['jobList', 'totalJobCount']);
    });

    it('should update query model for NEXT_PAGE_LOADED action', () => {
        // GIVEN
        const state = initialState;
        const initialJobList = [
            { id: 0, title: 'title-0' },
            { id: 1, title: 'title-1' },
            { id: 2, title: 'title-2' }
        ];

        state.jobList.push(...initialJobList);

        const jobList = [
            { id: 3, title: 'title-3' },
            { id: 4, title: 'title-4' },
            { id: 5, title: 'title-5' }
        ];

        const action = new actions.NextPageLoadedAction(jobList);

        // WHEN
        const newState = jobSearchReducer(state, action);

        // THEN
        expect(newState.jobList).toEqual([...initialJobList, ...jobList]);
        expect(newState.searchQuery.page).toEqual(1);
        verifyUnchanged(newState, state, ['jobList', 'searchQuery']);
    });
});

function verifyUnchanged(newState: JobSearchState, oldState: JobSearchState, ignoreFields: Array<string>) {
    Object.keys(newState)
        .filter((key: string) => ignoreFields.indexOf(key) < 0)
        .forEach((key: string) => {
            expect(newState[key]).toEqual(oldState[key]);
        });
}
