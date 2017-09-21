import {
    Graduation,
    GreaterRegion
} from '../../../candidate-search/services/candidate-search-request';

export interface CandidateSearchToolState {
    occupation?: string,
    residence?: GreaterRegion,
    graduation?: Graduation,
}

export const initialState: CandidateSearchToolState = {};
