import { browser, by, element } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

const path = require('path');

describe('Organization e2e test', () => {

    let navBarPage: NavBarPage;
    let organizationDialogPage: OrganizationDialogPage;
    let organizationComponentsPage: OrganizationComponentsPage;
    const fileToUpload = '../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Organizations', () => {
        navBarPage.goToEntity('organization');
        organizationComponentsPage = new OrganizationComponentsPage();
        expect(organizationComponentsPage.getTitle()).toMatch(/jobroomApp.organization.home.title/);

    });

    it('should load create Organization dialog', () => {
        organizationComponentsPage.clickOnCreateButton();
        organizationDialogPage = new OrganizationDialogPage();
        expect(organizationDialogPage.getModalTitle()).toMatch(/jobroomApp.organization.home.createOrEditLabel/);
        organizationDialogPage.close();
    });

    it('should create and save Organizations', () => {
        organizationComponentsPage.clickOnCreateButton();
        organizationDialogPage.setExternalIdInput('externalId');
        expect(organizationDialogPage.getExternalIdInput()).toMatch('externalId');
        organizationDialogPage.setNameInput('name');
        expect(organizationDialogPage.getNameInput()).toMatch('name');
        organizationDialogPage.setStreetInput('street');
        expect(organizationDialogPage.getStreetInput()).toMatch('street');
        organizationDialogPage.setZipCodeInput('zipCode');
        expect(organizationDialogPage.getZipCodeInput()).toMatch('zipCode');
        organizationDialogPage.setCityInput('city');
        expect(organizationDialogPage.getCityInput()).toMatch('city');
        organizationDialogPage.setEmailInput('email');
        expect(organizationDialogPage.getEmailInput()).toMatch('email');
        organizationDialogPage.setPhoneInput('phone');
        expect(organizationDialogPage.getPhoneInput()).toMatch('phone');
        organizationDialogPage.typeSelectLastOption();
        organizationDialogPage.getActiveInput().isSelected().then(function(selected) {
            if (selected) {
                organizationDialogPage.getActiveInput().click();
                expect(organizationDialogPage.getActiveInput().isSelected()).toBeFalsy();
            } else {
                organizationDialogPage.getActiveInput().click();
                expect(organizationDialogPage.getActiveInput().isSelected()).toBeTruthy();
            }
        });
        organizationDialogPage.save();
        expect(organizationDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class OrganizationComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-organization div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class OrganizationDialogPage {
    modalTitle = element(by.css('h4#myOrganizationLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    externalIdInput = element(by.css('input#field_externalId'));
    nameInput = element(by.css('input#field_name'));
    streetInput = element(by.css('input#field_street'));
    zipCodeInput = element(by.css('input#field_zipCode'));
    cityInput = element(by.css('input#field_city'));
    emailInput = element(by.css('input#field_email'));
    phoneInput = element(by.css('input#field_phone'));
    typeSelect = element(by.css('select#field_type'));
    activeInput = element(by.css('input#field_active'));

    setExternalIdInput = function(externalId) {
        this.externalIdInput.sendKeys(externalId);
    };
    getExternalIdInput = function() {
        return this.externalIdInput.getAttribute('value');
    };
    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };
    getNameInput = function() {
        return this.nameInput.getAttribute('value');
    };
    setStreetInput = function(street) {
        this.streetInput.sendKeys(street);
    };
    getStreetInput = function() {
        return this.streetInput.getAttribute('value');
    };
    setZipCodeInput = function(zipCode) {
        this.zipCodeInput.sendKeys(zipCode);
    };
    getZipCodeInput = function() {
        return this.zipCodeInput.getAttribute('value');
    };
    setCityInput = function(city) {
        this.cityInput.sendKeys(city);
    };
    getCityInput = function() {
        return this.cityInput.getAttribute('value');
    };
    setEmailInput = function(email) {
        this.emailInput.sendKeys(email);
    };
    getEmailInput = function() {
        return this.emailInput.getAttribute('value');
    };
    setPhoneInput = function(phone) {
        this.phoneInput.sendKeys(phone);
    };
    getPhoneInput = function() {
        return this.phoneInput.getAttribute('value');
    };
    setTypeSelect = function(type) {
        this.typeSelect.sendKeys(type);
    };
    getTypeSelect = function() {
        return this.typeSelect.element(by.css('option:checked')).getText();
    };
    typeSelectLastOption = function() {
        this.typeSelect.all(by.tagName('option')).last().click();
    };
    getActiveInput = function() {
        return this.activeInput;
    };

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }
    save() {
        this.saveButton.click();
    }

    close() {
        this.closeButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}
