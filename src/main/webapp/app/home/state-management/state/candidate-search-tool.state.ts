import { OccupationOption } from '../../../shared/reference-service';
import { TypeaheadItemDisplayModel } from '../../../shared/input-components';

export interface CandidateSearchToolState {
    occupation?: OccupationOption,
    workplace?: TypeaheadItemDisplayModel,
    skills?: Array<string>,
    totalCount: number,
}

export const initialState: CandidateSearchToolState = {
    totalCount: -1
};
