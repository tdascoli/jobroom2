import { candidateSearchReducer } from '../../../../../../../main/webapp/app/candidate-search/state-management/reducers/candidate-search.reducers';
import { initialState } from '../../../../../../../main/webapp/app/candidate-search/state-management/state/candidate-search.state';
import {
    Graduation,
    GreaterRegion
} from '../../../../../../../main/webapp/app/candidate-search/services/candidate-search-request';
import { InitCandidateSearchAction } from '../../../../../../../main/webapp/app/candidate-search/state-management/actions/candidate-search.actions';

describe('candidateSearchReducer', () => {
    it('should update CandidateSearchState for INIT_CANDIDATE_SEARCH action', () => {
        // GIVEN
        const searchFilterModel = {
            occupation: { code: '11', name: 'test' },
            residence: GreaterRegion.BS,
            graduation: Graduation.ACCEPTED,
        };
        const action = new InitCandidateSearchAction(searchFilterModel);

        // WHEN
        const newState = candidateSearchReducer(initialState, action);

        // THEN
        expect(newState.searchFilter.occupation).toEqual({ code: '11', name: 'test' });
        expect(newState.searchFilter.residence).toEqual(GreaterRegion.BS);
        expect(newState.searchFilter.graduation).toEqual(Graduation.ACCEPTED);
    });
});
