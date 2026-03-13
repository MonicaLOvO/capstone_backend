
export interface InjuryReportModel {
    id: string;
    employeeName: string;
    reportedBy: string;
    injuryType: string;
    description: string;
    additionalNotes?: string;
    reportDate: Date;
    location?: string;
    witnesses?: string;
}

