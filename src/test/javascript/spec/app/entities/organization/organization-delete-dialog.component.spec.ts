/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { JobroomTestModule } from '../../../test.module';
import { OrganizationDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/organization/organization-delete-dialog.component';
import { OrganizationService } from '../../../../../../main/webapp/app/entities/organization/organization.service';

describe('Component Tests', () => {

    describe('Organization Management Delete Component', () => {
        let comp: OrganizationDeleteDialogComponent;
        let fixture: ComponentFixture<OrganizationDeleteDialogComponent>;
        let service: OrganizationService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [JobroomTestModule],
                declarations: [OrganizationDeleteDialogComponent],
                providers: [
                    OrganizationService
                ]
            })
            .overrideTemplate(OrganizationDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OrganizationDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(OrganizationService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
