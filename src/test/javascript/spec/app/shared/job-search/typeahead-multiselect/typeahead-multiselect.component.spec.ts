import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
    ItemDisplayModel,
    TypeaheadMultiselectComponent,
    TypeaheadMultiselectModel
} from '../../../../../../../main/webapp/app/shared/job-search';

describe('TypeaheadMultiselectComponent', () => {

    let component: TypeaheadMultiselectComponent;
    let fixture: ComponentFixture<TypeaheadMultiselectComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TypeaheadMultiselectComponent],
        })
            .overrideTemplate(TypeaheadMultiselectComponent, '<input #input/>') // we need only the @ViewChild
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TypeaheadMultiselectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('removeItem', () => {
        it('should remove an existing item', () => {
            // GIVEN
            component.selectedItems = [new TypeaheadMultiselectModel('type', 'code', 'label')];

            // WHEN
            component.removeItem(new TypeaheadMultiselectModel('type', 'code', 'label'));

            // THAN
            expect(component.selectedItems.length).toEqual(0);
        });
    });

    describe('selectFreeText', () => {
        it('should add a new model with type: free-text ', () => {
            // GIVEN
            component.selectedItems = [new TypeaheadMultiselectModel('type', 'code', 'label')];

            // WHEN
            component.inputValue = 'free text value';
            component.selectFreeText({});

            // THAN
            expect(component.selectedItems.length).toEqual(2);
            expect(component.selectedItems).toContain(new TypeaheadMultiselectModel('type', 'code', 'label'));
            expect(component.selectedItems).toContain(new TypeaheadMultiselectModel('free-text', 'free text value', 'free text value'));
        });

        it('should not allow duplicates', () => {
            // GIVEN
            component.selectedItems = [new TypeaheadMultiselectModel('free-text', 'free text value', 'free text value')];

            // WHEN
            component.inputValue = 'free text value';
            component.selectFreeText({});

            // THAN
            expect(component.selectedItems.length).toEqual(1);
            expect(component.selectedItems).toContain(new TypeaheadMultiselectModel('free-text', 'free text value', 'free text value'));
        });
    });

    describe('selectItem', () => {
        it('should add the selected item to the model', () => {
            // GIVEN
            component.selectedItems = [new TypeaheadMultiselectModel('type', 'code', 'label')];

            // WHEN
            const event = jasmine.createSpyObj('event', ['preventDefault']);
            event.item = { model: new TypeaheadMultiselectModel('type', 'code1', 'label1') };
            component.selectItem(event);

            // THAN
            expect(component.selectedItems.length).toEqual(2);
            expect(component.selectedItems).toContain(new TypeaheadMultiselectModel('type', 'code', 'label'));
            expect(component.selectedItems).toContain(new TypeaheadMultiselectModel('type', 'code1', 'label1'));
        });
    });

    describe('wrappedItemLoader', () => {
        let input$;
        beforeEach(() => {
            input$ = new BehaviorSubject('');
        });

        it('should not load items if the input is shorter than 3 characters', fakeAsync(() => {
            // GIVEN
            component.itemLoader = (value: string) => Observable.of([]);
            spyOn(component, 'itemLoader').and.callThrough();
            component.wrappedItemLoader(input$).subscribe((o: any) => '');

            // WHEN
            input$.next('12');
            tick(201);

            // THAN
            expect(component.itemLoader).not.toHaveBeenCalled();
        }));

        it('should load items if the input is longer than 3 characters (inclusive)', fakeAsync(() => {
            // GIVEN
            component.itemLoader = (value: string) => Observable.of([]);
            spyOn(component, 'itemLoader').and.callThrough();
            component.wrappedItemLoader(input$).subscribe((o: any) => '');

            // WHEN
            input$.next('123');
            tick(201);

            // THAN
            expect(component.itemLoader).toHaveBeenCalledWith('123');
        }));

        it('should filter the already selected values from the loaded items', fakeAsync(() => {
            let loadedItems: Array<any>;

            // GIVEN
            component.selectedItems = [new TypeaheadMultiselectModel('type', 'code', 'label')];
            component.itemLoader = (value: string) => Observable.of([new TypeaheadMultiselectModel('type', 'code', 'label')]);
            component.wrappedItemLoader(input$).subscribe((items: any) => loadedItems = items);

            // WHEN
            input$.next('123');
            tick(201);

            // THAN
            expect(loadedItems.length).toEqual(0);
        }));

        it('should sort the loaded items by the order property', fakeAsync(() => {
            let loadedItems: Array<any>;

            // GIVEN
            component.itemLoader = (value: string) => Observable.of([
                new TypeaheadMultiselectModel('type', 'code0', 'label0', 3),
                new TypeaheadMultiselectModel('type', 'code1', 'label1', 2),
                new TypeaheadMultiselectModel('type', 'code2', 'label2', 0),
                new TypeaheadMultiselectModel('type', 'code3', 'label3', 1)
            ]);
            component.wrappedItemLoader(input$).subscribe((items: any) => loadedItems = items);

            // WHEN
            input$.next('123');
            tick(201);

            // THAN
            expect(loadedItems).toEqual([
                new ItemDisplayModel(new TypeaheadMultiselectModel('type', 'code2', 'label2', 0), true, true),
                new ItemDisplayModel(new TypeaheadMultiselectModel('type', 'code3', 'label3', 1), false, false),
                new ItemDisplayModel(new TypeaheadMultiselectModel('type', 'code1', 'label1', 2), false, false),
                new ItemDisplayModel(new TypeaheadMultiselectModel('type', 'code0', 'label0', 3), false, false)
            ]);
        }));

        it('should mark the first items for every type', fakeAsync(() => {
            let loadedItems: Array<any>;

            // GIVEN
            component.itemLoader = (value: string) => Observable.of([
                new TypeaheadMultiselectModel('type0', 'code0', 'label0', 0),
                new TypeaheadMultiselectModel('type0', 'code1', 'label1', 0),
                new TypeaheadMultiselectModel('type1', 'code2', 'label2', 1),
                new TypeaheadMultiselectModel('type1', 'code3', 'label3', 1)
            ]);
            component.wrappedItemLoader(input$).subscribe((items: any) => loadedItems = items);

            // WHEN
            input$.next('123');
            tick(201);

            // THAN
            expect(loadedItems).toEqual([
                new ItemDisplayModel(new TypeaheadMultiselectModel('type0', 'code0', 'label0', 0), true, true),
                new ItemDisplayModel(new TypeaheadMultiselectModel('type0', 'code1', 'label1', 0), false, false),
                new ItemDisplayModel(new TypeaheadMultiselectModel('type1', 'code2', 'label2', 1), false, true),
                new ItemDisplayModel(new TypeaheadMultiselectModel('type1', 'code3', 'label3', 1), false, false)
            ]);
        }));
    });
});
