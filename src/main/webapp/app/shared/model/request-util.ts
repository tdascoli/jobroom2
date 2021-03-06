import { BaseRequestOptions, URLSearchParams } from '@angular/http';

export const createRequestOption = (req?: any): BaseRequestOptions => {
    const options: BaseRequestOptions = new BaseRequestOptions();
    if (req) {
        const params: URLSearchParams = new URLSearchParams();
        params.set('page', req.page);
        params.set('size', req.size);
        if (req.sort) {
            params.paramsMap.set('sort', req.sort);
        }
        params.set('query', req.query);

        options.params = params;
    }
    return options;
};

export const createPageableURLSearchParams = (req?: any): URLSearchParams => {
    const params: URLSearchParams = new URLSearchParams();
    params.set('page', req.page);
    params.set('size', req.size);
    if (req.sort) {
        if (req.sort instanceof Array) {
            req.sort.forEach((sort) => params.append('sort', sort));
        } else {
            params.set('sort', req.sort);
        }
    }
    return params;
};
