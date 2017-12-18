import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from '../../../../../main/webapp/app/home/home.component';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { AgenciesTab, CompaniesTab } from '../../../../../main/webapp/app/home/state-management/state/layout.state';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

describe('HomeComponent', () => {
    const mockStore = jasmine.createSpyObj('mockStore', ['select', 'dispatch']);
    const mockRouter = jasmine.createSpyObj('mockRouter', ['navigate']);
    const mockActivatedRoute = jasmine.createSpyObj('mockActivatedRoute', ['data']);
    mockStore.select.and.returnValue(Observable.of([]));
    mockActivatedRoute.data = Observable.of({});

    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomeComponent],
            providers: [
                { provide: Store, useValue: mockStore },
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute }
            ]
        })
            .overrideTemplate(HomeComponent, '')
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('selectCompaniesTab', () => {
        it('should navigate to job publication', () => {
            // GIVEN
            const event: NgbTabChangeEvent = {
                nextId: CompaniesTab.JOB_PUBLICATION,
                activeId: '1',
                preventDefault: () => {}
            };

            // WHEN
            component.selectCompaniesTab(event);

            // THEN
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/companies/jobpublication']);
        });

        it('should navigate to candidates search', () => {
            // GIVEN
            const event: NgbTabChangeEvent = {
                nextId: CompaniesTab.CANDIDATE_SEARCH,
                activeId: '1',
                preventDefault: () => {}
            };

            // WHEN
            component.selectCompaniesTab(event);

            // THEN
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/companies/candidates']);
        });
    });

    describe('selectRecruitmentAgenciesTab', () => {
        it('should navigate to job publication', () => {
            // GIVEN
            const event: NgbTabChangeEvent = {
                nextId: AgenciesTab.JOB_PUBLICATION,
                activeId: '1',
                preventDefault: () => {}
            };

            // WHEN
            component.selectRecruitmentAgenciesTab(event);

            // THEN
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/agents/jobpublication']);
        });

        it('should navigate to candidates search', () => {
            // GIVEN
            const event: NgbTabChangeEvent = {
                nextId: AgenciesTab.CANDIDATE_SEARCH,
                activeId: '1',
                preventDefault: () => {}
            };

            // WHEN
            component.selectRecruitmentAgenciesTab(event);

            // THEN
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/agents/candidates']);
        });
    });
});
