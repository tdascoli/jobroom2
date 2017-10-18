import { CandidateSearchRequest } from '../../services/candidate-search-request';
import { CandidateSearchFilter } from '../state/candidate-search.state';
import { ITEMS_PER_PAGE } from '../../../shared/constants/pagination.constants';

export function createCandidateSearchRequest(searchFilter: CandidateSearchFilter, page = 0): CandidateSearchRequest {
    // fixme: Implement the mapping
    const { occupation } = searchFilter;
    return {
        occupation: occupation ? occupation.code : '',
        page,
        size: ITEMS_PER_PAGE
    } as CandidateSearchRequest;
}
