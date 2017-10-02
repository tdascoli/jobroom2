import { TypeaheadMultiselectModel } from './typeahead-multiselect-model';

export class TypeaheadItemDisplayModel {
    constructor(public model: TypeaheadMultiselectModel,
                public first = false,
                public firstInGroup = false) {
    }
}
