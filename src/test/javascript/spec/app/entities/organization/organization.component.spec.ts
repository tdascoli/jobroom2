/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { JobroomTestModule } from '../../../test.module';
import { OrganizationComponent } from '../../../../../../main/webapp/app/entities/organization/organization.component';
import { OrganizationService } from '../../../../../../main/webapp/app/entities/organization/organization.service';
import { Organization } from '../../../../../../main/webapp/app/entities/organization/organization.model';

describe('Component Tests', () => {

    describe('Organization Management Component', () => {
        let comp: OrganizationComponent;
        let fixture: ComponentFixture<OrganizationComponent>;
        let service: OrganizationService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [JobroomTestModule],
                declarations: [OrganizationComponent],
                providers: [
                    OrganizationService
                ]
            })
            .overrideTemplate(OrganizationComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OrganizationComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrganizationService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Organization(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.organizations[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
