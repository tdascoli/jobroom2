const defaultQuery = '*';

export class JobSearchRequest {
    query: string;

    constructor(terms: Array<string>) {
        this.query = terms.length > 0 ? terms.join(',') : defaultQuery;
    }
}
