import { initialState } from '../../../../../../../main/webapp/app/home/state-management/state/candidate-search-tool.state';
import { CandidateSearchToolSubmittedAction } from '../../../../../../../main/webapp/app/home/state-management/actions/candidate-search-tool.actions';

import {
    Graduation,
    GreaterRegion
} from '../../../../../../../main/webapp/app/candidate-search/services/candidate-search-request';
import { candidateSearchToolReducer } from '../../../../../../../main/webapp/app/home/state-management/reducers/candidate-search-tool.reducers';

describe('candidateSearchToolReducer', () => {
    it('should update CandidateSearchToolState for CANDIDATE_SEARCH_TOOL_SUBMITTED action', () => {
        // GIVEN
        const searchModel = {
            occupation: 'test',
            residence: GreaterRegion.BS,
            graduation: Graduation.ACCEPTED,
        };
        const action = new CandidateSearchToolSubmittedAction(searchModel);

        // WHEN
        const newState = candidateSearchToolReducer(initialState, action);

        // THEN
        expect(newState).toEqual(searchModel);
    });
});
