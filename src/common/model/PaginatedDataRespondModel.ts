export class PaginatedDataRespondModel<T> {
    constructor(data: T | null = null, message?: string) {
        this.Data = data;
        this.Message = message ?? null;
    }

    Data: T | null = null;
    Message: string | null = null;
    Success: boolean = true;
    Total: number = 0;
    Page: number = 1;
    PageSize: number = 10;
}