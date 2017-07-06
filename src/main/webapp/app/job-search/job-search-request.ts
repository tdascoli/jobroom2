const defaultQuery = '*';

export class JobSearchRequest {
    private _query: string;

    constructor(term = defaultQuery) {
        this._query = term;
    }

    get query(): string {
        return this._query.length > 0 ? this._query : defaultQuery;
    }
}
