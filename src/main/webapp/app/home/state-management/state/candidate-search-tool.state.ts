import { TypeaheadItemDisplayModel } from '../../../shared/input-components';
import { TypeaheadMultiselectModel } from '../../../shared/input-components/typeahead/typeahead-multiselect-model';

export interface CandidateSearchToolState {
    occupations?: Array<TypeaheadMultiselectModel>,
    workplace?: TypeaheadItemDisplayModel,
    skills?: Array<string>,
    totalCount: number,
}

export const initialState: CandidateSearchToolState = {
    totalCount: -1
};
