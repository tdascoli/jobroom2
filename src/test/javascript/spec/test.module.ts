import { NgModule } from '@angular/core';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { JhiLanguageService } from 'ng-jhipster';
import { MockLanguageService } from './helpers/mock-language.service';

export function httpFactory(backendInstance: MockBackend, defaultOptions: BaseRequestOptions) {
    return new Http(backendInstance, defaultOptions);
}

@NgModule({
    providers: [
        MockBackend,
        BaseRequestOptions,
        {
            provide: JhiLanguageService,
            useClass: MockLanguageService
        },
        {
            provide: Http,
            useFactory: httpFactory,
            deps: [MockBackend, BaseRequestOptions]
        }
    ]
})
export class JobroomTestModule {}
