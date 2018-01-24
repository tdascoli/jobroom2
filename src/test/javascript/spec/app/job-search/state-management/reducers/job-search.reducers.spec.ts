import { jobSearchReducer } from '../../../../../../../main/webapp/app/job-search/state-management/reducers/job-search.reducers';
import {
    ContractType,
    initialState,
    JobSearchFilter,
    JobSearchQuery,
    JobSearchState,
    Sort
} from '../../../../../../../main/webapp/app/job-search/state-management/state/job-search.state';
import * as actions from '../../../../../../../main/webapp/app/job-search/state-management/actions/job-search.actions';
import { TypeaheadMultiselectModel } from '../../../../../../../main/webapp/app/shared/input-components';
import { ONLINE_SINCE_DEFAULT_VALUE } from '../../../../../../../main/webapp/app/shared/constants/job-search.constants';
import { ResetAction } from '../../../../../../../main/webapp/app/shared/state-management/actions/core.actions';

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

    it('should update JobSearchState for TOOLBAR_CHANGED action', () => {
        // GIVEN
        const state = initialState;
        const searchQuery: JobSearchQuery = {
            baseQuery: [
                new TypeaheadMultiselectModel('classification', 'c1', 'C1'),
                new TypeaheadMultiselectModel('occupation', 'o1', 'O1'),
                new TypeaheadMultiselectModel('free-text', 'q1', 'q1')
            ],
            localityQuery: []
        };
        const action = new actions.ToolbarChangedAction(searchQuery);

        // WHEN
        const newState = jobSearchReducer(state, action);

        // THEN
        expect(newState.searchQuery).toEqual(searchQuery);
        expect(newState.loading).toBeTruthy();
        verifyUnchanged(newState, state, ['loading', 'searchQuery']);
    });

    it('should update JobSearchState for JOB_SEARCH_TOOL_CHANGED action', () => {
        // GIVEN
        const state: JobSearchState = {
                jobListScrollY: 0,
                loading: false,
                searchError: false,
                searchQuery: {
                    baseQuery: [
                        new TypeaheadMultiselectModel('some-free-text', 'x1', 'x1')
                    ],
                    localityQuery: []
                },
                searchFilter: {
                    contractType: ContractType.PERMANENT,
                    workingTime: [0, 80],
                    sort: Sort.DATE_ASC,
                    onlineSince: ONLINE_SINCE_DEFAULT_VALUE - 1
                },
                totalJobCount: 0,
                page: 0,
                jobList: [],
                initialState: false
            }
        ;
        const searchQuery: JobSearchQuery = {
            baseQuery: [
                new TypeaheadMultiselectModel('classification', 'c1', 'C1'),
                new TypeaheadMultiselectModel('occupation', 'o1', 'O1'),
                new TypeaheadMultiselectModel('free-text', 'q1', 'q1')
            ],
            localityQuery: []
        };
        const action = new actions.JobSearchToolChangedAction(searchQuery);

        // WHEN
        const newState = jobSearchReducer(state, action);

        // THEN
        expect(newState.searchQuery).toEqual(searchQuery);
        expect(newState.loading).toBeTruthy();
        expect(newState.initialState).toBeFalsy();
        verifyUnchanged(newState, initialState, ['loading', 'searchQuery', 'initialState']);
    });

    it('should update JobSearchState for FILTER_CHANGED action', () => {
        // GIVEN
        const state = initialState;
        const searchFilter: JobSearchFilter = {
            contractType: ContractType.PERMANENT,
            workingTime: [80, 100],
            sort: Sort.DATE_ASC,
            onlineSince: 60
        };
        const action = new actions.FilterChangedAction(searchFilter);

        // WHEN
        const newState = jobSearchReducer(state, action);

        // THEN
        expect(newState.searchFilter).toEqual(searchFilter);
        expect(newState.loading).toBeTruthy();
        verifyUnchanged(newState, state, ['searchFilter', 'loading']);
    });

    it('should update JobSearchState for JOB_LIST_LOADED action', () => {
        // GIVEN
        const state = initialState;
        const jobList = [
            {
                id: '0',
                externalId: 'extId0',
                title: 'title-0',
                source: 'api',
                publicationEndDate: new Date()
            },
            {
                id: '1',
                externalId: 'extId1',
                title: 'title-1',
                source: 'api',
                publicationEndDate: new Date()
            },
            {
                id: '2',
                externalId: 'extId2',
                title: 'title-2',
                source: 'api',
                publicationEndDate: new Date()
            }
        ];
        const action = new actions.JobListLoadedAction({
            jobList,
            totalCount: 100,
            page: 1
        });

        // WHEN
        const newState = jobSearchReducer(state, action);

        // THEN
        expect(newState.jobList).toEqual(jobList);
        expect(newState.totalJobCount).toEqual(100);
        expect(newState.page).toEqual(1);
        expect(newState.initialState).toBeFalsy();
        expect(newState.loading).toBeFalsy();

        verifyUnchanged(newState, state, [
            'jobList',
            'totalJobCount',
            'page',
            'initialState',
            'loading',
            'jobNavigationEnabled'
        ]);
    });

    it('should update JobSearchState for NEXT_PAGE_LOADED action', () => {
        // GIVEN
        const state = initialState;
        const initialJobList = [
            {
                id: '0',
                externalId: 'extId0',
                title: 'title-0',
                source: 'api',
                publicationEndDate: new Date()
            },
            {
                id: '1',
                externalId: 'extId1',
                title: 'title-1',
                source: 'api',
                publicationEndDate: new Date()
            },
            {
                id: '2',
                externalId: 'extId2',
                title: 'title-2',
                source: 'api',
                publicationEndDate: new Date()
            }
        ];

        state.jobList.push(...initialJobList);

        const jobList = [
            {
                id: '3',
                externalId: 'extId3',
                title: 'title-3',
                source: 'api',
                publicationEndDate: new Date()
            },
            {
                id: '4',
                externalId: 'extId4',
                title: 'title-4',
                source: 'api',
                publicationEndDate: new Date()
            },
            {
                id: '5',
                externalId: 'extId5',
                title: 'title-5',
                source: 'api',
                publicationEndDate: new Date()
            }
        ];

        const action = new actions.NextPageLoadedAction(jobList);

        // WHEN
        const newState = jobSearchReducer(state, action);

        // THEN
        expect(newState.jobList).toEqual([...initialJobList, ...jobList]);
        verifyUnchanged(newState, state, ['jobList']);
    });

    it('should update JobSearchState for SHOW_JOB_LIST_ERROR action', () => {
        // GIVEN
        const state = Object.assign({}, initialState, { loading: true });
        const action = new actions.ShowJobListErrorAction('some error');

        // WHEN
        const newState = jobSearchReducer(state, action);

        // THEN
        expect(newState.searchError).toBeTruthy();
        expect(newState.loading).toBeFalsy();
        verifyUnchanged(newState, state, ['searchError', 'loading']);
    });

    it('should update JobSearchState for HIDE_JOB_LIST_ERROR action', () => {
        // GIVEN
        const state = Object.assign({}, initialState, { searchError: true });
        const action = new actions.HideJobListErrorAction();

        // WHEN
        const newState = jobSearchReducer(state, action);

        // THEN
        expect(newState.searchError).toBeFalsy();
        verifyUnchanged(newState, state, ['searchError']);
    });

    it('should update JobSearchState for LOAD_NEXT_PAGE action', () => {
        // GIVEN
        const state = initialState;
        const action = new actions.LoadNextPageAction();

        // WHEN
        const newState = jobSearchReducer(state, action);

        // THEN
        expect(newState.page).toEqual(1);
        verifyUnchanged(newState, state, ['page']);
    });

    it('should update JobSearchState for SAVE_SCROLL_Y action', () => {
        // GIVEN
        const state = initialState;
        const action = new actions.SaveScrollYAction(600);

        // WHEN
        const newState = jobSearchReducer(state, action);

        // THEN
        expect(newState.jobListScrollY).toEqual(600);
        verifyUnchanged(newState, state, ['jobListScrollY']);
    });

    it('should update JobSearchState for core.ResetAction action', () => {
        // GIVEN
        const state: JobSearchState = {
                jobListScrollY: 0,
                loading: false,
                searchError: false,
                searchQuery: {
                    baseQuery: [
                        new TypeaheadMultiselectModel('some-free-text', 'x1', 'x1')
                    ],
                    localityQuery: []
                },
                searchFilter: {
                    contractType: ContractType.PERMANENT,
                    workingTime: [0, 80],
                    sort: Sort.DATE_ASC,
                    onlineSince: ONLINE_SINCE_DEFAULT_VALUE - 1
                },
                totalJobCount: 0,
                page: 0,
                jobList: [],
                initialState: false
            }
        ;
        const action = new ResetAction(12);

        // WHEN
        const newState = jobSearchReducer(state, action);

        // THEN
        expect(newState).toEqual(initialState);
    });
});

function verifyUnchanged(newState: JobSearchState, oldState: JobSearchState, ignoreFields: Array<string>) {
    Object.keys(newState)
        .filter((key: string) => ignoreFields.indexOf(key) < 0)
        .forEach((key: string) => {
            expect(newState[key]).toEqual(oldState[key]);
        });
}
