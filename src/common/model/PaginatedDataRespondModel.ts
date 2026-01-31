export class PaginatedDataRespondModel<T> {
    constructor(data: T | null = null, total: number = 0, page?: string|null, pageSize?: string|null) {
        this.Data = data;
        this.Total = total;
        if(page)
        {
            if(!isNaN(Number(page)))
            {
                this.Page = Number(page);
            }
            else
            {
                this.Page = 1;
            }
            
        }
        if(pageSize)
        {
            if(isNaN(Number(pageSize)))
            {
                this.PageSize = Number(pageSize);
            }
            else
            {
                this.PageSize = 10;
            }
        }
    }

    Data: T | null = null;
    Message: string | null = null;
    Success: boolean = true;
    Total: number = 0;
    Page: number = 1;
    PageSize: number = 10;
}