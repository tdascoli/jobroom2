import { TypeaheadMultiselectModel } from '../../../shared/input-components';

export interface JobSearchToolState {
    baseQuery: Array<TypeaheadMultiselectModel>;
    localityQuery: Array<TypeaheadMultiselectModel>;
}

export const initialState: JobSearchToolState = {
    baseQuery: [],
    localityQuery: []
};
