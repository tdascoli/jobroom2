import { initialState } from '../../../../../../../main/webapp/app/home/state-management/state/job-search-tool.state';
import { jobSearchToolReducer } from '../../../../../../../main/webapp/app/home/state-management/reducers/job-search-tool.reducers';
import { JobSearchToolSubmittedAction } from '../../../../../../../main/webapp/app/home/state-management/actions/job-search-tool.actions';
import { LocalityInputType } from '../../../../../../../main/webapp/app/shared/job-search/service/locality-autocomplete';
import { TypeaheadMultiselectModel } from '../../../../../../../main/webapp/app/shared/job-search/typeahead-multiselect/typeahead-multiselect-model';
import { OccupationInputType } from '../../../../../../../main/webapp/app/shared/job-search/service/occupation-autocomplete';

describe('jobSearchToolReducer', () => {
    it('should update JobSearchToolState for JOB_SEARCH_TOOL_SUBMITTED action', () => {
        // GIVEN
        const searchModel = {
            baseQuery: [
                new TypeaheadMultiselectModel(OccupationInputType.FREE_TEXT, 'c1', 'l1'),
                new TypeaheadMultiselectModel(OccupationInputType.OCCUPATION, 'c2', 'l2'),
                new TypeaheadMultiselectModel(OccupationInputType.CLASSIFICATION, 'c3', 'l3')
            ],
            localityQuery: [
                new TypeaheadMultiselectModel(LocalityInputType.LOCALITY, 'c4', 'l4'),
                new TypeaheadMultiselectModel(LocalityInputType.CANTON, 'c5', 'l5')
            ]
        };
        const action = new JobSearchToolSubmittedAction(searchModel);

        // WHEN
        const newState = jobSearchToolReducer(initialState, action);

        // THEN
        expect(newState).toEqual(searchModel);
    });

});