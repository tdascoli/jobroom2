export enum ToolbarItem {
    JOB_SEEKERS,
    COMPANIES,
    RECRUITMENT_AGENCIES
}

export interface HomeLayoutState {
    activeToolbarItem: ToolbarItem,
    activeCompanyTabId: string,
    activeAgencyTabId: string,
}

export const initialState: HomeLayoutState = {
    activeToolbarItem: ToolbarItem.JOB_SEEKERS,
    activeCompanyTabId: 'company-job-publication',
    activeAgencyTabId: 'agency-candidate-search',
};
