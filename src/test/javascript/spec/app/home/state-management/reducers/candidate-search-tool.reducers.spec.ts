import { initialState } from '../../../../../../../main/webapp/app/home/state-management/state/candidate-search-tool.state';
import {
    CandidateSearchToolCountAction,
    CandidateSearchToolCountedAction,
    CandidateSearchToolSubmittedAction,
    ResetCandidateSearchToolCountAction
} from '../../../../../../../main/webapp/app/home/state-management/actions/candidate-search-tool.actions';
import { candidateSearchToolReducer } from '../../../../../../../main/webapp/app/home/state-management/reducers/candidate-search-tool.reducers';
import {
    Canton,
    Graduation
} from '../../../../../../../main/webapp/app/shared/model/shared-types';

describe('candidateSearchToolReducer', () => {
    it('should reset CandidateSearchToolState for CANDIDATE_SEARCH_TOOL_SUBMITTED action', () => {
        // GIVEN
        const searchModel = {
            occupation: { key: 'avam:11', label: 'test' },
            residence: new Array(Canton.BS),
            graduation: Graduation.ACCEPTED,
            totalCount: 0
        };
        const action = new CandidateSearchToolSubmittedAction(searchModel);

        // WHEN
        const newState = candidateSearchToolReducer(initialState, action);

        // THEN
        expect(newState).toEqual(initialState);
    });

    it('should update CandidateSearchToolState for CANDIDATE_SEARCH_TOOL_COUNT action', () => {
        // GIVEN
        const searchModel = {
            occupation: { key: 'avam:7632', label: 'java' },
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
        const totalCount = 15;
        const action = new CandidateSearchToolCountedAction(totalCount);

        // WHEN
        const newState = candidateSearchToolReducer(initialState, action);

        // THEN
        expect(newState.totalCount).toEqual(totalCount);
    });

    it('should update CandidateSearchToolState.totalCount for RESET_CANDIDATE_SEARCH_TOOL_COUNT action', () => {
        // GIVEN
        const action = new ResetCandidateSearchToolCountAction();

        // WHEN
        const totalCount = 15;
        const state = Object.assign({}, initialState, totalCount);
        const newState = candidateSearchToolReducer(state, action);

        // THEN
        expect(newState.totalCount).toEqual(initialState.totalCount);
    });
});
