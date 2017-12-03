/**
 * @deprecated
 */
export interface OccupationSuggestion {
    name: string;
    code: string;
}

/**
 * @deprecated
 */
export interface ClassificationSuggestion {
    name: string;
    code: string;
}

/**
 * @deprecated
 */
export interface OccupationAutocomplete {
    occupations: OccupationSuggestion[];
    classifications: ClassificationSuggestion[];
}
