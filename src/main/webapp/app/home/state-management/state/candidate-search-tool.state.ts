import {
    Canton,
    Graduation
} from '../../../candidate-search/services/candidate-search-request';
import { OccupationSuggestion } from '../../../shared/reference-service/occupation-autocomplete';

export interface CandidateSearchToolState {
    occupation?: OccupationSuggestion,
    residence?: Canton,
    graduation?: Graduation,
}

export const initialState: CandidateSearchToolState = {};
