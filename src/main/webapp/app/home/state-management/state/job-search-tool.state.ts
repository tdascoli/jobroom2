import { TypeaheadMultiselectModel } from '../../../shared/input-components';
import { ONLINE_SINCE_DEFAULT_VALUE } from '../../../shared/constants/job-search.constants';

export interface JobSearchToolState {
    baseQuery: Array<TypeaheadMultiselectModel>;
    localityQuery: Array<TypeaheadMultiselectModel>;
    totalCount: number;
    onlineSince: number;
}

export const initialState: JobSearchToolState = {
    baseQuery: [],
    localityQuery: [],
    totalCount: -1,
    onlineSince: ONLINE_SINCE_DEFAULT_VALUE
};
