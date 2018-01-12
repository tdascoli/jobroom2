import { Observable } from 'rxjs/Observable';
import {
    BaseRequestOptions, RequestOptions, RequestOptionsArgs, Response,
    URLSearchParams
} from '@angular/http';
import { JhiHttpInterceptor } from 'ng-jhipster';
import { JhiBase64Service } from 'ng-jhipster/src/service/base64.service';
import { CookieService } from 'ngx-cookie';

export class CacheKeyInterceptor extends JhiHttpInterceptor {

    constructor(private cookieService: CookieService, private base64: JhiBase64Service) {
        super();
    }

    requestIntercept(options?: RequestOptionsArgs): RequestOptionsArgs {
        const requestOptions = new RequestOptions(options);
        if (!options) {
            options = new BaseRequestOptions();
        }
        if (!requestOptions.params) {
            requestOptions.params = new URLSearchParams();
        }

        requestOptions.params.set('_ng', this.base64.encode(this.cookieService.get('NG_TRANSLATE_LANG_KEY')));
        options.params = requestOptions.params;
        return options;
    }

    responseIntercept(observable: Observable<Response>): Observable<Response> {
        return observable; // by pass
    }
}
