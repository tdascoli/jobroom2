import {
    EducationLevel, Experience,
    JobPublication, Locale, Status
} from '../../../../../main/webapp/app/shared/job-publication/job-publication.model';
import { CEFR_Level, DrivingLicenceCategory } from '../../../../../main/webapp/app/shared';

export function createJobPublication(): JobPublication {
    return {
        application: {
            additionalInfo: 'aa',
                electronic: true,
                email: 'bb',
                phoneEnabled: true,
                phoneNumber: 'cc',
                url: 'dd',
                written: true
        },
        company: {
            city: 'ee',
                countryCode: 'eeee',
                houseNumber: 'ff',
                name: 'gg',
                postboxCity: 'hh',
                postboxNumber: 'ii',
                postboxZipCode: 'jj',
                street: 'kk',
                zipCode: 'll'
        },
        contact: {
            email: 'mm',
                firstName: 'nn',
                lastName: 'oo',
                phoneNumber: 'pp',
                salutation: 'MS'
        },
        job: {
            description: 'qq',
                drivingLicenseLevel: DrivingLicenceCategory.B,
                endDate: '2017-12-14',
                languageSkills: [
                {
                    code: 'AVAM_2',
                    spokenLevel: CEFR_Level.NONE,
                    writtenLevel: CEFR_Level.NONE
                }
            ],
                location: {
                additionalDetails: 'rr',
                    city: 'Bern',
                    countryCode: 'CH',
                    zipCode: '2503'
            },
            occupation: {
                avamOccupation: 'sfsfa',
                educationLevel: EducationLevel.PRIMAR_OBLIGATORISCHE_SCHULE,
                experience: Experience.LESS_THAN_1_YEAR
            },
            permanent: true,
                startDate: '2017-12-14',
                startsImmediately: true,
                title: 'Test Stelle',
                workingTimePercentageMax: 80,
                workingTimePercentageMin: 90
        },
        publication: {
            eures: true,
            jobroom: true
        },
        status: Status.ACTIVE,
        locale: Locale.DE,
        accessToken: '832EDF45FEB5CF436897EEE1FA4C6EDE',
        creationDate: '2017-12-14'
    }
}
