import { TypeaheadMultiselectModel } from '../../../shared/job-search/typeahead-multiselect/typeahead-multiselect-model';

export interface JobSearchToolState {
    baseQuery: Array<TypeaheadMultiselectModel>;
    localityQuery: Array<TypeaheadMultiselectModel>;
}

export const initialState: JobSearchToolState = {
    baseQuery: [],
    localityQuery: []
};
