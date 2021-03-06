import { JhiEventManager, JhiInterceptableHttp } from 'ng-jhipster';
import { Injector } from '@angular/core';
import { Http, RequestOptions, XHRBackend } from '@angular/http';

import { AuthInterceptor } from './auth.interceptor';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { AuthExpiredInterceptor } from './auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './errorhandler.interceptor';
import { NotificationInterceptor } from './notification.interceptor';
import { JhiBase64Service } from 'ng-jhipster/src/service/base64.service';
import { CookieService } from 'ngx-cookie';
import { CacheKeyInterceptor } from './cache.interceptor';

export function interceptableFactory(backend: XHRBackend,
                                     defaultOptions: RequestOptions,
                                     localStorage: LocalStorageService,
                                     sessionStorage: SessionStorageService,
                                     injector: Injector,
                                     eventManager: JhiEventManager,
                                     cookieService: CookieService,
                                     base64: JhiBase64Service) {
    return new JhiInterceptableHttp(
        backend,
        defaultOptions,
        [
            new AuthInterceptor(localStorage, sessionStorage),
            new AuthExpiredInterceptor(injector),
            // Other interceptors can be added here
            new ErrorHandlerInterceptor(eventManager),
            new NotificationInterceptor(injector),
            new CacheKeyInterceptor(cookieService, base64)
        ]
    );
}

export function customHttpProvider() {
    return {
        provide: Http,
        useFactory: interceptableFactory,
        deps: [
            XHRBackend,
            RequestOptions,
            LocalStorageService,
            SessionStorageService,
            Injector,
            JhiEventManager,
            CookieService,
            JhiBase64Service
        ]
    };
}
