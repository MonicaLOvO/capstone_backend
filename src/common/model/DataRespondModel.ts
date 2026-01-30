export class DataRespondModel<T> {

    constructor(data: T | null = null, message?: string) {
        this.Data = data;
        this.Message = message ?? null;
    }

    Data: T | null = null;
    Message: string | null = null;
    Success: boolean = true;
}