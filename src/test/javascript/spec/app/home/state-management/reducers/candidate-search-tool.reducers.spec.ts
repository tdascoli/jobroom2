import { initialState } from '../../../../../../../main/webapp/app/home/state-management/state/candidate-search-tool.state';
import {
    CandidateSearchToolCountAction,
    CandidateSearchToolCountedAction,
    CandidateSearchToolSubmittedAction
} from '../../../../../../../main/webapp/app/home/state-management/actions/candidate-search-tool.actions';

import {
    Canton,
    Graduation
} from '../../../../../../../main/webapp/app/candidate-search/services/candidate-search-request';
import { candidateSearchToolReducer } from '../../../../../../../main/webapp/app/home/state-management/reducers/candidate-search-tool.reducers';

describe('candidateSearchToolReducer', () => {
    it('should update CandidateSearchToolState for CANDIDATE_SEARCH_TOOL_SUBMITTED action', () => {
        // GIVEN
        const searchModel = {
            occupation: { code: '11', name: 'test' },
            residence: new Array(Canton.BS),
            graduation: Graduation.ACCEPTED,
            totalCount: 0
        };
        const action = new CandidateSearchToolSubmittedAction(searchModel);

        // WHEN
        const newState = candidateSearchToolReducer(initialState, action);

        // THEN
        expect(newState).toEqual(searchModel);
    });

    it('should update CandidateSearchToolState for CANDIDATE_SEARCH_TOOL_COUNT action', () => {
        // GIVEN
        const searchModel = {
            occupation: { code: '7632', name: 'java' },
            residence: null,
            graduation: Graduation.CH,
            totalCount: 0
        };
        const action = new CandidateSearchToolCountAction(searchModel);

        // WHEN
        const newState = candidateSearchToolReducer(initialState, action);

        // THEN
        expect(newState).toEqual(searchModel);
    });

    it('should update CandidateSearchToolState.totalCount for CANDIDATE_SEARCH_TOOL_COUNTED action', () => {
        // GIVEN
        const totalCount: number = 15;
        const action = new CandidateSearchToolCountedAction(totalCount);

        // WHEN
        const newState = candidateSearchToolReducer(initialState, action);

        // THEN
        expect(newState.totalCount).toEqual(totalCount);
    });
});
