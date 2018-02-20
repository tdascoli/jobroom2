import { RouterEffects } from '../../../../../../../main/webapp/app/candidate-search/state-management/effects/router.effects';
import { Observable } from 'rxjs/Observable';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { candidateSearchReducer } from '../../../../../../../main/webapp/app/candidate-search/state-management/reducers/candidate-search.reducers';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { RouterStateUrl } from '../../../../../../../main/webapp/app/shared/custom-router-state-serializer/custom-router-state-serializer';
import { Params, Router } from '@angular/router';
import { MockRouter } from '../../../../helpers/mock-route.service';
import { SearchCandidatesAction } from '../../../../../../../main/webapp/app/candidate-search/state-management/actions/candidate-search.actions';
import { TypeaheadMultiselectModel } from '../../../../../../../main/webapp/app/shared/input-components';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { CandidateService } from '../../../../../../../main/webapp/app/candidate-search/services/candidate.service';
import { JhiBase64Service } from 'ng-jhipster';
import { Http } from '@angular/http';
import { Principal } from '../../../../../../../main/webapp/app/shared';
import { AccountService } from '../../../../../../../main/webapp/app/shared';

describe('RouterEffects', () => {
    const testFilter = `eyJza2lsbHMiOltdLCJsYW5ndWFnZVNraWxscyI6W3siY29kZSI6ImRlIiwid3Jpd
    HRlbiI6MSwic3Bva2VuIjoxfV0sIndvcmtsb2FkIjpbMzAsMTAwXSwib2NjdXBhdGlvbnMiOm51bGwsImdyYW
    R1YXRpb24iOm51bGwsInJlc2lkZW5jZSI6WyJBRyIsIkFJIiwiR0UiXSwiZXhwZXJpZW5jZSI6bnVsbCwid29
    ya3BsYWNlIjp7Im1vZGVsIjp7InR5cGUiOiJsb2NhbGl0eSIsImNvZGUiOiJaSDpaSDA4IiwibGFiZWwiOiJC
    ZXJnIGFtIElyY2hlbCIsIm9yZGVyIjowfSwiZmlyc3QiOnRydWUsImZpcnN0SW5Hcm91cCI6dHJ1ZX0sImF2Y
    WlsYWJpbGl0eSI6bnVsbCwid29ya0Zvcm0iOm51bGwsImRlZ3JlZSI6bnVsbCwiZHJpdmluZ0xpY2VuY2VDYX
    RlZ29yeSI6bnVsbH0=`;

    const mockRouter = new MockRouter();

    let effects: RouterEffects;
    let actions$: Observable<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot({ candidateSearch: candidateSearchReducer })
            ],
            providers: [
                JhiBase64Service,
                CandidateService,
                RouterEffects,
                Principal,
                AccountService,
                provideMockActions(() => actions$),
                { provide: Router, useValue: mockRouter },
                { provide: Http, useValue: null }
            ],
        });

        effects = TestBed.get(RouterEffects);
    });

    describe('routerNavigation$', () => {
        it('should not do anything if url is not /candidate-search', () => {
            const action = createRouterNavigationAction('/', { 'searchFilter': testFilter });

            actions$ = hot('-a', { a: action });
            const expected = cold('-');
            expect(effects.routerNavigation$).toBeObservable(expected);
        });

        it('should not do anything without a valid searchFilter param', () => {
            const action = createRouterNavigationAction('/candidate-search', { 'someParam': 'someValue' });

            actions$ = hot('-a', { a: action });
            const expected = cold('-');
            expect(effects.routerNavigation$).toBeObservable(expected);
        });

        it('should return a new SearchCandidatesAction with the valid CandidateSearchFilter payload', () => {
            const action = createRouterNavigationAction('/candidate-search', { 'searchFilter': testFilter });

            actions$ = hot('-a', { a: action });

            const searchCandidatesAction = new SearchCandidatesAction({
                skills: [],
                languageSkills: [
                    { code: 'de', written: 1, spoken: 1 }
                ],
                workload: [30, 100],
                occupations: null,
                graduation: null,
                residence: ['AG', 'AI', 'GE'],
                experience: null,
                workplace: {
                    model: {
                        type: 'locality',
                        code: 'ZH:ZH08',
                        label: 'Berg am Irchel',
                        order: 0
                    } as TypeaheadMultiselectModel,
                    first: true,
                    firstInGroup: true
                },
                availability: null,
                workForm: null,
                degree: null,
                drivingLicenceCategory: null
            });
            const expected = cold('-b', { b: searchCandidatesAction });
            expect(effects.routerNavigation$).toBeObservable(expected);
        });

        it('should call router.navigate with /candidate-search', () => {
            // GIVEN
            const action = createRouterNavigationAction('/candidate-search', { 'searchFilter': testFilter });
            actions$ = new ReplaySubject(1);

            // WHEN
            (actions$ as ReplaySubject<any>).next(action);
            effects.routerNavigation$.subscribe();

            // THEN
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/candidate-search']);
        });

    });

    function createRouterNavigationAction(url: string, queryParams: Params): RouterNavigationAction<RouterStateUrl> {
        return {
            type: ROUTER_NAVIGATION,
            payload: {
                event: null,
                routerState: {
                    url,
                    queryParams
                }
            }
        } as RouterNavigationAction<RouterStateUrl>;
    }
});
