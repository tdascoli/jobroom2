import { TypeaheadMultiselectModel } from '../../../shared/input-components';

export interface JobSearchToolState {
    baseQuery: Array<TypeaheadMultiselectModel>;
    localityQuery: Array<TypeaheadMultiselectModel>;
    totalCount: number;
}

export const initialState: JobSearchToolState = {
    baseQuery: [],
    localityQuery: [],
    totalCount: -1
};
