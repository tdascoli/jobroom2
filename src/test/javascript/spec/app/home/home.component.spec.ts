import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from '../../../../../main/webapp/app/home/home.component';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

describe('HomeComponent', () => {
    const mockStore = jasmine.createSpyObj('mockStore', ['select', 'dispatch']);
    mockStore.select.and.returnValue(Observable.of([]));

    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomeComponent],
            providers: [
                { provide: Store, useValue: mockStore }
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
});
