import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from '../../../../../main/webapp/app/home/home.component';

describe('HomeComponent', () => {
    let component:HomeComponent;
    let fixture:ComponentFixture<HomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                declarations: [HomeComponent]
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