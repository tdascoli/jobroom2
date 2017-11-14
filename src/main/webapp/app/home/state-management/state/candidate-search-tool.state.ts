import { OccupationSuggestion } from '../../../shared/reference-service/occupation-autocomplete';
import { Canton, Graduation } from '../../../shared/model/shared-types';

export interface CandidateSearchToolState {
    occupation?: OccupationSuggestion,
    residence?: Array<Canton>,
    graduation?: Graduation,
    totalCount: number,
}

export const initialState: CandidateSearchToolState = {
    totalCount: -1
};
