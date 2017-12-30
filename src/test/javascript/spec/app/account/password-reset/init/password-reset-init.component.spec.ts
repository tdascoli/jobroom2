import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ElementRef, Renderer } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { JobroomTestModule } from '../../../../test.module';
import { PasswordResetInitComponent } from '../../../../../../../main/webapp/app/account/password-reset/init/password-reset-init.component';
import { PasswordResetInitService } from '../../../../../../../main/webapp/app/account/password-reset/init/password-reset-init.service';
import { USERNAME_NOT_FOUND_TYPE } from '../../../../../../../main/webapp/app/shared';

describe('Component Tests', () => {

    describe('PasswordResetInitComponent', () => {
        let fixture: ComponentFixture<PasswordResetInitComponent>;
        let comp: PasswordResetInitComponent;

        beforeEach(() => {
            fixture = TestBed.configureTestingModule({
                imports: [JobroomTestModule],
                declarations: [PasswordResetInitComponent],
                providers: [
                    PasswordResetInitService,
                    {
                        provide: Renderer,
                        useValue: {
                            invokeElementMethod(renderElement: any, methodName: string, args?: any[]) {
                            }
                        }
                    },
                    {
                        provide: ElementRef,
                        useValue: new ElementRef(null)
                    }
                ]
            }).overrideTemplate(PasswordResetInitComponent, '')
                .createComponent(PasswordResetInitComponent);
            comp = fixture.componentInstance;
            comp.ngOnInit();
        });

        it('should define its initial state', () => {
            expect(comp.success).toBeUndefined();
            expect(comp.error).toBeUndefined();
            expect(comp.errorUsernameNotExists).toBeUndefined();
            expect(comp.resetAccount).toEqual({});
        });

        it('sets focus after the view has been initialized',
            inject([ElementRef], (elementRef: ElementRef) => {
                const element = fixture.nativeElement;
                const node = {
                    focus() {
                    }
                };

                elementRef.nativeElement = element;
                spyOn(element, 'querySelector').and.returnValue(node);
                spyOn(node, 'focus');

                comp.ngAfterViewInit();

                expect(element.querySelector).toHaveBeenCalledWith('#username');
                expect(node.focus).toHaveBeenCalled();
            })
        );

        it('notifies of success upon successful requestReset',
            inject([PasswordResetInitService], (service: PasswordResetInitService) => {
                spyOn(service, 'save').and.returnValue(Observable.of({}));
                comp.resetAccount.username = 'johndoe';

                comp.requestReset();

                expect(service.save).toHaveBeenCalledWith('johndoe');
                expect(comp.success).toEqual('OK');
                expect(comp.error).toBeNull();
                expect(comp.errorUsernameNotExists).toBeNull();
            })
        );

        it('notifies of unknown username/400',
            inject([PasswordResetInitService], (service: PasswordResetInitService) => {
                spyOn(service, 'save').and.returnValue(Observable.throw({
                    status: 400,
                    json() {
                        return { type: USERNAME_NOT_FOUND_TYPE }
                    }
                }));
                comp.resetAccount.username = 'johndoe';

                comp.requestReset();

                expect(service.save).toHaveBeenCalledWith('johndoe');
                expect(comp.success).toBeNull();
                expect(comp.error).toBeNull();
                expect(comp.errorUsernameNotExists).toEqual('ERROR');
            })
        );

        it('notifies of error upon error response',
            inject([PasswordResetInitService], (service: PasswordResetInitService) => {
                spyOn(service, 'save').and.returnValue(Observable.throw({
                    status: 503,
                    data: 'something else'
                }));
                comp.resetAccount.username = 'johndoe';

                comp.requestReset();

                expect(service.save).toHaveBeenCalledWith('johndoe');
                expect(comp.success).toBeNull();
                expect(comp.errorUsernameNotExists).toBeNull();
                expect(comp.error).toEqual('ERROR');
            })
        );
    });
});
