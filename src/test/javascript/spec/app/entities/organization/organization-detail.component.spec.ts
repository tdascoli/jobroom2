/* tslint:disable max-line-length */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDataUtils, JhiDateUtils, JhiEventManager } from 'ng-jhipster';
import { JobroomTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { OrganizationDetailComponent } from '../../../../../../main/webapp/app/entities/organization/organization-detail.component';
import { OrganizationService } from '../../../../../../main/webapp/app/entities/organization/organization.service';
import { Organization } from '../../../../../../main/webapp/app/entities/organization/organization.model';

describe('Component Tests', () => {

    describe('Organization Management Detail Component', () => {
        let comp: OrganizationDetailComponent;
        let fixture: ComponentFixture<OrganizationDetailComponent>;
        let service: OrganizationService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [JobroomTestModule],
                declarations: [OrganizationDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({ id: 123 })
                    },
                    OrganizationService,
                    JhiEventManager
                ]
            }).overrideTemplate(OrganizationDetailComponent, '')
                .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OrganizationDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrganizationService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Organization(10)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.organization).toEqual(jasmine.objectContaining({ id: 10 }));
            });
        });
    });

});
