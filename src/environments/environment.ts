/**
 * The file contents for the current environment will overwrite these during
 * build. Importantly, unlike previous environment setup the environment files
 * do not merge. Each environment file must standalone.
 *
 * The build system defaults to the dev environment which uses `environment.ts`,
 * but if you do `ng build --env=prod` then `environment.prod.ts` will be used
 * instead. The list of which env maps to which file can be found in
 * `.angular-cli.json`.
 *
 * https://github.com/angular/angular-cli/wiki/build
 */

// var NODE_ENV = process.env.NODE_ENV || "production"

export const environment = {
    runtimeEnv: 'development',
    logHTTPRequestsToConsole: true,
    appConstants: {
        coreApiBaseUrl: 'http://localhost:9000/api',
        serviceName: 'Apply for BC Health Care',
        enableLogging: true,
        logBaseUrl: '/msp/api/logging',
        apiBaseUrl: '/msp/api',
        aclContextPath: '/accLetterIntegration/',
        suppBenefitAPIUrl: '/accLetterIntegration/suppbenefit/',
        envServerBaseUrl: '/msp/api/env',
        captchaApiBaseUrl: '/msp/api/captcha',
        addressChangeBCUrl: 'https://www.addresschange.gov.bc.ca/',
        images: {
            maxImagesPerPerson: 50,
            maxWidth: 2600,
            maxHeight: 3300,
            minWidth: 0,
            minHeight: 0,
            maxSizeBytes: 1048576,
            reductionScaleFactor: 0.8,
            acceptMimeType: 'image/*',
            convertToMimeType: 'image/jpeg',
            jpegQuality: 0.5,
            pdfScaleFactor: 2.0
        }
        // mspIsInMaintenanceFlag: false,
        // mspIsInMaintenanceText: null,
        // mspIsInMaintenanceTimes: null,
    },
    /** Link used in app */
    links: {
        FAQ: 'https =//www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/managing-your-msp-account/msp-account-change-faqs',
        MSP_RESIDENT_CONTACT: 'http =//www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents-contact-us',
        MSP_ELIGIBILITY: 'http =//www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/eligibility-and-enrolment/are-you-eligible',
        MSP_ASSISTANCE: 'http =//www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/premiums/regular-premium-assistance',
        FPCARE: 'http =//www2.gov.bc.ca/gov/content/health/health-drug-coverage/pharmacare-for-bc-residents/who-we-cover/fair-pharmacare-plan',
        ICBC: 'www.icbc.com'
    },
    /** Do not trigger guards */
    bypassGuards: true
};
