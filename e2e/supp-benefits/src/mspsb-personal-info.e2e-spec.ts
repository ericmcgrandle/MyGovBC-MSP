import { browser, element, by } from 'protractor';
import { PersonalInfoPage } from './mspsb-supp-benefits.po';
import { FakeDataSupplementaryBenefits } from './mspsb-supp-benefits.data';
import { testGenericSubsequentPage, testGenericAllPages } from '../../msp-generic-tests';
import { p } from '@angular/core/src/render3';

describe('MSP Supplementary Benefits - Personal Info Page:', () => {
    let page: PersonalInfoPage;
    const data = new FakeDataSupplementaryBenefits;
    let personalInfoData;
    const FINANCIAL_PAGE_URL = `msp/benefit/financial-info`
    const PERSONAL_PAGE_URL = `msp/benefit/personal-info`
    const SPOUSE_PAGE_URL = `msp/benefit/spouse-info`

    beforeEach(() => {
        page = new PersonalInfoPage();
        personalInfoData = data.personalInfo();
        data.setSeed();
    });

    afterEach(() => {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

    testGenericAllPages(PersonalInfoPage, PERSONAL_PAGE_URL);
    testGenericSubsequentPage(PersonalInfoPage, {prevLink: 'Financial Info', nextLink: 'Spouse Info'}, {PAGE_URL: PERSONAL_PAGE_URL, PREV_PAGE_URL: FINANCIAL_PAGE_URL, NEXT_PAGE_URL: SPOUSE_PAGE_URL});

    it('01. should fill out the required fields and click continue', () => {
        page.navigateTo();
        page.fillInfo(personalInfoData);
        page.continue();
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL);
    });

    it('02. should capture invalid PHN and SIN', () => {
        personalInfoData.PHN = personalInfoData.SIN = '1234567890';
        page.navigateTo();
        page.fillInfo(personalInfoData);
        browser.sleep(5000);
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should stay on the same page');
    });
});