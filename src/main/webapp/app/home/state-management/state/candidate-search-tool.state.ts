import {
    Canton,
    Graduation
} from '../../../candidate-search/services/candidate-search-request';
import { OccupationSuggestion } from '../../../shared/reference-service/occupation-autocomplete';

export interface CandidateSearchToolState {
    occupation?: OccupationSuggestion,
    residence?: Array<Canton>,
    graduation?: Graduation,
    totalCount: number,
}

export const initialState: CandidateSearchToolState = {
    totalCount: 0
};
