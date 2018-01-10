import { JobPublication } from '../../../shared/job-publication/job-publication.model';
import { OccupationOption } from '../../../shared/reference-service';
import { DateUtils } from '../../../shared';

export class JobPublicationMapper {

    static mapJobPublicationToFormModel(jobPublication: JobPublication): any {
        const value: any = Object.assign({}, jobPublication);
        const workload = [jobPublication.job.workingTimePercentageMin,
            jobPublication.job.workingTimePercentageMax];

        value.job.occupation.occupationSuggestion = {
            key: jobPublication.idAvam,
            label: jobPublication.job.occupation.avamOccupation
        } as OccupationOption;

        value.job.languageSkills = value.job.languageSkills
            .map((languageSkill) => ({
                code: languageSkill.code,
                spoken: languageSkill.spokenLevel,
                written: languageSkill.writtenLevel
            }));

        Object.assign(value.job.location, {
            zipCode: {
                zip: jobPublication.job.location.zipCode,
                city: jobPublication.job.location.city,
                communalCode: jobPublication.job.location.communalCode
            }
        });

        Object.assign(value.job, {
            workload,
            publicationStartDate: {
                immediate: jobPublication.job.startsImmediately,
                date: DateUtils.dateStringToToNgbDateStruct(jobPublication.job.startDate)
            },
            publicationEndDate: {
                permanent: jobPublication.job.permanent,
                date: DateUtils.dateStringToToNgbDateStruct(jobPublication.job.endDate)
            },
        });

        Object.assign(value.company, {
            zipCode: {
                zip: jobPublication.company.zipCode,
                city: jobPublication.company.city,
            },
            postboxZipCode: {
                zip: jobPublication.company.postboxZipCode,
                city: jobPublication.company.postboxCity,
            }
        });

        return value;
    }

    static mapJobPublicationFormToJobPublication(jobPublicationForm: any): JobPublication {
        const jobPublication: JobPublication = JSON.parse(JSON.stringify(jobPublicationForm)); // deep copy;

        const jobFormOccupation = jobPublicationForm.job.occupation.occupationSuggestion;
        if (jobFormOccupation) {
            jobPublication.job.occupation.avamOccupation = jobFormOccupation.label;
        }

        jobPublication.job.languageSkills = jobPublicationForm.job.languageSkills
            .filter((languageSkill) => languageSkill.code && languageSkill.code.length)
            .map((languageSkill) => ({
                code: languageSkill.code,
                spokenLevel: languageSkill.spoken,
                writtenLevel: languageSkill.written
            }));

        Object.assign(jobPublication.job.location, {
            zipCode: jobPublicationForm.job.location.zipCode.zip,
            city: jobPublicationForm.job.location.zipCode.city,
            communalCode: jobPublicationForm.job.location.zipCode.communalCode
        });

        Object.assign(jobPublication.job, {
            workingTimePercentageMin: jobPublicationForm.job.workload[0],
            workingTimePercentageMax: jobPublicationForm.job.workload[1],
            startsImmediately: jobPublicationForm.job.publicationStartDate.immediate,
            startDate: DateUtils.convertNgbDateStructToString(jobPublicationForm.job.publicationStartDate.date),
            permanent: jobPublicationForm.job.publicationEndDate.permanent,
            endDate: DateUtils.convertNgbDateStructToString(jobPublicationForm.job.publicationEndDate.date),
        });

        Object.assign(jobPublication.company, {
            zipCode: jobPublicationForm.company.zipCode.zip,
            city: jobPublicationForm.company.zipCode.city
        });

        if (jobPublicationForm.company.postboxZipCode) {
            Object.assign(jobPublication.company, {
                postboxZipCode: jobPublicationForm.company.postboxZipCode.zip,
                postboxCity: jobPublicationForm.company.postboxZipCode.city
            });
        }

        delete jobPublication.idAvam;
        delete (<any> jobPublication).job.occupation.occupationSuggestion;
        delete (<any> jobPublication).job.workload;
        delete (<any> jobPublication).job.publicationStartDate;
        delete (<any> jobPublication).job.publicationEndDate;
        delete (<any> jobPublication).disclaimer;

        return jobPublication;
    }
}
