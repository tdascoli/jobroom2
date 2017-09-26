import {
    Graduation,
    GreaterRegion
} from '../../../candidate-search/services/candidate-search-request';
import { OccupationSuggestion } from '../../../shared/job-search/service/occupation-autocomplete';

// todo: move OccupationSuggestion to a reference-service module

export interface CandidateSearchToolState {
    occupation?: OccupationSuggestion,
    residence?: GreaterRegion,
    graduation?: Graduation,
}

export const initialState: CandidateSearchToolState = {};
