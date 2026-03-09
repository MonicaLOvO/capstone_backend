export interface EmployeeReportModel {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  reportType: string;
  reportDate: Date;
  reportedBy: string;
  description: string;
  previousWarnings?: string;
  additionalNotes?: string;
  actionTaken?: string;
}