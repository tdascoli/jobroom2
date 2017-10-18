import { CandidateSearchRequest } from '../../services/candidate-search-request';
import { CandidateSearchFilter } from '../state/candidate-search.state';

export function createCandidateSearchRequest(searchFilter: CandidateSearchFilter, page = 0): CandidateSearchRequest {
    // fixme: Implement the mapping
    const { occupation } = searchFilter;
    return {
        occupation: occupation ? occupation.code : ''
    } as CandidateSearchRequest;
}
