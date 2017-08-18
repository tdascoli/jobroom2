export class OccupationInputType {
    static OCCUPATION = 'occupation';
    static CLASSIFICATION = 'classification';
    static FREE_TEXT = 'free-text';
}

export interface OccupationSuggestion {
    name: string;
    code: string;
}

export interface ClassificationSuggestion {
    name: string;
    code: string;
}

export interface OccupationAutocomplete {
    occupations: OccupationSuggestion[];
    classifications: ClassificationSuggestion[];
}
