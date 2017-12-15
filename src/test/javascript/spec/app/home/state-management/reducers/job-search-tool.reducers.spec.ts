import { initialState } from '../../../../../../../main/webapp/app/home/state-management/state/job-search-tool.state';
import { jobSearchToolReducer } from '../../../../../../../main/webapp/app/home/state-management/reducers/job-search-tool.reducers';
import {
    JobSearchToolCountAction,
    JobSearchToolCountedAction,
    JobSearchToolSubmittedAction
} from '../../../../../../../main/webapp/app/home/state-management/actions/job-search-tool.actions';
import { LocalityInputType } from '../../../../../../../main/webapp/app/shared/reference-service/locality-autocomplete';
import { TypeaheadMultiselectModel } from '../../../../../../../main/webapp/app/shared/input-components';
import { OccupationInputType } from '../../../../../../../main/webapp/app/shared/reference-service/occupation-presentation.service';

describe('jobSearchToolReducer', () => {
    it('should reset JobSearchToolState for JOB_SEARCH_TOOL_SUBMITTED action', () => {
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
            ],
            totalCount: 0,
            onlineSince: 30,
        };
        const action = new JobSearchToolSubmittedAction(searchModel);

        // WHEN
        const newState = jobSearchToolReducer(initialState, action);

        // THEN
        expect(newState).toEqual(initialState);
    });

    it('should update JobSearchToolState for JOB_SEARCH_TOOL_COUNT action', () => {
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
            ],
            totalCount: 0,
            onlineSince: 30,
        };
        const action = new JobSearchToolCountAction(searchModel);

        // WHEN
        const newState = jobSearchToolReducer(initialState, action);

        // THEN
        expect(newState).toEqual(searchModel);
    });

    it('should update JobSearchToolState.totalCount for JOB_SEARCH_TOOL_COUNT action', () => {
        // GIVEN
        const totalCount = 15;
        const action = new JobSearchToolCountedAction(totalCount);

        // WHEN
        const newState = jobSearchToolReducer(initialState, action);

        // THEN
        expect(newState.totalCount).toEqual(totalCount);
    });
});
