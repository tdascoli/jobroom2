import { browser } from 'protractor';
import { JobSearchPage } from './job-search.po';

describe('job-search', () => {
    let page: JobSearchPage;

    beforeEach(() => {
        page = new JobSearchPage();
        page.navigateTo();
        browser.waitForAngular();
    });

    it('should load job search', async() => {
        expect(await browser.getTitle()).toEqual('Job search');
    });

    describe('Occupation autocomplete', () => {
        let autocomplete;

        beforeEach(() => {
            autocomplete = page.occupationAutocomplete();
        });

        it('should possible to enter free text and delete it', async() => {
            // add an item
            const input = autocomplete.inputElement();
            input.sendKeys('java');
            input.submit();

            // check item text
            const tags = autocomplete.tags();
            expect(tags.first().isPresent()).toBeTruthy();
            expect(await tags.first().getText()).toEqual('java');

            // remove item
            autocomplete.deleteFirstTag();
            expect(autocomplete.tags().isPresent()).toBeFalsy();
        });

        it('should possible to select an item from suggest box and delete it', async() => {
            // trigger suggest box
            const input = autocomplete.inputElement();
            input.sendKeys('informatik');

            const suggestBox = autocomplete.suggestBox();
            expect(suggestBox.isDisplayed()).toBeTruthy();

            // select item
            const dropdown = autocomplete.dropdownItem('Projekt Manager Informatik');
            expect(dropdown.isPresent()).toBeTruthy();
            dropdown.click();

            // check item
            const tags = autocomplete.tags();
            expect(tags.first().isPresent()).toBeTruthy();
            expect(await tags.first().getText()).toEqual('Projekt Manager Informatik');

            // remove item
            autocomplete.deleteFirstTag();
            expect(autocomplete.tags().isPresent()).toBeFalsy();
        });
    });
});
