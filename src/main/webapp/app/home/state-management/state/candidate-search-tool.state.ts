import { Canton, Graduation } from '../../../shared/model/shared-types';
import { OccupationOption } from '../../../shared/reference-service';

export interface CandidateSearchToolState {
    occupation?: OccupationOption,
    residence?: Array<Canton>,
    graduation?: Graduation,
    totalCount: number,
}

export const initialState: CandidateSearchToolState = {
    totalCount: -1
};
